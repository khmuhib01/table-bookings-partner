import {View, Text, Button, StyleSheet} from 'react-native';
import {removeToken} from '../../lib/storage';
import {router} from 'expo-router';

export default function SettingsScreen() {
	const handleLogout = async () => {
		await removeToken();
		router.replace('/');
	};

	return (
		<View style={styles.container}>
			<Text>Settings</Text>
			<Button title="Logout" onPress={handleLogout} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
