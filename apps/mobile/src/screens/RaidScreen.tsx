import {RaidOptimizerEngine} from '@tt2-build-wizard/logic'
import {View, Text, ScrollView} from 'react-native'
import {useAppStore} from '../store/useAppStore'
import {Card, Badge} from '../components/ui'
import React, {useMemo} from 'react'

const raidEngine = new RaidOptimizerEngine()

export const RaidScreen = () => {
	const {playerData} = useAppStore()

	const suggestions = useMemo(() => {
		if (!playerData) return []
		return raidEngine.suggestDecks(playerData.raidStats.cardLevels)
	}, [playerData])

	if (!playerData) {
		return (
			<View className="flex-1 items-center justify-center px-10">
				<Text className="text-white text-xl font-black text-center mb-4">
					Raid Tools Locked
				</Text>
				<Text className="text-slate-500 text-center mb-8">
					Import your save data on the Dashboard to access Raid strategies and
					deck suggestions.
				</Text>
			</View>
		)
	}

	return (
		<ScrollView
			className="flex-1 px-5"
			contentContainerStyle={{paddingTop: 20, paddingBottom: 120}}
			showsVerticalScrollIndicator={false}
		>
			<View className="mb-8 flex-row justify-between items-end">
				<View>
					<Text className="text-white text-3xl font-black tracking-tighter">
						Raid Tools
					</Text>
					<Text className="text-slate-500 text-sm mt-1">
						Master the Clan Raids
					</Text>
				</View>
				<Badge active className="px-3 py-1">
					{`Level ${playerData.raidStats.playerLevel}`}
				</Badge>
			</View>

			<Text className="text-slate-500 text-[10px] font-black uppercase tracking-[2px] mb-4 ml-1">
				Recommended Decks
			</Text>

			{suggestions.map((deck, index) => (
				<Card key={index} className="mb-6 border-slate-800 bg-slate-900/50">
					<View className="flex-row justify-between items-start mb-2">
						<View>
							<Text className="text-white font-bold text-lg">{deck.name}</Text>
							<Text className="text-slate-500 text-xs mb-4">
								{deck.description}
							</Text>
						</View>
					</View>

					<View className="flex-row gap-2">
						{deck.cards.map(cardId => (
							<View
								key={cardId}
								className="flex-1 bg-slate-800/50 rounded-xl p-3 items-center border border-slate-700/30"
							>
								<Text
									className="text-[10px] text-slate-400 font-bold uppercase text-center mb-1"
									numberOfLines={1}
								>
									{cardId}
								</Text>
								<Text className="text-indigo-400 font-black text-lg">
									{playerData.raidStats.cardLevels[cardId]}
								</Text>
							</View>
						))}
					</View>
				</Card>
			))}

			<Text className="text-slate-500 text-[10px] font-black uppercase tracking-[2px] mb-4 ml-1">
				Your Top Cards
			</Text>
			<View className="flex-row flex-wrap justify-between">
				{Object.entries(playerData.raidStats.cardLevels)
					.sort(([, a], [, b]) => b - a)
					.slice(0, 6)
					.map(([id, level]) => (
						<View
							key={id}
							className="w-[48%] bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 flex-row items-center justify-between"
						>
							<Text className="text-white font-bold text-xs">{id}</Text>
							<Badge active className="px-2 py-0.5">
								{level.toString()}
							</Badge>
						</View>
					))}
			</View>
		</ScrollView>
	)
}
