import {
	Save,
	RefreshCw,
	Trash2,
	Key,
	User,
	Clipboard as ClipboardIcon,
	ChevronDown,
	ChevronUp,
	Database,
} from 'lucide-react-native'
import {
	View,
	Text,
	ScrollView,
	Alert,
	ActivityIndicator,
	TouchableOpacity,
} from 'react-native'
import {Card, Button, Input, Badge} from '../components/ui'
import {useAppStore} from '../store/useAppStore'
import {fetchPlayerData} from '../services/api'
import * as Clipboard from 'expo-clipboard'
import React, {useState} from 'react'

export const SettingsScreen = () => {
	const {
		apiToken,
		playerToken,
		lastUpdated,
		setApiCredentials,
		setPlayerData,
		setLastUpdated,
		importSaveData,
	} = useAppStore()

	const [apiInput, setApiInput] = useState(apiToken || '')
	const [playerInput, setPlayerInput] = useState(playerToken || '')
	const [loading, setLoading] = useState(false)
	const [showAdvanced, setShowAdvanced] = useState(false)

	const handleSave = () => {
		setApiCredentials(apiInput, playerInput)
		Alert.alert('Success', 'Credentials saved successfully')
	}

	const handleImportClipboard = async () => {
		try {
			const content = await Clipboard.getStringAsync()
			if (!content) {
				Alert.alert('Empty', 'Clipboard is empty')
				return
			}
			importSaveData(content)
			Alert.alert('Success', 'Data imported from clipboard')
		} catch (_error) {
			Alert.alert(
				'Import Failed',
				'The data in your clipboard is not a valid TT2 export.',
			)
		}
	}

	const handleLoadDemoData = () => {
		const demoData = {
			playerStats: {
				'Max Prestige Stage': '20002',
				'Artifacts Collected': '75',
				'Crafting Power': '4',
				'Total Pet Levels': '3537',
				'Skill Points Owned': '567',
				'Hero Weapon Upgrades': '485',
				'Clan Scroll Upgrades': '15',
				'Tournaments Joined': '95',
				'Highest Tournament Rank': '#1<sprite name=crown>',
				'Tournament Points': '5420',
				'Lifetime Relics': '4.401E+30',
				Mementos: '0.000E+0',
				'Necrobear Level': '10',
			},
			raidStats: {
				'Raid Level': '103',
				'Raid Level Base Damage ': '203',
				'Total Raid Experience': '40105',
				'Total Raid Attacks': '9',
				'Total Raid Card Levels': '73',
				'Raid Cards Owned': '28',
				Wildcards: '352',
				'Lifetime Clan Morale': '790',
				'Solo Raid World Reached': '1',
			},
			artifacts: {
				Artifact22: {e: 0, lv: '8.861E+7'},
				Artifact2: {e: 0, lv: '9.241E+7'},
			},
			raidCards: {MoonBeam: {lv: 8, num: 0}, SkullBash: {lv: 2, num: 2}},
			equipmentSets: ['DarkAlien', 'BoneTribe', 'Anniversary'],
			skillTree: {TapDmg: 3, FairyGold: 5, CloneDmg: 11},
		}

		try {
			importSaveData(JSON.stringify(demoData))
			Alert.alert('Success', 'Demo data loaded successfully')
		} catch (_error) {
			Alert.alert('Error', 'Failed to load demo data')
		}
	}

	const handleRefresh = async () => {
		if (!playerInput) {
			Alert.alert('Error', 'Please enter your Player API Token first')
			return
		}

		setLoading(true)
		try {
			const data = await fetchPlayerData(apiInput || '', playerInput)
			setPlayerData(data)
			setLastUpdated(Date.now())
			Alert.alert('Success', 'Player data refreshed from API')
		} catch (error: any) {
			const errorMsg = error.message || 'Failed to fetch data'
			Alert.alert('Sync Failed', errorMsg)
		} finally {
			setLoading(false)
		}
	}

	const handleClear = () => {
		setPlayerData(null)
		setLastUpdated(0)
		Alert.alert('Cleared', 'Local data cache cleared')
	}

	return (
		<ScrollView className="flex-1 px-4 py-6">
			<View className="mb-8">
				<Text className="text-2xl font-black text-white mb-2">Settings</Text>
				<Text className="text-slate-400">
					Configure your tokens and manage game data.
				</Text>
			</View>

			<Card className="mb-6">
				<View className="flex-row items-center mb-4">
					<User size={20} color="#818cf8" />
					<Text className="text-white font-bold text-lg ml-2">
						Player Configuration
					</Text>
				</View>

				<Text className="text-slate-400 text-xs mb-4 leading-4">
					Enter your Player API Token found in-game under: {'\n'}
					<Text className="text-indigo-400 font-bold">
						Options {'->'} Services {'->'} Player API Token
					</Text>
				</Text>

				<Input
					label="Player API Token"
					value={playerInput}
					onChangeText={setPlayerInput}
					placeholder="Enter your Player API Token"
					icon={User}
				/>

				<TouchableOpacity
					onPress={() => setShowAdvanced(!showAdvanced)}
					className="flex-row items-center py-2 mb-2"
				>
					<Text className="text-slate-500 text-xs font-bold uppercase tracking-widest">
						Advanced Options
					</Text>
					{showAdvanced ? (
						<ChevronUp size={14} color="#64748b" className="ml-1" />
					) : (
						<ChevronDown size={14} color="#64748b" className="ml-1" />
					)}
				</TouchableOpacity>

				{showAdvanced && (
					<View className="mb-4 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
						<Text className="text-slate-500 text-[10px] mb-3 leading-4">
							Application Tokens are typically only for developers. Most users
							should leave this empty.
						</Text>
						<Input
							label="Application Token"
							value={apiInput}
							onChangeText={setApiInput}
							placeholder="Optional: Application Token"
							icon={Key}
						/>
					</View>
				)}

				<Button onPress={handleSave} className="mt-2">
					<Save size={18} color="white" />
					<Text className="text-white font-black uppercase tracking-widest text-center ml-2">
						Save Credentials
					</Text>
				</Button>
			</Card>

			<Card className="mb-6">
				<View className="flex-row items-center justify-between mb-4">
					<View className="flex-row items-center">
						<RefreshCw size={20} color="#34d399" />
						<Text className="text-white font-bold text-lg ml-2">Data Sync</Text>
					</View>
					{lastUpdated ? (
						<Badge>{new Date(lastUpdated).toLocaleString()}</Badge>
					) : (
						<Badge>No API Sync</Badge>
					)}
				</View>

				<Button
					onPress={handleRefresh}
					disabled={loading}
					variant="secondary"
					className="mb-3"
				>
					{loading ? (
						<ActivityIndicator color="white" />
					) : (
						<RefreshCw size={18} color="white" />
					)}
					<Text className="text-white font-black uppercase tracking-widest text-center ml-2">
						{loading ? 'Fetching...' : 'Sync via API'}
					</Text>
				</Button>

				<View className="flex-row items-center my-4">
					<View className="flex-1 h-[1px] bg-slate-800" />
					<Text className="mx-4 text-slate-600 text-[10px] font-bold uppercase">
						Manual Import
					</Text>
					<View className="flex-1 h-[1px] bg-slate-800" />
				</View>

				<Button
					onPress={handleImportClipboard}
					variant="outline"
					className="mb-3"
				>
					<ClipboardIcon size={18} color="white" />
					<Text className="text-white font-black uppercase tracking-widest text-center ml-2">
						Import from Clipboard
					</Text>
				</Button>

				<Button
					onPress={handleLoadDemoData}
					variant="outline"
					className="border-indigo-500/50"
				>
					<Database size={18} color="#818cf8" />
					<Text className="text-indigo-400 font-black uppercase tracking-widest text-center ml-2">
						Load Demo Data
					</Text>
				</Button>

				<Button onPress={handleClear} variant="ghost" className="mt-2">
					<Trash2 size={18} color="#ef4444" />
					<Text className="text-red-500 font-black uppercase tracking-widest ml-2">
						Clear Data
					</Text>
				</Button>
			</Card>

			<View className="items-center mt-4 pb-10">
				<Text className="text-slate-600 text-xs">
					Version 1.0.1 • TT2 Build Wizard
				</Text>
			</View>
		</ScrollView>
	)
}
