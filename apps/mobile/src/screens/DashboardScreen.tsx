import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Alert,
	Animated,
	ActivityIndicator,
} from 'react-native'
import {
	Zap,
	Database,
	Trophy,
	Swords,
	Shield,
	BookOpen,
} from 'lucide-react-native'
import React, {useState, useEffect, useMemo} from 'react'
import {useAppStore} from '../store/useAppStore'
import {Card, Button} from '../components/ui'
import * as Clipboard from 'expo-clipboard'

export const DashboardScreen = () => {
	const {playerData, importSaveData} = useAppStore()
	const [isImporting, setIsImporting] = useState(false)
	const fadeAnim = useMemo(() => new Animated.Value(0), [])

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 400,
			useNativeDriver: true,
		}).start()
	}, [fadeAnim])

	const handleImport = async () => {
		setIsImporting(true)
		try {
			const content = await Clipboard.getStringAsync()
			if (!content) {
				Alert.alert('Clipboard Empty', 'Please copy your game data JSON first.')
				return
			}
			importSaveData(content)
			Alert.alert('Success', 'Data imported successfully!')
		} catch {
			Alert.alert(
				'Error',
				'Failed to parse clipboard data. Make sure it is valid game JSON.',
			)
		} finally {
			setIsImporting(false)
		}
	}

	const StatItem = ({icon: Icon, label, value, color}: any) => (
		<View className="w-[48%] mb-4">
			<Card className="p-4 items-center justify-center bg-slate-900/40 border-slate-800">
				<Icon size={20} color={color} />
				<Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 mb-1">
					{label}
				</Text>
				<Text className="text-white dark:text-white light:text-slate-900 font-black text-lg">
					{value}
				</Text>
			</Card>
		</View>
	)

	return (
		<Animated.View style={{flex: 1, opacity: fadeAnim}}>
			<ScrollView
				className="flex-1 px-5"
				contentContainerStyle={{paddingTop: 20, paddingBottom: 120}}
				showsVerticalScrollIndicator={false}
			>
				<View className="mb-8">
					<Text className="text-white dark:text-white light:text-slate-900 text-3xl font-black tracking-tighter">
						Dashboard
					</Text>
					<Text className="text-slate-500 text-sm mt-1">
						{playerData
							? 'Welcome back, Sword Master'
							: 'Import data to get started'}
					</Text>
				</View>

				{playerData ? (
					<View className="flex-row flex-wrap justify-between">
						<StatItem
							icon={Trophy}
							label="Max Stage"
							value={playerData.maxStage.toLocaleString()}
							color="#fbbf24"
						/>
						<StatItem
							icon={Zap}
							label="Total SP"
							value={playerData.totalSP.toString()}
							color="#818cf8"
						/>
						<StatItem
							icon={Database}
							label="Artifacts"
							value={Object.keys(playerData.artifacts).length.toString()}
							color="#34d399"
						/>
						<StatItem
							icon={Swords}
							label="Raid Level"
							value={playerData.raidStats.playerLevel.toString()}
							color="#f87171"
						/>

						<Card className="w-full mt-2 mb-6 p-6 bg-indigo-600 shadow-xl shadow-indigo-500/20">
							<Text className="text-indigo-100 text-[10px] font-black uppercase tracking-widest mb-1">
								Lifetime Relics
							</Text>
							<Text className="text-white font-black text-3xl">
								{playerData.lifetimeRelics.toExponential(2)}
							</Text>
						</Card>
					</View>
				) : (
					<Card className="p-8 items-center bg-slate-900/40 border-slate-800 border-dashed">
						<Database size={48} color="#475569" className="mb-4" />
						<Text className="text-white font-bold text-center text-lg mb-2">
							No Data Found
						</Text>
						<Text className="text-slate-500 text-center text-sm mb-6 leading-5">
							Copy your player data from the game or TT2Master and click the
							button below to populate the optimizer.
						</Text>
						<Button
							onPress={handleImport}
							disabled={isImporting}
							className="w-full"
						>
							{isImporting ? (
								<ActivityIndicator color="white" />
							) : (
								<Text className="text-white font-black uppercase">
									Import from Clipboard
								</Text>
							)}
						</Button>
					</Card>
				)}

				<View className="mt-8">
					<Text className="text-slate-500 text-[10px] font-black uppercase tracking-[2px] mb-4 ml-1">
						Quick Access
					</Text>
					<View className="flex-row gap-3">
						<TouchableOpacity className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 items-center">
							<Zap size={24} color="#818cf8" />
							<Text className="text-white text-[10px] font-bold mt-2">
								SKILLS
							</Text>
						</TouchableOpacity>
						<TouchableOpacity className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 items-center">
							<Shield size={24} color="#34d399" />
							<Text className="text-white text-[10px] font-bold mt-2">
								SETS
							</Text>
						</TouchableOpacity>
						<TouchableOpacity className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-4 items-center">
							<BookOpen size={24} color="#fbbf24" />
							<Text className="text-white text-[10px] font-bold mt-2">
								GUIDES
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ScrollView>
		</Animated.View>
	)
}
