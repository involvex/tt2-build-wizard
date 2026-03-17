import skillsData from './skills.json';
import reductionsData from './reductions.json';

export type BuildType = 'Clan Ship' | 'Shadow Clone' | 'Heavenly Strike' | 'Pet' | 'Dagger' | 'Gold Gun';
export type GoldSource = 'Fairy' | 'HoG' | 'Chesterson';

export interface SkillInfo {
    Name: string;
    MaxLevel: number;
    SPReq: number;
    TalentReq: string;
    BonusTypeA: string;
    BonusTypeB: string;
    BonusTypeC: string;
    [key: string]: any; // For A0, A1... Co0, Co1...
}

export interface SkillLevel {
    skillId: string;
    level: number;
}

export class OptimizerEngine {
    private skills: Record<string, SkillInfo>;
    private reductions: Record<string, Record<string, number | null>>;

    constructor() {
        this.skills = skillsData as Record<string, SkillInfo>;
        this.reductions = reductionsData as Record<string, Record<string, number | null>>;
    }

    private getBonus(skillId: string, level: number, bonusChar: 'A' | 'B' | 'C'): number {
        const val = this.skills[skillId][`${bonusChar}${level}`];
        if (val === '-' || val === undefined || parseFloat(val) === 0) return 1;
        return parseFloat(val);
    }

    private getCost(skillId: string, level: number): number {
        const val = this.skills[skillId][`Co${level}`];
        return parseInt(val) || 0;
    }

    private calculateEfficiency(
        skillId: string, 
        currentLevel: number, 
        build: BuildType, 
        gold: GoldSource
    ): number {
        const skill = this.skills[skillId];
        if (currentLevel >= skill.MaxLevel) return -1;

        const nextLevel = currentLevel + 1;
        const spCost = this.getCost(skillId, nextLevel) - this.getCost(skillId, currentLevel);
        
        if (spCost <= 0) return 0;

        let totalLogGain = 0;

        // Calculate for each bonus type (A, B, C)
        for (const bonusChar of ['A', 'B', 'C'] as const) {
            const bonusType = skill[`BonusType${bonusChar}`];
            if (bonusType === 'None' || !bonusType) continue;

            // Normalize bonus type key if needed
            let reductionKey = bonusType;
            if (bonusType === 'TapDamage') reductionKey = 'TapDmg';
            if (bonusType === 'AllHelperDamage') reductionKey = 'AllHelperDmg';

            const reductionFactor = (this.reductions[reductionKey]?.[build] ?? 0)
                                 || (this.reductions[reductionKey]?.[gold] ?? 0);

            const currentBonus = this.getBonus(skillId, currentLevel, bonusChar);
            const nextBonus = this.getBonus(skillId, nextLevel, bonusChar);

            if (currentBonus > 0 && nextBonus > 0) {
                const gain = Math.log10(nextBonus) - Math.log10(currentBonus);
                totalLogGain += gain * (reductionFactor || 0);
            }
        }

        return totalLogGain / spCost;
    }

    public optimize(
        availableSP: number, 
        build: BuildType, 
        gold: GoldSource, 
        initialLevels: Record<string, number> = {}
    ): SkillLevel[] {
        const currentLevels = { ...initialLevels };
        const results: SkillLevel[] = [];
        let spentSP = 0;

        // Initialize levels for all skills if not provided
        for (const skillId in this.skills) {
            if (currentLevels[skillId] === undefined) {
                currentLevels[skillId] = 0;
            }
        }

        while (spentSP < availableSP) {
            let bestSkillId: string | null = null;
            let maxEff = -1;

            for (const skillId in this.skills) {
                // Skip if requirements not met (simplified for now)
                // TODO: Implement requirement checking
                
                const eff = this.calculateEfficiency(skillId, currentLevels[skillId], build, gold);
                if (eff > maxEff) {
                    maxEff = eff;
                    bestSkillId = skillId;
                }
            }

            if (!bestSkillId || maxEff <= 0) break;

            const nextLevel = currentLevels[bestSkillId] + 1;
            const cost = this.getCost(bestSkillId, nextLevel) - this.getCost(bestSkillId, currentLevels[bestSkillId]);

            if (spentSP + cost > availableSP) {
                // Mark as too expensive and try others? 
                // For simplicity, we just stop or could look for the next best that fits.
                // A better approach would be to filter skills that fit in available SP.
                break; 
            }

            currentLevels[bestSkillId] = nextLevel;
            spentSP += cost;
            results.push({ skillId: bestSkillId, level: nextLevel });
        }

        return results;
    }
}
