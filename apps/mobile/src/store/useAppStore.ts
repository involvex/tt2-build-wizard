import AsyncStorage from '@react-native-async-storage/async-storage'
import {persist, createJSONStorage} from 'zustand/middleware'
import {BuildType, GoldSource} from '@magicappdev/logic'
import {create} from 'zustand'

interface AppState {
	build: BuildType
	gold: GoldSource
	sp: string
	setBuild: (build: BuildType) => void
	setGold: (gold: GoldSource) => void
	setSP: (sp: string) => void
}

export const useAppStore = create<AppState>()(
	persist(
		set => ({
			build: 'Shadow Clone',
			gold: 'Fairy',
			sp: '100',
			setBuild: build => set({build}),
			setGold: gold => set({gold}),
			setSP: sp => set({sp}),
		}),
		{
			name: 'tt2-optimizer-storage',
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
)
