export interface TT2SaveData {
	artifacts: Record<string, number>
	skillLevels: Record<string, number>
	totalSP: number
	spentSP: number
	maxStage: number
	currentStage: number
	relics: number
	lifetimeRelics: number
	craftingShards: number
	ownedEquipmentSets: string[]
	raidStats: {
		cardLevels: Record<string, number>
		playerLevel: number
	}
}

export class SaveFileParser {
	private static parseNumber(val: any): number {
		if (typeof val === 'number') return val
		if (typeof val !== 'string') return 0
		// Remove commas and handle scientific notation
		const clean = val.replace(/,/g, '').replace(/[^\d.eE+-]/g, '')
		const parsed = parseFloat(clean)
		return isNaN(parsed) ? 0 : parsed
	}

	private static getValue(obj: any, keys: string[]): any {
		if (!obj) return undefined
		for (const key of keys) {
			if (obj[key] !== undefined) return obj[key]
			// Case-insensitive fallback
			const found = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase())
			if (found) return obj[found]
		}
		return undefined
	}

	static parse(rawJson: string): TT2SaveData {
		try {
			const data = JSON.parse(rawJson)

			// Heuristic: Check if it's a summary or a full save
			const isSummary = data.playerStats || data.artifacts || data.raidStats || data.skillTree
			
			if (isSummary) {
				return this.parseSummary(data)
			}

			// The save string is often nested inside a 'saveString' key
			const saveString = data.saveString || rawJson
			const parsedData =
				typeof saveString === 'string' ? JSON.parse(saveString) : saveString

			const result: TT2SaveData = {
				artifacts: {},
				skillLevels: {},
				totalSP: 0,
				spentSP: 0,
				maxStage: 0,
				currentStage: 0,
				relics: 0,
				lifetimeRelics: 0,
				craftingShards: 0,
				ownedEquipmentSets: [],
				raidStats: {
					cardLevels: {},
					playerLevel: 0,
				},
			}

			// Extract Artifacts
			if (parsedData.ArtifactModel) {
				const artifacts = parsedData.ArtifactModel.artifacts || {}
				Object.keys(artifacts).forEach(key => {
					result.artifacts[key] = this.parseNumber(artifacts[key].level)
				})
			}

			// Extract SP and Skills
			if (parsedData.SkillTreeModel) {
				result.totalSP = this.parseNumber(parsedData.SkillTreeModel.totalSkillPoints)
				result.spentSP = this.parseNumber(parsedData.SkillTreeModel.spentSkillPoints)
				const skills = parsedData.SkillTreeModel.skillLevels || {}
				Object.keys(skills).forEach(key => {
					result.skillLevels[key] = this.parseNumber(skills[key])
				})
			}

			// Extract Stages and Relics
			if (parsedData.StageLogicController) {
				result.currentStage = this.parseNumber(
					parsedData.StageLogicController.currentStage?.$content || 
					parsedData.StageLogicController.currentStage
				)
			}

			if (parsedData.PlayerModel) {
				result.maxStage = this.parseNumber(parsedData.PlayerModel.maxStage)
				result.relics = this.parseNumber(parsedData.PlayerModel.relics)
				result.lifetimeRelics = this.parseNumber(parsedData.PlayerModel.lifetimeRelics)
				result.craftingShards = this.parseNumber(parsedData.PlayerModel.craftingShards)
			}

			// Extract Equipment Sets
			if (parsedData.EquipmentSetModel) {
				result.ownedEquipmentSets = parsedData.EquipmentSetModel.completedSets || []
			}

			// Extract Raid Stats
			if (parsedData.RaidModel) {
				result.raidStats.playerLevel = this.parseNumber(parsedData.RaidModel.playerLevel)
				const cards = parsedData.RaidModel.cardLevels || {}
				Object.keys(cards).forEach(key => {
					result.raidStats.cardLevels[key] = this.parseNumber(cards[key])
				})
			}

			return result
		} catch (error) {
			console.error('Failed to parse TT2 save data:', error)
			throw new Error('Invalid TT2 save data format')
		}
	}

	private static parseSummary(data: any): TT2SaveData {
		const stats = data.playerStats || {}
		const rStats = data.raidStats || {}
		
		const ms = this.parseNumber(this.getValue(stats, ['Max Prestige Stage', 'Max Stage', 'Highest Stage', 'MS']))
		const sp = this.parseNumber(this.getValue(stats, ['Skill Points Owned', 'Total Skill Points', 'Skill Points', 'SP']))
		const lifetimeRelics = this.parseNumber(this.getValue(stats, ['Lifetime Relics', 'Total Relics']))
		const raidLevel = this.parseNumber(this.getValue(rStats, ['Raid Level', 'Level']))
		const shards = this.parseNumber(this.getValue(stats, ['Crafting Power', 'Shards']))

		const result: TT2SaveData = {
			artifacts: {},
			skillLevels: {},
			totalSP: sp,
			spentSP: sp,
			maxStage: ms,
			currentStage: ms,
			relics: lifetimeRelics,
			lifetimeRelics: lifetimeRelics,
			craftingShards: shards,
			ownedEquipmentSets: data.equipmentSets || [],
			raidStats: {
				cardLevels: {},
				playerLevel: raidLevel,
			},
		}

		// Extract Artifacts from summary
		const arts = data.artifacts || {}
		Object.keys(arts).forEach(key => {
			const art = arts[key]
			if (art && typeof art === 'object') {
				result.artifacts[key] = this.parseNumber(art.lv || art.level || 0)
			} else {
				result.artifacts[key] = this.parseNumber(art)
			}
		})

		// Extract Skills from summary
		const skills = data.skillTree || data.skills || {}
		Object.keys(skills).forEach(key => {
			result.skillLevels[key] = this.parseNumber(skills[key])
		})

		// Extract Raid Cards
		const cards = data.raidCards || data.cards || {}
		Object.keys(cards).forEach(key => {
			const card = cards[key]
			if (card && typeof card === 'object') {
				result.raidStats.cardLevels[key] = this.parseNumber(card.lv || card.level || 0)
			} else {
				result.raidStats.cardLevels[key] = this.parseNumber(card)
			}
		})

		return result
	}
}
