import {
	Text,
	View,
	TouchableOpacity,
	TextInput,
	ViewStyle,
	StyleProp,
} from 'react-native'
import React from 'react'

export const Card = ({
	children,
	className = '',
	style,
}: {
	children: React.ReactNode
	className?: string
	style?: StyleProp<ViewStyle>
}) => (
	<View
		style={style}
		className={`bg-slate-900/50 border border-slate-800/50 rounded-3xl p-5 ${className}`}
	>
		{children}
	</View>
)

export const Button = ({
	onPress,
	children,
	variant = 'primary',
	className = '',
	disabled = false,
}: {
	onPress: () => void
	children: React.ReactNode
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
	className?: string
	disabled?: boolean
}) => {
	const variants = {
		primary: 'bg-indigo-600 active:bg-indigo-700 shadow-indigo-500/20',
		secondary: 'bg-slate-800 active:bg-slate-700',
		outline: 'bg-transparent border border-slate-700 active:bg-slate-800',
		ghost: 'bg-transparent active:bg-slate-800/50',
	}

	return (
		<TouchableOpacity
			onPress={onPress}
			disabled={disabled}
			className={`${variants[variant]} px-6 py-4 rounded-2xl flex-row items-center justify-center shadow-lg ${disabled ? 'opacity-50' : ''} ${className}`}
		>
			{typeof children === 'string' ? (
				<Text className="text-white font-black uppercase tracking-widest text-center">
					{children}
				</Text>
			) : (
				children
			)}
		</TouchableOpacity>
	)
}

export const Badge = ({
	children,
	active,
	className = '',
}: {
	children: string
	active?: boolean
	className?: string
}) => (
	<View
		className={`${active ? 'bg-indigo-500/20 border-indigo-500/50' : 'bg-slate-800/50 border-slate-700/50'} border px-3 py-1 rounded-full ${className}`}
	>
		<Text
			className={`${active ? 'text-indigo-400' : 'text-slate-400'} text-[10px] font-bold uppercase tracking-widest`}
		>
			{children}
		</Text>
	</View>
)

export const Input = ({
	value,
	onChangeText,
	label,
	icon: Icon,
	placeholder,
	keyboardType = 'default',
}: {
	value: string
	onChangeText: (text: string) => void
	label?: string
	icon?: any
	placeholder?: string
	keyboardType?: any
}) => (
	<View className="mb-4">
		{label && (
			<Text className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-1">
				{label}
			</Text>
		)}
		<View className="bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3.5 flex-row items-center">
			{Icon && <Icon size={18} color="#64748b" />}
			<TextInput
				className="flex-1 text-white ml-3 text-base font-bold"
				placeholder={placeholder}
				placeholderTextColor="#475569"
				keyboardType={keyboardType}
				value={value}
				onChangeText={onChangeText}
			/>
		</View>
	</View>
)

export const IconButton = ({
	icon: Icon,
	onPress,
	active,
}: {
	icon: any
	onPress: () => void
	active?: boolean
}) => (
	<TouchableOpacity
		onPress={onPress}
		className={`p-3.5 rounded-2xl border ${active ? 'bg-indigo-600 border-indigo-500 shadow-indigo-500/20 shadow-lg' : 'bg-slate-900 border-slate-800'}`}
	>
		<Icon size={20} color={active ? 'white' : '#94a3b8'} />
	</TouchableOpacity>
)
