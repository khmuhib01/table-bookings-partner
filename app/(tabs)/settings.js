// SettingsScreen.js
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useDispatch} from 'react-redux';
import {useNavigation, CommonActions} from '@react-navigation/native';
import {logout} from '../../store/slices/userSlice';
import {useRouter} from 'expo-router';
import {removeToken} from '../../lib/storage';
import Colors from '../../constants/colors';

const MenuItem = ({icon, title, onPress, style, textStyle, iconColor}) => (
	<TouchableOpacity onPress={onPress} style={[styles.menuItem, style]}>
		<Ionicons name={icon} size={24} color={iconColor || '#333'} style={styles.menuIcon} />
		<Text style={[styles.menuItemText, textStyle]}>{title}</Text>
	</TouchableOpacity>
);

export default function SettingsScreen() {
	const router = useRouter();
	const dispatch = useDispatch();
	const navigation = useNavigation();

	const handlePress = (item) => {
		switch (item) {
			case 'profile':
				router.push('/settings/profile');
				break;
			case 'sounds':
				router.push('/settings/sounds');
				break;
			case 'notifications':
				router.push('/settings/notifications');
				break;
			case 'helps':
				router.push('/settings/helps');
				break;
			case 'about':
				router.push('/settings/about');
				break;
			case 'logout':
				return handleLogout();
			default:
				break;
		}
	};

	const handleLogout = async () => {
		await dispatch(logout());
		await removeToken();
		router.replace('/');
	};

	return (
		<ScrollView contentContainerStyle={styles.contentContainer}>
			<View style={styles.header}>
				<Text style={styles.headerText}>Settings</Text>
			</View>

			<View style={styles.menuContainer}>
				<MenuItem icon="person-outline" title="Profile" onPress={() => handlePress('profile')} />
				{/* <MenuItem icon="settings-outline" title="Sounds" onPress={() => handlePress('sounds')} />
				<MenuItem icon="notifications-outline" title="Notifications" onPress={() => handlePress('notifications')} /> */}
				<MenuItem icon="help-circle-outline" title="Help" onPress={() => handlePress('helps')} />
				<MenuItem icon="information-circle-outline" title="About" onPress={() => handlePress('about')} />

				<View style={styles.separator} />

				<MenuItem
					icon="log-out-outline"
					title="Logout"
					onPress={() => handlePress('logout')}
					style={styles.logoutItem}
					textStyle={styles.logoutText}
					iconColor={Colors.white}
				/>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F3F3F3',
	},
	contentContainer: {
		padding: 16,
		paddingBottom: 32,
	},
	header: {
		paddingVertical: 16,
		alignItems: 'center',
	},
	headerText: {
		fontSize: 24,
		fontWeight: '700',
		color: '#333',
	},
	menuContainer: {
		backgroundColor: '#fff',
		borderRadius: 8,
		paddingVertical: 8,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	menuItemText: {
		fontSize: 16,
		marginLeft: 16,
		color: '#333',
	},
	separator: {
		borderBottomWidth: 1,
		borderBottomColor: '#ccc',
		marginVertical: 8,
		marginHorizontal: 16,
	},
	logoutItem: {
		backgroundColor: Colors.danger,
	},

	logoutText: {
		color: Colors.white,
	},
});
