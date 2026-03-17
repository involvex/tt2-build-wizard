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
	setBuild: (build: BuildType) => void
	setGold: (gold: GoldSource) => void
	setSP: (sp: string) => void
	importSaveData: (rawJson: string) => void
}

export const useAppStore = create<AppState>()(
	persist(
		set => ({
			build: 'Shadow Clone',
			gold: 'Fairy',
			sp: '100',
			playerData: null,
			setBuild: build => set({build}),
			setGold: gold => set({gold}),
			setSP: sp => set({sp}),
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
