export interface TT2SaveData {
  artifacts: Record<string, number>;
  skillLevels: Record<string, number>;
  totalSP: number;
  spentSP: number;
  maxStage: number;
  currentStage: number;
  relics: number;
  lifetimeRelics: number;
  raidStats: {
    cardLevels: Record<string, number>;
    playerLevel: number;
  };
}

export class SaveFileParser {
  static parse(rawJson: string): TT2SaveData {
    try {
      const outerData = JSON.parse(rawJson);
      
      // The save string is often nested inside a 'saveString' key
      const saveString = outerData.saveString || rawJson;
      const data = typeof saveString === 'string' ? JSON.parse(saveString) : saveString;

      const result: TT2SaveData = {
        artifacts: {},
        skillLevels: {},
        totalSP: 0,
        spentSP: 0,
        maxStage: 0,
        currentStage: 0,
        relics: 0,
        lifetimeRelics: 0,
        raidStats: {
          cardLevels: {},
          playerLevel: 0,
        },
      };

      // Extract Artifacts
      if (data.ArtifactModel) {
        const artifacts = data.ArtifactModel.artifacts || {};
        Object.keys(artifacts).forEach((key) => {
          result.artifacts[key] = artifacts[key].level || 0;
        });
      }

      // Extract SP and Skills
      if (data.SkillTreeModel) {
        result.totalSP = data.SkillTreeModel.totalSkillPoints || 0;
        result.spentSP = data.SkillTreeModel.spentSkillPoints || 0;
        const skills = data.SkillTreeModel.skillLevels || {};
        Object.keys(skills).forEach((key) => {
          result.skillLevels[key] = skills[key] || 0;
        });
      }

      // Extract Stages and Relics
      if (data.StageLogicController) {
        result.currentStage = data.StageLogicController.currentStage?.$content || 0;
      }
      
      if (data.PlayerModel) {
        result.maxStage = data.PlayerModel.maxStage || 0;
        result.relics = data.PlayerModel.relics || 0;
        result.lifetimeRelics = data.PlayerModel.lifetimeRelics || 0;
      }

      // Extract Raid Stats
      if (data.RaidModel) {
        result.raidStats.playerLevel = data.RaidModel.playerLevel || 0;
        const cards = data.RaidModel.cardLevels || {};
        Object.keys(cards).forEach((key) => {
          result.raidStats.cardLevels[key] = cards[key] || 0;
        });
      }

      return result;
    } catch (error) {
      console.error('Failed to parse TT2 save data:', error);
      throw new Error('Invalid TT2 save data format');
    }
  }
}
