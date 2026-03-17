import {View, Text, ScrollView, TouchableOpacity, Alert} from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import {useAppStore} from '../store/useAppStore'
import {Card, Button} from '../components/ui'
import React, {useState} from 'react'

export const DashboardScreen = () => {
	const {playerData, importSaveData} = useAppStore()
	const [isImporting, setIsImporting] = useState(false)

	const handleImport = async () => {
		setIsImporting(true)
		try {
			const content = await Clipboard.getString()
			if (!content) {
				Alert.alert('Clipboard Empty', 'Please copy your game data JSON first.')
				return
			}
			importSaveData(content)
			Alert.alert('Success', 'Data imported successfully!')
		} catch (_error) {
			Alert.alert(
				'Error',
				'Failed to parse clipboard data. Make sure it is valid game JSON.',
				[{text: 'OK', onPress: () => console.log((_error as Error).message)}],
			)
		} finally {
			setIsImporting(false)
		}
	}

	return (
		<ScrollView
			className="flex-1 px-5"
			contentContainerStyle={{paddingTop: 20, paddingBottom: 120}}
			showsVerticalScrollIndicator={false}
		>
			<View className="mb-8">
				<Text className="text-white text-3xl font-black tracking-tighter">
					Dashboard
				</Text>
				<Text className="text-slate-500 text-sm mt-1">
					{playerData
						? 'Welcome back, Sword Master'
						: 'Import data to get started'}
				</Text>
			</View>

			{/* Import Card */}
			{!playerData && (
				<Card className="mb-6 bg-indigo-600/10 border-indigo-500/30">
					<Text className="text-indigo-400 font-bold text-center mb-4">
						Connect your game account by importing your save data.
					</Text>
					<Button onPress={handleImport} className="bg-indigo-600">
						{isImporting ? 'Processing...' : 'Import from Clipboard'}
					</Button>
				</Card>
			)}

			{playerData && (
				<>
					{/* Summary Grid */}
					<View className="flex-row flex-wrap justify-between mb-6">
						<StatCard
							label="Max Stage"
							value={playerData.maxStage.toLocaleString()}
							icon="🏆"
							className="w-[48%] mb-4"
						/>
						<StatCard
							label="Total SP"
							value={playerData.totalSP.toString()}
							icon="✨"
							className="w-[48%] mb-4"
						/>
						<StatCard
							label="Artifacts"
							value={`${Object.keys(playerData.artifacts).length}/103`}
							icon="🏺"
							className="w-[48%]"
						/>
						<StatCard
							label="Raid Level"
							value={playerData.raidStats.playerLevel.toString()}
							icon="⚔️"
							className="w-[48%]"
						/>
					</View>

					{/* Quick Actions */}
					<Text className="text-slate-500 text-[10px] font-black uppercase tracking-[2px] mb-4 ml-1">
						Quick Actions
					</Text>

					<TouchableOpacity
						className="bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-4 flex-row items-center justify-between"
						onPress={handleImport}
					>
						<View className="flex-row items-center">
							<View className="bg-emerald-500/20 p-2.5 rounded-xl mr-4">
								<Text>🔄</Text>
							</View>
							<View>
								<Text className="text-white font-bold">Update Data</Text>
								<Text className="text-slate-500 text-xs">
									Sync from clipboard
								</Text>
							</View>
						</View>
						<Text className="text-slate-600">›</Text>
					</TouchableOpacity>
				</>
			)}
		</ScrollView>
	)
}

const StatCard = ({
	label,
	value,
	icon,
	className,
}: {
	label: string
	value: string
	icon: string
	className?: string
}) => (
	<View
		className={`bg-slate-900 border border-slate-800 rounded-3xl p-5 ${className}`}
	>
		<View className="flex-row justify-between items-start mb-3">
			<View className="bg-slate-800/50 p-2 rounded-xl">
				<Text>{icon}</Text>
			</View>
		</View>
		<Text className="text-slate-500 text-[10px] font-black uppercase tracking-wider mb-1">
			{label}
		</Text>
		<Text className="text-white text-xl font-black tracking-tight">
			{value}
		</Text>
	</View>
)
