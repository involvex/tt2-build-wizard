import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context'
import {View, StatusBar, Text, TouchableOpacity, Image} from 'react-native'
import {OptimizerScreen} from './src/screens/OptimizerScreen'
import {EquipmentScreen} from './src/screens/EquipmentScreen'
import {DashboardScreen} from './src/screens/DashboardScreen'
import {ArtifactsScreen} from './src/screens/ArtifactsScreen'
import {SettingsScreen} from './src/screens/SettingsScreen'
import {GuidesScreen} from './src/screens/GuidesScreen'
import {RaidScreen} from './src/screens/RaidScreen'
import {useAppStore} from './src/store/useAppStore'
import React, {useState, useEffect} from 'react'
import {Settings} from 'lucide-react-native'
import {useColorScheme} from 'nativewind'
import './global.css'

export default function App() {
	const {setColorScheme} = useColorScheme()
	const {theme, setTheme} = useAppStore()

	// Sync store theme to nativewind on mount and when store changes
	useEffect(() => {
		if (theme) {
			setColorScheme(theme)
		}
	}, [theme, setColorScheme])

	const toggleTheme = () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark'
		setTheme(newTheme)
	}

	const [activeTab, setActiveTab] = useState<
		| 'dashboard'
		| 'artifacts'
		| 'raid'
		| 'optimizer'
		| 'equipment'
		| 'guides'
		| 'settings'
	>('dashboard')

	return (
		<SafeAreaProvider>
			<SafeAreaView
				className="flex-1 bg-slate-950 dark:bg-slate-950 light:bg-slate-50"
				style={{flex: 1}}
			>
				<StatusBar
					barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
				/>

				{/* App Header */}
				<View className="px-6 py-4 flex-row justify-between items-center bg-slate-950/80 dark:bg-slate-950/80 light:bg-slate-100/80 border-b border-slate-900 dark:border-slate-900 light:border-slate-200">
					<View className="flex-row items-center">
						<View className="w-10 h-10 bg-indigo-600 rounded-xl items-center justify-center shadow-lg shadow-indigo-500/40 overflow-hidden">
							<Image
								source={require('./assets/favicon.png')}
								className="w-full h-full"
								resizeMode="cover"
							/>
						</View>
						<View className="ml-3">
							<Text className="text-white dark:text-white light:text-slate-900 font-black text-xl tracking-tighter leading-tight">
								TT2 Build Wizard
							</Text>
							<Text className="text-slate-500 dark:text-slate-500 light:text-slate-400 text-xs tracking-tight">
								Your companion for mastering Tap Titans 2
							</Text>
						</View>
					</View>
					<View className="flex-row items-center">
						<TouchableOpacity
							onPress={() => setActiveTab('settings')}
							className={`p-3 rounded-2xl border mr-2 ${activeTab === 'settings' ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-900 border-slate-800'} dark:bg-slate-900 light:bg-slate-200 dark:border-slate-800 light:border-slate-300`}
						>
							<Settings
								size={20}
								color={
									activeTab === 'settings'
										? 'white'
										: theme === 'dark'
											? '#94a3b8'
											: '#475569'
								}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={toggleTheme}
							className="bg-slate-900 dark:bg-slate-900 light:bg-slate-200 p-3 rounded-2xl border border-slate-800 dark:border-slate-800 light:border-slate-300"
						>
							<Text className="text-slate-400 dark:text-slate-400 light:text-slate-600 font-bold">
								{theme === 'dark' ? '🌙' : '☀️'}
							</Text>
						</TouchableOpacity>
					</View>
				</View>

				{/* Screen Content */}
				<View className="flex-1">
					{activeTab === 'dashboard' && <DashboardScreen />}
					{activeTab === 'artifacts' && <ArtifactsScreen />}
					{activeTab === 'raid' && <RaidScreen />}
					{activeTab === 'optimizer' && <OptimizerScreen />}
					{activeTab === 'equipment' && <EquipmentScreen />}
					{activeTab === 'guides' && <GuidesScreen />}
					{activeTab === 'settings' && <SettingsScreen />}
				</View>

				{/* Bottom Navigation Bar */}
				<View
					className="absolute bottom-0 left-0 right-0 bg-slate-950/95 dark:bg-slate-950/95 light:bg-slate-100/95 border-t border-slate-900 dark:border-slate-900 light:border-slate-200 px-2 pb-10 pt-4"
					style={{zIndex: 1000}}
				>
					<View className="bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-200/80 border border-slate-800 dark:border-slate-800 light:border-slate-300 p-1.5 rounded-3xl flex-row items-center shadow-2xl">
						<TouchableOpacity
							onPress={() => setActiveTab('dashboard')}
							className={`flex-1 flex-row items-center justify-center py-3 rounded-2xl ${activeTab === 'dashboard' ? (theme === 'dark' ? 'bg-slate-800' : 'bg-slate-300') : ''}`}
						>
							<Text className="text-xs">🏠</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => setActiveTab('artifacts')}
							className={`flex-1 flex-row items-center justify-center py-3 rounded-2xl ${activeTab === 'artifacts' ? (theme === 'dark' ? 'bg-slate-800' : 'bg-slate-300') : ''}`}
						>
							<Text className="text-xs">🏺</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => setActiveTab('raid')}
							className={`flex-1 flex-row items-center justify-center py-3 rounded-2xl ${activeTab === 'raid' ? (theme === 'dark' ? 'bg-slate-800' : 'bg-slate-300') : ''}`}
						>
							<Text className="text-xs">⚔️</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => setActiveTab('optimizer')}
							className={`flex-1 flex-row items-center justify-center py-3 rounded-2xl ${activeTab === 'optimizer' ? (theme === 'dark' ? 'bg-slate-800' : 'bg-slate-300') : ''}`}
						>
							<Text className="text-xs">⚡</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => setActiveTab('equipment')}
							className={`flex-1 flex-row items-center justify-center py-3 rounded-2xl ${activeTab === 'equipment' ? (theme === 'dark' ? 'bg-slate-800' : 'bg-slate-300') : ''}`}
						>
							<Text className="text-xs">🛡️</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => setActiveTab('guides')}
							className={`flex-1 flex-row items-center justify-center py-3 rounded-2xl ${activeTab === 'guides' ? (theme === 'dark' ? 'bg-slate-800' : 'bg-slate-300') : ''}`}
						>
							<Text className="text-xs">📚</Text>
						</TouchableOpacity>
					</View>
				</View>
			</SafeAreaView>
		</SafeAreaProvider>
	)
}
