import equipmentSetsData from './equipment_sets.json';
import { BuildType } from './optimizer';

export interface EquipmentSetInfo {
  EquipmentSet: string;
  SetType: 'Mythic' | 'Legendary' | 'Event' | 'Rare';
  CraftCost1: number;
  CraftCost2: number;
  CraftCost3: number;
  CraftCost4: number;
  CraftCost5: number;
  [key: string]: any;
}

export interface SetRecommendation {
  setName: string;
  type: string;
  priority: number;
  reason: string;
}

export class EquipmentOptimizerEngine {
  private sets: Record<string, EquipmentSetInfo>;

  constructor() {
    this.sets = equipmentSetsData as Record<string, EquipmentSetInfo>;
  }

  public getRecommendations(
    build: BuildType,
    ownedSets: string[]
  ): SetRecommendation[] {
    const recommendations: SetRecommendation[] = [];

    for (const setId in this.sets) {
      if (ownedSets.includes(setId)) continue;

      const set = this.sets[setId];
      let priority = 0;
      let reason = '';

      // Mythics always have baseline high priority
      if (set.SetType === 'Mythic') {
        priority = 50;
        reason = 'High relic boost and powerful unique effects.';
      } else if (set.SetType === 'Legendary') {
        priority = 20;
        reason = 'Efficient stat boosts for specific builds.';
      }

      // Build-specific logic
      if (build === 'Shadow Clone') {
        if (setId === 'Skulls') { priority += 100; reason = 'Essential for Shadow Clone splash.'; }
        if (setId === 'RuthlessNecromancer') { priority += 90; reason = 'Primary damage and utility boost.'; }
      }

      if (build === 'Clan Ship') {
        if (setId === 'AncientWarrior') { priority += 100; reason = 'Doubles companion attack rate.'; }
        if (setId === 'AirshipEngineer') { priority += 80; reason = 'Significant Clan Ship damage boost.'; }
      }

      if (priority > 0) {
        recommendations.push({
          setName: setId,
          type: set.SetType,
          priority,
          reason
        });
      }
    }

    return recommendations.sort((a, b) => b.priority - a.priority);
  }
}
