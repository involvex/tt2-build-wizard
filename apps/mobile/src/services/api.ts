import {TT2SaveData} from '@tt2-build-wizard/logic'
import {Platform} from 'react-native'

export const API_BASE_URL = 'https://tt2-public.gamehivegames.com/api'

export interface ApiError {
	message: string
	code: number
}

function parseNumber(val: any): number {
	if (typeof val === 'number') return val
	if (typeof val !== 'string') return 0
	const clean = val.replace(/,/g, '').replace(/[^\d.eE+-]/g, '')
	const parsed = parseFloat(clean)
	return isNaN(parsed) ? 0 : parsed
}

function getValue(obj: any, keys: string[]): any {
	if (!obj) return undefined
	for (const key of keys) {
		if (obj[key] !== undefined) return obj[key]
		const found = Object.keys(obj).find(
			k => k.toLowerCase() === key.toLowerCase(),
		)
		if (found) return obj[found]
	}
	return undefined
}

export function transformApiData(apiData: any): TT2SaveData {
	// The API data might be nested inside a data property or similar
	const data = apiData.data || apiData

	const artifacts: Record<string, number> = {}
	const arts = getValue(data, ['artifacts', 'Artifacts']) || {}
	if (typeof arts === 'object') {
		Object.keys(arts).forEach(key => {
			const art = arts[key]
			if (art && typeof art === 'object') {
				artifacts[key] = parseNumber(art.lv || art.level || 0)
			} else {
				artifacts[key] = parseNumber(art)
			}
		})
	}

	const skillLevels: Record<string, number> = {}
	const skills =
		getValue(data, ['skill_tree', 'skillTree', 'skills', 'Skills']) || {}
	if (typeof skills === 'object') {
		Object.keys(skills).forEach(key => {
			const skill = skills[key]
			if (skill && typeof skill === 'object') {
				skillLevels[key] = parseNumber(skill.lv || skill.level || 0)
			} else {
				skillLevels[key] = parseNumber(skill)
			}
		})
	}

	const cardLevels: Record<string, number> = {}
	const cards = getValue(data, ['cards', 'raidCards', 'RaidCards']) || {}
	if (typeof cards === 'object') {
		Object.keys(cards).forEach(key => {
			const card = cards[key]
			if (card && typeof card === 'object') {
				cardLevels[key] = parseNumber(card.lv || card.level || 0)
			} else {
				cardLevels[key] = parseNumber(card)
			}
		})
	}

	const ms = parseNumber(getValue(data, ['max_stage', 'maxStage', 'MaxStage']))
	const sp = parseNumber(
		getValue(data, [
			'total_skill_points',
			'totalSP',
			'TotalSP',
			'skill_points',
			'skillPoints',
		]),
	)
	const relics = parseNumber(
		getValue(data, [
			'relics_received',
			'relics',
			'Relics',
			'lifetime_relics',
			'lifetimeRelics',
		]),
	)
	const raidLevel = parseNumber(
		getValue(data, ['player_raid_level', 'raidLevel', 'RaidLevel']),
	)
	const shards = parseNumber(
		getValue(data, ['crafting_shards', 'craftingShards', 'CraftingShards']),
	)

	return {
		maxStage: ms,
		currentStage: ms,
		relics: relics,
		lifetimeRelics: relics,
		craftingShards: shards,
		totalSP: sp,
		spentSP: sp,
		artifacts,
		skillLevels,
		raidStats: {
			playerLevel: raidLevel,
			cardLevels,
		},
		ownedEquipmentSets:
			getValue(data, ['equipment_set', 'equipmentSets', 'EquipmentSets']) || [],
	}
}

export async function fetchPlayerData(
	apiToken: string,
	playerToken: string,
): Promise<TT2SaveData> {
	const token = playerToken || apiToken

	if (!token) {
		throw {
			message: 'No API Token or Player Token provided.',
			code: 0,
		} as ApiError
	}

	try {
		const response = await fetch(`${API_BASE_URL}/player/data`, {
			method: 'GET',
			headers: {
				'API-Token': token,
			},
		})

		if (!response.ok) {
			const errorBody = await response.text()
			throw {
				message: `API Error: ${response.status} ${response.statusText} - ${errorBody}`,
				code: response.status,
			} as ApiError
		}

		const json = await response.json()
		return transformApiData(json)
	} catch (error: any) {
		console.error('Fetch player data failed:', error)

		if (Platform.OS === 'web') {
			const isNetworkError =
				error instanceof TypeError ||
				error.message?.includes('fetch') ||
				error.name === 'TypeError'
			if (isNetworkError) {
				throw {
					message:
						'Network Error (CORS). Browser-based requests (Expo Web) are likely blocked by GameHive API security policy. Please run the app on a physical device (Android/iOS) or an emulator to use API features.',
					code: 0,
				} as ApiError
			}
		}

		throw error
	}
}

export async function fetchClanData(apiToken: string): Promise<any> {
	try {
		const response = await fetch(`${API_BASE_URL}/raid/clan_data`, {
			method: 'GET',
			headers: {
				'API-Token': apiToken,
			},
		})

		if (!response.ok) {
			const errorBody = await response.text()
			throw {
				message: `API Error: ${response.status} ${response.statusText} - ${errorBody}`,
				code: response.status,
			} as ApiError
		}

		return await response.json()
	} catch (error: any) {
		console.error('Fetch clan data failed:', error)

		if (Platform.OS === 'web') {
			throw {
				message:
					'Network Error (CORS). Requests from browsers are typically blocked by the API.',
				code: 0,
			} as ApiError
		}

		throw error
	}
}
