import React from 'react';
import {View, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import {WebView} from 'react-native-webview';
import {Ionicons} from '@expo/vector-icons';
import {useRouter} from 'expo-router';

export default function HelpsScreen() {
	const router = useRouter();

	return (
		<View style={styles.container}>
			{/* Header with close button */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
					<Ionicons name="close" size={28} color="#333" />
				</TouchableOpacity>
			</View>

			{/* WebView */}
			<WebView
				source={{uri: 'https://www.tablebookings.co.uk/faq'}}
				startInLoadingState
				renderLoading={() => <ActivityIndicator color="#C1272D" size="large" style={StyleSheet.absoluteFill} />}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {flex: 1},
	header: {
		height: 56,
		justifyContent: 'center',
		paddingHorizontal: 16,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	closeBtn: {
		width: 32,
		height: 32,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
