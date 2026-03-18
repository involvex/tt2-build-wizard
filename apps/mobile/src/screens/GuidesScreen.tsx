import {
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	TextInput,
	Animated,
} from 'react-native'
import React, {useState, useEffect, useMemo} from 'react'
import {Card, Badge} from '../components/ui'

const GUIDES = [
	{
		id: 'monument_tier_list',
		title: 'Monument Tier List',
		category: 'Late Game',
		author: 'lemmingllama',
	},
	{
		id: 'equipment_set_guide',
		title: 'Equipment Set Guide',
		category: 'General',
		author: 'lemmingllama',
	},
	{
		id: 'abyssal_tournament_guide',
		title: 'Abyssal Tournament Guide',
		category: 'Events',
		author: 'lemmingllama',
	},
	{
		id: 'artifact_tier_list',
		title: 'Artifact Tier List',
		category: 'General',
		author: 'lemmingllama',
	},
	{
		id: 'clan_raid_guide',
		title: 'Clan Raid Guide',
		category: 'Raid',
		author: 'lemmingllama',
	},
	{
		id: 'pet_guide',
		title: 'Pet Guide',
		category: 'General',
		author: 'lemmingllama',
	},
	{
		id: 'splashing_guide',
		title: 'Splashing Guide',
		category: 'Mechanics',
		author: 'lemmingllama',
	},
]

export const GuidesScreen = () => {
	const [search, setSearch] = useState('')
	const fadeAnim = useMemo(() => new Animated.Value(0), [])

	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 400,
			useNativeDriver: true,
		}).start()
	}, [fadeAnim])

	const filteredGuides = GUIDES.filter(
		g =>
			g.title.toLowerCase().includes(search.toLowerCase()) ||
			g.category.toLowerCase().includes(search.toLowerCase()),
	)

	return (
		<Animated.View style={{flex: 1, opacity: fadeAnim}}>
			<ScrollView
				className="flex-1 px-5"
				contentContainerStyle={{paddingTop: 20, paddingBottom: 120}}
				showsVerticalScrollIndicator={false}
			>
				<View className="mb-8">
					<Text className="text-white dark:text-white light:text-slate-900 text-2xl font-black tracking-tight mb-2">
						Knowledge Base
					</Text>
					<Text className="text-slate-500 text-sm">
						Everything you need to master Tap Titans 2.
					</Text>
				</View>

				{/* Search Bar */}
				<View className="bg-slate-900 dark:bg-slate-900 light:bg-slate-100 border border-slate-800 dark:border-slate-800 light:border-slate-200 rounded-2xl px-4 py-3 flex-row items-center mb-8">
					<Text>🔍</Text>
					<TextInput
						className="flex-1 text-white dark:text-white light:text-slate-900 ml-3 text-base"
						placeholder="Search guides or categories..."
						placeholderTextColor="#475569"
						value={search}
						onChangeText={setSearch}
					/>
				</View>

				<View className="flex-row items-center justify-between mb-6">
					<View className="flex-row items-center">
						<Text>📖</Text>
						<Text className="text-lg font-black text-white dark:text-white light:text-slate-900 ml-3 tracking-tighter">
							Essential Guides
						</Text>
					</View>
					<Badge active>{filteredGuides.length.toString()}</Badge>
				</View>

				{filteredGuides.map(guide => (
					<TouchableOpacity key={guide.id} activeOpacity={0.7}>
						<Card className="mb-3 p-4 bg-slate-900/80 dark:bg-slate-900/80 light:bg-slate-100 border-slate-800 dark:border-slate-800 light:border-slate-200">
							<View className="flex-row justify-between items-center">
								<View className="flex-1">
									<Text className="text-white dark:text-white light:text-slate-900 font-bold text-base mb-1">
										{guide.title}
									</Text>
									<View className="flex-row items-center">
										<Badge className="mr-2 px-2 py-0.5">{guide.category}</Badge>
										<Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
											By {guide.author}
										</Text>
									</View>
								</View>
								<View className="bg-slate-800 dark:bg-slate-800 light:bg-slate-200 p-2 rounded-full">
									<Text>➡</Text>
								</View>
							</View>
						</Card>
					</TouchableOpacity>
				))}

				{filteredGuides.length === 0 && (
					<View className="items-center py-20">
						<Text className="text-slate-600 font-bold mt-4">
							No guides found matching your search.
						</Text>
					</View>
				)}
			</ScrollView>
		</Animated.View>
	)
}
