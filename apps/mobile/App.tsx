import {
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	SafeAreaView,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	StatusBar,
} from 'react-native'
import {
	OptimizerEngine,
	BuildType,
	GoldSource,
	SkillLevel,
} from '@magicappdev/logic'
import React, {useState, useMemo} from 'react'
import './global.css'

const engine = new OptimizerEngine()

// --- UI Components ---

const Card = ({
	children,
	className = '',
}: {
	children: React.ReactNode
	className?: string
}) => (
	<View
		className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 ${className}`}
	>
		{children}
	</View>
)

const Button = ({
	onPress,
	children,
	variant = 'primary',
	className = '',
}: {
	onPress: () => void
	children: React.ReactNode
	variant?: 'primary' | 'secondary' | 'outline'
	className?: string
}) => {
	const variants = {
		primary: 'bg-indigo-600 active:bg-indigo-700 shadow-indigo-500/20',
		secondary: 'bg-slate-800 active:bg-slate-700',
		outline: 'bg-transparent border border-slate-700 active:bg-slate-800',
	}

	return (
		<TouchableOpacity
			onPress={onPress}
			className={`${variants[variant]} px-6 py-4 rounded-xl flex-row items-center justify-center shadow-lg ${className}`}
		>
			{children}
		</TouchableOpacity>
	)
}

const Badge = ({children, active}: {children: string; active?: boolean}) => (
	<View
		className={`${active ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-slate-800 border-slate-700'} border px-2.5 py-0.5 rounded-full`}
	>
		<Text
			className={`${active ? 'text-indigo-400' : 'text-slate-400'} text-[10px] font-bold uppercase tracking-wider`}
		>
			{children}
		</Text>
	</View>
)

// --- Main App ---

export default function App() {
	const [build, setBuild] = useState<BuildType>('Shadow Clone')
	const [gold, setGold] = useState<GoldSource>('Fairy')
	const [spInput, setSpInput] = useState('100')
	const [results, setResults] = useState<SkillLevel[]>([])

	const spValue = parseInt(spInput) || 0

	const calculate = () => {
		const optimized = engine.optimize(spValue, build, gold)
		setResults(optimized)
	}

	const reset = () => {
		setResults([])
	}

	// Grouping results by skill for a cleaner summary
	const summary = useMemo(() => {
		const map: Record<string, number> = {}
		results.forEach(r => {
			map[r.skillId] = Math.max(map[r.skillId] || 0, r.level)
		})
		return Object.entries(map).sort((a, b) => b[1] - a[1])
	}, [results])

	return (
		<SafeAreaView
			className="flex-1 bg-slate-950"
			style={{flex: 1, backgroundColor: '#020617'}}
		>
			<StatusBar barStyle="light-content" />
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				className="flex-1"
			>
				<ScrollView className="flex-1" contentContainerStyle={{padding: 20}}>
					{/* Header */}
					<View className="flex-row justify-between items-center mb-8 mt-4">
						<View>
							<Text className="text-slate-400 text-sm font-medium">
								Tap Titans 2
							</Text>
							<Text className="text-white text-3xl font-extrabold tracking-tight">
								Optimizer
							</Text>
						</View>
					</View>

					{/* Config Section */}
					<Card className="mb-6">
						<View className="flex-row items-center mb-4">
							<Text className="text-white font-bold text-lg">Build Setup</Text>
						</View>

						<Text className="text-slate-500 text-xs font-bold uppercase mb-2">
							Primary Build
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
									className={`px-4 py-2.5 rounded-xl border ${build === b ? 'bg-indigo-600 border-indigo-500 shadow-md' : 'bg-slate-800 border-slate-700'}`}
								>
									<Text
										className={`text-sm font-semibold ${build === b ? 'text-white' : 'text-slate-300'}`}
									>
										{b}
									</Text>
								</TouchableOpacity>
							))}
						</View>

						<Text className="text-slate-500 text-xs font-bold uppercase mb-2">
							Gold Source
						</Text>
						<View className="flex-row gap-2 mb-6">
							{(['Fairy', 'HoG', 'Chesterson'] as GoldSource[]).map(g => (
								<TouchableOpacity
									key={g}
									onPress={() => setGold(g)}
									className={`px-4 py-2.5 rounded-xl border ${gold === g ? 'bg-indigo-600 border-indigo-500 shadow-md' : 'bg-slate-800 border-slate-700'}`}
								>
									<Text
										className={`text-sm font-semibold ${gold === g ? 'text-white' : 'text-slate-300'}`}
									>
										{g}
									</Text>
								</TouchableOpacity>
							))}
						</View>

						<Text className="text-slate-500 text-xs font-bold uppercase mb-2">
							Total Skill Points
						</Text>
						<View className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 flex-row items-center">
							<TextInput
								className="flex-1 text-white ml-3 text-lg font-bold"
								placeholder="Enter SP..."
								placeholderTextColor="#475569"
								keyboardType="numeric"
								value={spInput}
								onChangeText={setSpInput}
							/>
						</View>
					</Card>

					{/* Action Buttons */}
					<View className="flex-row gap-3 mb-8">
						<Button onPress={calculate} className="flex-1">
							<Text className="text-white font-bold text-base ml-2">
								Optimize
							</Text>
						</Button>
						<Button onPress={reset} variant="outline" className="px-4">
							<Text className="text-slate-400 font-bold">Reset</Text>
						</Button>
					</View>

					{/* Results Summary */}
					{summary.length > 0 && (
						<View className="mb-10">
							<View className="flex-row justify-between items-end mb-4">
								<Text className="text-xl font-bold text-white tracking-tight">
									Recommendation
								</Text>
								<Text className="text-slate-500 text-sm">
									{summary.length} skills affected
								</Text>
							</View>

							{summary.map(([id, lvl], i) => (
								<View
									key={id}
									className="bg-slate-900 border border-slate-800 mb-3 rounded-2xl overflow-hidden shadow-sm"
								>
									<View className="p-4 flex-row justify-between items-center">
										<View className="flex-1">
											<View className="flex-row items-center mb-1">
												<Text className="text-white font-bold text-base mr-2">
													{id}
												</Text>
												<Badge active>{build}</Badge>
											</View>
											<Text className="text-slate-500 text-xs">
												Reach maximum target level
											</Text>
										</View>
										<View className="bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20">
											<Text className="text-indigo-400 font-black text-xl">
												{lvl}
											</Text>
										</View>
									</View>
								</View>
							))}
						</View>
					)}

					{/* Footer Tabs Placeholder */}
					<View className="flex-row bg-slate-900 border border-slate-800 rounded-2xl p-2 mb-10">
						<TouchableOpacity className="flex-1 flex-row items-center justify-center py-3 bg-slate-800 rounded-xl">
							<Text className="text-white font-bold ml-2">App</Text>
						</TouchableOpacity>
						<TouchableOpacity className="flex-1 flex-row items-center justify-center py-3">
							<Text className="text-slate-500 font-bold ml-2">Guides</Text>
						</TouchableOpacity>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}
