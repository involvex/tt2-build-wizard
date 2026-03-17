import {
	View,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
	Image,
} from 'react-native'
import {OptimizerScreen} from './src/screens/OptimizerScreen'
import {GuidesScreen} from './src/screens/GuidesScreen'
import React, {useState} from 'react'
import './global.css'

export default function App() {
	const [activeTab, setActiveTab] = useState<'optimizer' | 'guides'>(
		'optimizer',
	)

	return (
		<SafeAreaView className="flex-1 bg-slate-950" style={{ flex: 1, backgroundColor: '#020617' }}>

			<StatusBar barStyle="light-content" />

			{/* App Header */}
			<View className="px-6 py-4 flex-row justify-between items-center bg-slate-950/80 border-b border-slate-900">
				<View className="flex-row items-center">
					<View className="w-10 h-10 bg-indigo-600 rounded-xl items-center justify-center shadow-lg shadow-indigo-500/40 overflow-hidden">
						<Image
							source={require('./assets/favicon.png')}
							className="w-full h-full"
							resizeMode="cover"
						/>
					</View>
					<View className="ml-3">
						<Text className="text-white font-black text-xl tracking-tighter leading-tight">
							TT2 Build Wizard
						</Text>
            <Text className="text-slate-500 text-xs tracking-tight">
              Your companion for mastering Tap Titans 2
            </Text>
					</View>
				</View>
				<TouchableOpacity className="bg-slate-900 p-3 rounded-2xl border border-slate-800">
					<Text className="text-slate-400 font-bold">⚙️</Text>
				</TouchableOpacity>
			</View>

			{/* Screen Content */}
			<View className="flex-1">
				{activeTab === 'optimizer' ? <OptimizerScreen /> : <GuidesScreen />}
			</View>

			{/* Bottom Navigation Bar */}
			<View className="absolute bottom-0 left-0 right-0 px-6 pb-10 pt-4 bg-slate-950/95 border-t border-slate-900">
				<View className="bg-slate-900/80 border border-slate-800 p-1.5 rounded-3xl flex-row items-center shadow-2xl">
					<TouchableOpacity
						onPress={() => setActiveTab('optimizer')}
						className={`flex-1 flex-row items-center justify-center py-3.5 rounded-2xl ${activeTab === 'optimizer' ? 'bg-slate-800' : ''}`}
					>
						<Text
							className={`font-bold ${activeTab === 'optimizer' ? 'text-white' : 'text-slate-500'}`}
						>
							Optimizer
						</Text>
					</TouchableOpacity>

					<View className="w-px h-6 bg-slate-800 mx-1" />

					<TouchableOpacity
						onPress={() => setActiveTab('guides')}
						className={`flex-1 flex-row items-center justify-center py-3.5 rounded-2xl ${activeTab === 'guides' ? 'bg-slate-800' : ''}`}
					>
						<Text
							className={`font-bold ${activeTab === 'guides' ? 'text-white' : 'text-slate-500'}`}
						>
							Guides
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</SafeAreaView>
	)
}
