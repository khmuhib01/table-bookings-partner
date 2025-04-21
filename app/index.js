import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, Image} from 'react-native';
import {useDispatch} from 'react-redux';
import {postUserLogin} from '../lib/api';
import {storeToken} from '../lib/storage';
import {setUser, setToken} from '../store/slices/userSlice';
import {router} from 'expo-router';

import registerNNPushToken from 'native-notify';

export default function LoginScreen() {
	const [email, setEmail] = useState('adity.chefonline@gmail.com');
	const [password, setPassword] = useState('password');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const dispatch = useDispatch();

	registerNNPushToken(29309, 'iedTkyFbwSYdFMWeDbCLdx');

	const handleLogin = async () => {
		if (!email || !password) {
			Alert.alert('Error', 'Please enter both email and password');
			return;
		}

		setLoading(true);
		setError('');
		try {
			const result = await postUserLogin({email, password});

			dispatch(setUser(result.data));
			dispatch(setToken(result.token));
			await storeToken(result.token);

			router.replace('/home');
		} catch (err) {
			console.error('Login failed:', err);
			setError('Invalid email or password'); // Customize error message if you want
		} finally {
			setLoading(false);
		}
	};

	return (
		<View style={styles.container}>
			<Image source={require('../assets/images/icon.png')} style={styles.logo} />
			<Text style={styles.title}>Login</Text>
			{error ? <Text style={styles.error}>{error}</Text> : null}

			<TextInput
				style={styles.input}
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				autoCapitalize="none"
				keyboardType="email-address"
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>

			{loading ? (
				<ActivityIndicator size="large" color="#C1272D" />
			) : (
				<Button title="Login" color="#C1272D" onPress={handleLogin} disabled={loading} />
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 20,
		backgroundColor: '#fff',
	},
	logo: {
		width: 100,
		height: 100,
		resizeMode: 'contain',
		alignSelf: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 20,
	},
	input: {
		height: 50,
		borderColor: '#ccc',
		borderWidth: 1,
		marginBottom: 15,
		paddingHorizontal: 15,
		borderRadius: 8,
	},
	error: {
		color: 'red',
		marginBottom: 15,
		textAlign: 'center',
	},
});
