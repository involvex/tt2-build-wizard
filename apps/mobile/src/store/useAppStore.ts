import {
	BuildType,
	GoldSource,
	TT2SaveData,
	SaveFileParser,
} from '@tt2-build-wizard/logic'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {persist, createJSONStorage} from 'zustand/middleware'
import {create} from 'zustand'

interface AppState {
	build: BuildType
	gold: GoldSource
	sp: string
	playerData: TT2SaveData | null
	apiToken: string | null
	playerToken: string | null
	lastUpdated: number | null
	theme: 'light' | 'dark'
	setBuild: (build: BuildType) => void
	setGold: (gold: GoldSource) => void
	setSP: (sp: string) => void
	setTheme: (theme: 'light' | 'dark') => void
	setPlayerData: (data: TT2SaveData | null) => void
	setApiCredentials: (apiToken: string, playerToken: string) => void
	setLastUpdated: (timestamp: number) => void
	importSaveData: (rawJson: string) => void
}

export const useAppStore = create<AppState>()(
	persist(
		set => ({
			build: 'Shadow Clone',
			gold: 'Fairy',
			sp: '100',
			playerData: null,
			apiToken: null,
			playerToken: null,
			lastUpdated: null,
			theme: 'dark',
			setBuild: build => set({build}),
			setGold: gold => set({gold}),
			setSP: sp => set({sp}),
			setTheme: theme => set({theme}),
			setPlayerData: data => set({playerData: data}),
			setApiCredentials: (apiToken, playerToken) =>
				set({apiToken, playerToken}),
			setLastUpdated: timestamp => set({lastUpdated: timestamp}),
			importSaveData: (rawJson: string) => {
				try {
					const data = SaveFileParser.parse(rawJson)
					set({
						playerData: data,
						sp: data.totalSP.toString(),
					})
				} catch (error) {
					console.error('Import failed:', error)
					throw error
				}
			},
		}),
		{
			name: 'tt2-optimizer-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
)
