import {View, Text, ScrollView, ActivityIndicator, Animated} from 'react-native'
import {ArtifactOptimizerEngine, ArtifactLevel} from '@tt2-build-wizard/logic'
import React, {useState, useEffect, useMemo} from 'react'
import {Card, Button, Badge} from '../components/ui'
import {useAppStore} from '../store/useAppStore'

const artifactEngine = new ArtifactOptimizerEngine()

export const ArtifactsScreen = () => {
	const {playerData, build, gold} = useAppStore()
	const [results, setResults] = useState<ArtifactLevel[]>([])
	const [isCalculating, setIsCalculating] = useState(false)
	const fadeAnim = useMemo(() => new Animated.Value(0), [])

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 400,
			useNativeDriver: true,
		}).start()
	}, [fadeAnim])

	const handleOptimize = () => {
		if (!playerData) return

		setIsCalculating(true)
		// Small timeout to allow UI to show loader
		setTimeout(() => {
			try {
				const optimized = artifactEngine.optimize(
					playerData.relics,
					build,
					gold,
					playerData.artifacts,
					playerData.lifetimeRelics,
				)
				setResults(optimized)
			} catch (error) {
				console.error('Optimization failed:', error)
			} finally {
				setIsCalculating(false)
			}
		}, 100)
	}

	if (!playerData) {
		return (
			<View className="flex-1 items-center justify-center px-10">
				<Text className="text-white dark:text-white light:text-slate-900 text-xl font-black text-center mb-4">
					No Player Data
				</Text>
				<Text className="text-slate-500 text-center mb-8">
					Please import your save data on the Dashboard to use the Artifact
					Optimizer.
				</Text>
			</View>
		)
	}

	return (
		<Animated.View style={{flex: 1, opacity: fadeAnim}}>
			<ScrollView
				className="flex-1 px-5"
				contentContainerStyle={{paddingTop: 20, paddingBottom: 120}}
				showsVerticalScrollIndicator={false}
			>
				<View className="mb-8 flex-row justify-between items-end">
					<View>
						<Text className="text-white dark:text-white light:text-slate-900 text-3xl font-black tracking-tighter">
							Artifacts
						</Text>
						<Text className="text-slate-500 text-sm mt-1">
							Optimize your relic spending
						</Text>
					</View>
					<Badge active className="px-3 py-1">
						{`${playerData.relics.toExponential(2)} Relics`}
					</Badge>
				</View>

				<Button
					onPress={handleOptimize}
					className="bg-indigo-600 mb-8 py-4"
					disabled={isCalculating}
				>
					{isCalculating ? (
						<ActivityIndicator color="white" />
					) : (
						'Calculate Upgrades'
					)}
				</Button>

				{results.length > 0 ? (
					<View>
						<Text className="text-slate-500 text-[10px] font-black uppercase tracking-[2px] mb-4 ml-1">
							Recommended Upgrades
						</Text>
						{results.map((item, index) => (
							<Card
								key={`${item.artifactId}-${index}`}
								className="mb-3 border-slate-800 dark:border-slate-800 light:border-slate-200 bg-slate-900/50 dark:bg-slate-900/50 light:bg-slate-100"
							>
								<View className="flex-row justify-between items-center">
									<View className="flex-1">
										<Text className="text-white dark:text-white light:text-slate-900 font-bold text-base">
											{item.name}
										</Text>
										<View className="flex-row items-center mt-1">
											<Text className="text-slate-500 text-xs">Target: </Text>
											<Text className="text-emerald-400 font-black text-sm">
												{item.level > 1e6
													? item.level.toExponential(2)
													: item.level.toLocaleString()}
											</Text>
										</View>
									</View>
									<View className="items-end">
										<Text className="text-slate-400 font-bold text-xs">
											Cost
										</Text>
										<Text className="text-white dark:text-white light:text-slate-900 font-black text-xs">
											{item.relicsSpent.toExponential(2)}
										</Text>
									</View>
								</View>
							</Card>
						))}
					</View>
				) : (
					<View className="items-center py-20 opacity-20">
						<Text className="text-5xl mb-4">🏺</Text>
						<Text className="text-white dark:text-white light:text-slate-900 font-bold">
							Ready to Optimize
						</Text>
					</View>
				)}
			</ScrollView>
		</Animated.View>
	)
}
