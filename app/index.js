import {useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet} from 'react-native';
import {postUserLogin} from '../lib/api';
import {storeToken} from '../lib/storage';
import {router} from 'expo-router';

export default function LoginScreen() {
	const [email, setEmail] = useState('adity.chefonline@gmail.com');
	const [password, setPassword] = useState('password');

	const handleLogin = async () => {
		try {
			const result = await postUserLogin({email, password});
			await storeToken(result.token);
			router.replace('/home'); // After login, go to home
		} catch (error) {
			console.error('Login failed:', error);
		}
	};

	return (
		<View style={styles.container}>
			<Text>Email</Text>
			<TextInput value={email} onChangeText={setEmail} placeholder="Email" style={styles.input} />
			<Text>Password</Text>
			<TextInput
				value={password}
				onChangeText={setPassword}
				placeholder="Password"
				secureTextEntry
				style={styles.input}
			/>
			<Button title="Login" onPress={handleLogin} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {flex: 1, justifyContent: 'center', padding: 16},
	input: {borderWidth: 1, padding: 8, marginVertical: 8, borderRadius: 5},
});
