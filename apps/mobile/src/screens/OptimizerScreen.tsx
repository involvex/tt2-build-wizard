import {
	OptimizerEngine,
	BuildType,
	GoldSource,
	SkillLevel,
} from '@magicappdev/logic'
import {Text, View, ScrollView, TouchableOpacity} from 'react-native'
import {Card, Button, Badge, Input} from '../components/ui'
import {useAppStore} from '../store/useAppStore'
import React, {useState, useMemo} from 'react'

const engine = new OptimizerEngine()

export const OptimizerScreen = () => {
	const {build, gold, sp, setBuild, setGold, setSP} = useAppStore()
	const [results, setResults] = useState<SkillLevel[]>([])

	const spValue = parseInt(sp) || 0

	const calculate = () => {
		const optimized = engine.optimize(spValue, build, gold)
		setResults(optimized)
	}

	const reset = () => {
		setResults([])
	}

	const summary = useMemo(() => {
		const map: Record<string, number> = {}
		results.forEach(r => {
			map[r.skillId] = Math.max(map[r.skillId] || 0, r.level)
		})
		return Object.entries(map).sort((a, b) => b[1] - a[1])
	}, [results])

	return (
		<ScrollView
			className="flex-1 px-5"
			contentContainerStyle={{paddingTop: 20, paddingBottom: 100}}
			showsVerticalScrollIndicator={false}
		>
			{/* Configuration Card */}
			<Card className="mb-6 shadow-2xl shadow-indigo-500/10">
				<View className="flex-row items-center mb-6">
					<View className="bg-indigo-500/20 p-2 rounded-lg">
						<Text>⚡</Text>
					</View>
					<Text className="text-white font-black ml-3 text-lg tracking-tight">
						Optimizer Setup
					</Text>
				</View>

				<Text className="text-slate-500 text-[10px] font-black uppercase tracking-[2px] mb-3 ml-1">
					Build Strategy
				</Text>
				<View className="flex-row flex-wrap gap-2 mb-6">
					{(
						[
							'Shadow Clone',
							'Clan Ship',
							'Pet',
							'Dagger',
							'Gold Gun',
							'Heavenly Strike',
						] as BuildType[]
					).map(b => (
						<TouchableOpacity
							key={b}
							onPress={() => setBuild(b)}
							className={`px-4 py-2.5 rounded-2xl border ${build === b ? 'bg-indigo-600 border-indigo-500 shadow-md' : 'bg-slate-800/50 border-slate-700/50'}`}
						>
							<Text
								className={`text-xs font-bold ${build === b ? 'text-white' : 'text-slate-400'}`}
							>
								{b}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				<Text className="text-slate-500 text-[10px] font-black uppercase tracking-[2px] mb-3 ml-1">
					Gold Economy
				</Text>
				<View className="flex-row gap-2 mb-6">
					{(['Fairy', 'HoG', 'Chesterson'] as GoldSource[]).map(g => (
						<TouchableOpacity
							key={g}
							onPress={() => setGold(g)}
							className={`px-4 py-2.5 rounded-2xl border ${gold === g ? 'bg-indigo-600 border-indigo-500 shadow-md' : 'bg-slate-800/50 border-slate-700/50'}`}
						>
							<Text
								className={`text-xs font-bold ${gold === g ? 'text-white' : 'text-slate-400'}`}
							>
								{g}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				<Input
					label="Available Skill Points"
					placeholder="e.g. 500"
					keyboardType="numeric"
					value={sp}
					onChangeText={setSP}
				/>
			</Card>

			{/* Action Buttons */}
			<View className="flex-row gap-3 mb-10">
				<Button onPress={calculate} className="flex-1 h-16">
					<Text className="text-white font-black text-base ml-3 tracking-tight">
						Run Optimization
					</Text>
				</Button>
				<TouchableOpacity
					onPress={reset}
					className="bg-slate-900 border border-slate-800 w-16 h-16 rounded-2xl items-center justify-center"
				>
					<Text>🔄</Text>
				</TouchableOpacity>
			</View>

			{/* Results Section */}
			{summary.length > 0 ? (
				<View>
					<View className="flex-row items-center justify-between mb-6">
						<View className="flex-row items-center">
							<Text>✨</Text>
							<Text className="text-xl font-black text-white ml-3 tracking-tighter">
								Target Builds
							</Text>
						</View>
						<Badge active>{`${summary.length} Skills`}</Badge>
					</View>

					{summary.map(([id, lvl], i) => (
						<Card
							key={id}
							className="mb-3 p-4 bg-slate-900/80 border-slate-800"
						>
							<View className="flex-row justify-between items-center">
								<View className="flex-1">
									<View className="flex-row items-center mb-1">
										<Text className="text-white font-bold text-base mr-2">
											{id}
										</Text>
										<Text>➡</Text>
									</View>
									<Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">
										Level {lvl} recommended
									</Text>
								</View>
								<View className="bg-indigo-500/10 px-5 py-3 rounded-2xl border border-indigo-500/20">
									<Text className="text-indigo-400 font-black text-2xl">
										{lvl}
									</Text>
								</View>
							</View>
						</Card>
					))}
				</View>
			) : (
				<View className="items-center py-10">
					<Text className="text-slate-600 text-sm font-medium">
						Ready to optimize your progress.
					</Text>
				</View>
			)}
		</ScrollView>
	)
}
