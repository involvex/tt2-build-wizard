import {EquipmentOptimizerEngine} from '@tt2-build-wizard/logic'
import {View, Text, ScrollView} from 'react-native'
import {useAppStore} from '../store/useAppStore'
import {Card, Badge} from '../components/ui'
import React, {useMemo} from 'react'

const equipmentEngine = new EquipmentOptimizerEngine()

export const EquipmentScreen = () => {
	const {playerData, build} = useAppStore()

	const recommendations = useMemo(() => {
		if (!playerData) return []
		return equipmentEngine.getRecommendations(
			build,
			playerData.ownedEquipmentSets,
		)
	}, [playerData, build])

	if (!playerData) {
		return (
			<View className="flex-1 items-center justify-center px-10">
				<Text className="text-white text-xl font-black text-center mb-4">
					Equipment Advisor Locked
				</Text>
				<Text className="text-slate-500 text-center mb-8">
					Import your save data on the Dashboard to see which equipment sets you
					should craft next.
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
						Equipment
					</Text>
					<Text className="text-slate-500 text-sm mt-1">
						Crafting & Set Advisor
					</Text>
				</View>
				<Badge active className="px-3 py-1">
					{`${playerData.craftingShards} Shards`}
				</Badge>
			</View>

			<Text className="text-slate-500 text-[10px] font-black uppercase tracking-[2px] mb-4 ml-1">
				Crafting Recommendations
			</Text>

			{recommendations.slice(0, 10).map((rec, index) => (
				<Card key={index} className="mb-4 border-slate-800 bg-slate-900/50">
					<View className="flex-row justify-between items-start mb-2">
						<View className="flex-1">
							<View className="flex-row items-center mb-1">
								<Text className="text-white font-bold text-lg mr-2">
									{rec.setName}
								</Text>
								<Badge
									active={rec.type === 'Mythic'}
									className={`px-2 py-0.5 ${rec.type === 'Mythic' ? 'bg-red-500/20' : 'bg-orange-500/20'}`}
								>
									{rec.type}
								</Badge>
							</View>
							<Text className="text-slate-400 text-xs italic">
								{rec.reason}
							</Text>
						</View>
					</View>
				</Card>
			))}

			<View className="mt-4 mb-8 p-5 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl">
				<Text className="text-indigo-400 font-bold mb-1">💡 Pro Tip</Text>
				<Text className="text-slate-400 text-xs leading-relaxed">
					Prioritize Mythic sets for their massive relic bonuses. Ancient
					Warrior is usually the #1 priority for most builds.
				</Text>
			</View>
		</ScrollView>
	)
}
