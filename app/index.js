import {useState} from 'react';
import {View, TextInput, Button, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {postUserLogin} from '../lib/api';
import {storeToken} from '../lib/storage';
import {router} from 'expo-router';
import {useDispatch} from 'react-redux';
import {setUser, setToken} from '../store/slices/userSlice';

export default function LoginScreen() {
	const [email, setEmail] = useState('adity.chefonline@gmail.com');
	const [password, setPassword] = useState('password');
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	const handleLogin = async () => {
		setLoading(true);
		try {
			const result = await postUserLogin({email, password});
			console.log('result', result);

			// Store token and user info in Redux
			dispatch(setUser(result.data));
			dispatch(setToken(result.token));

			// Also store token in AsyncStorage (if you want)
			await storeToken(result.token);

			router.replace('/home');
		} catch (error) {
			console.error('Login failed:', error);
		} finally {
			setLoading(false);
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

			{loading ? (
				<ActivityIndicator size="large" color="#0000ff" style={{marginVertical: 20}} />
			) : (
				<Button title="Login" onPress={handleLogin} />
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {flex: 1, justifyContent: 'center', padding: 16},
	input: {borderWidth: 1, padding: 8, marginVertical: 8, borderRadius: 5},
});
