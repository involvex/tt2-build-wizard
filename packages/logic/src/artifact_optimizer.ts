import artifactsData from './artifacts.json';
import { BuildType, GoldSource } from './optimizer';

export interface ArtifactInfo {
  ArtifactID: string;
  Name: string;
  Tier: number;
  BonusType: string;
  MaxLevel: number;
  EffectPerLevel: number;
  GrowthExpo: number;
  DamageBonus: number;
  CostCoef: number;
  CostExpo: number;
  BonusIcon: string;
  [key: string]: any;
}

export interface ArtifactLevel {
  artifactId: string;
  level: number;
  relicsSpent: number;
  name: string;
  efficiency: number;
  costToNext: number;
}

export class ArtifactOptimizerEngine {
  private artifacts: Record<string, ArtifactInfo>;
  private goldArtifacts = ['Artifact19', 'Artifact1', 'Artifact44', 'Artifact45', 'Artifact79', 'Artifact95', 'Artifact2', 'Artifact20', 'Artifact23', 'Artifact43', 'Artifact66', 'Artifact82', 'Artifact53', 'Artifact97', 'Artifact9'];

  constructor() {
    this.artifacts = artifactsData as Record<string, ArtifactInfo>;
  }

  public getCostAtLevel(artifactId: string, level: number): number {
    const art = this.artifacts[artifactId];
    if (!art) return 0;
    return (art.CostCoef / (1 + art.CostExpo)) * Math.pow(level, 1 + art.CostExpo);
  }

  public getCostToLevel(artifactId: string, currentLevel: number, targetLevel: number): number {
    return this.getCostAtLevel(artifactId, targetLevel) - this.getCostAtLevel(artifactId, currentLevel);
  }

  public getLevelForRelics(artifactId: string, currentLevel: number, relics: number): number {
    const art = this.artifacts[artifactId];
    if (!art) return currentLevel;
    
    const costExpoIncreased = art.CostExpo + 1;
    const currentCostSum = (art.CostCoef / costExpoIncreased) * Math.pow(currentLevel, costExpoIncreased);
    
    const newLevel = Math.pow(
      (relics + currentCostSum) / (art.CostCoef / costExpoIncreased),
      1 / costExpoIncreased
    );

    return Math.floor(newLevel);
  }

  public getEffectAtLevel(artifactId: string, level: number): number {
    const art = this.artifacts[artifactId];
    if (!art) return 1;
    return 1 + art.EffectPerLevel * Math.pow(level, art.GrowthExpo);
  }

  private isArtifactIgnored(artifactId: string, build: BuildType, gold: GoldSource): boolean {
    const art = this.artifacts[artifactId];
    if (!art) return true;

    // Simplified ignore logic based on GoldSource
    switch (artifactId) {
      case 'Artifact19': // Chest of Contentment
        return gold !== 'Chesterson' && gold !== 'Fairy';
      case 'Artifact1': // Heroic Shield
        return gold !== 'HoG';
      case 'Artifact44': // Great Fay Medallion
        return gold !== 'Fairy';
      case 'Artifact45': // Neko Sculpture
        return gold !== 'HoG';
      case 'Artifact79': // Coins of Ebizu
        return gold !== 'Chesterson';
      default:
        return false;
    }
  }

  private calculateEfficiency(
    artifactId: string,
    currentLevel: number,
    relicsToSpend: number,
    build: BuildType,
    gold: GoldSource,
    lifetimeRelics: number
  ): number {
    const art = this.artifacts[artifactId];
    if (this.isArtifactIgnored(artifactId, build, gold)) return -1;
    if (art.MaxLevel > 0 && currentLevel >= art.MaxLevel) return -1;

    // BoS Special Case (Artifact22)
    if (artifactId === 'Artifact22') {
      const relicsSpentOnBos = this.getCostAtLevel(artifactId, currentLevel);
      const bosPercentage = (relicsSpentOnBos / lifetimeRelics) * 100;
      const targetBosPercentage = 50; // Default target
      return bosPercentage < targetBosPercentage ? 1e15 : -1;
    }

    const nextLevel = this.getLevelForRelics(artifactId, currentLevel, relicsToSpend);
    if (nextLevel <= currentLevel) return -1;

    const currentEffect = this.getEffectAtLevel(artifactId, currentLevel);
    const nextEffect = this.getEffectAtLevel(artifactId, nextLevel);
    
    // Weighting (ActiveRatio in C#)
    let weight = 0.5; // Default weight
    
    // Simple build-based weighting
    if (artifactId === 'Artifact30' && build === 'Clan Ship') weight = 1.0;
    if (artifactId === 'Artifact6' && build === 'Shadow Clone') weight = 1.0;
    if (artifactId === 'Artifact38' && build === 'Pet') weight = 1.0;

    const effRatio = Math.pow(nextEffect / currentEffect, weight);
    const cost = this.getCostToLevel(artifactId, currentLevel, nextLevel);

    return effRatio / cost;
  }

  public optimize(
    availableRelics: number,
    build: BuildType,
    gold: GoldSource,
    currentLevels: Record<string, number>,
    lifetimeRelics: number
  ): ArtifactLevel[] {
    let remainingRelics = availableRelics;
    const workingLevels = { ...currentLevels };
    const results: ArtifactLevel[] = [];
    
    // Max iterations to prevent infinite loops
    let iterations = 0;
    const maxIterations = 50;

    while (remainingRelics > 0 && iterations < maxIterations) {
      let bestArtId = '';
      let maxEff = -1;

      // Use a step of available relics for calculation (e.g. 5% or 25%)
      const stepRelics = remainingRelics * 0.25;

      for (const artId in this.artifacts) {
        if (workingLevels[artId] === undefined) workingLevels[artId] = 0;
        
        const eff = this.calculateEfficiency(
          artId,
          workingLevels[artId],
          stepRelics,
          build,
          gold,
          lifetimeRelics
        );

        if (eff > maxEff) {
          maxEff = eff;
          bestArtId = artId;
        }
      }

      if (!bestArtId || maxEff <= 0) break;

      const targetLevel = this.getLevelForRelics(bestArtId, workingLevels[bestArtId], stepRelics);
      const cost = this.getCostToLevel(bestArtId, workingLevels[bestArtId], targetLevel);

      if (cost > remainingRelics || targetLevel <= workingLevels[bestArtId]) break;

      results.push({
        artifactId: bestArtId,
        level: targetLevel,
        relicsSpent: cost,
        name: this.artifacts[bestArtId].Name,
        efficiency: maxEff,
        costToNext: cost
      });

      workingLevels[bestArtId] = targetLevel;
      remainingRelics -= cost;
      iterations++;
    }

    return results;
  }
}
