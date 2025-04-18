import React, {useState} from 'react';
import {View, Text, Switch, StyleSheet, Vibration, TouchableOpacity} from 'react-native';
import Slider from '@react-native-community/slider';
import Colors from '../../constants/colors';

export default function Sounds() {
	const [soundEnabled, setSoundEnabled] = useState(true);
	const [volume, setVolume] = useState(0.5);
	const [vibrationEnabled, setVibrationEnabled] = useState(true);

	const handleVibrationToggle = (value) => {
		setVibrationEnabled(value);
		if (value) {
			Vibration.vibrate(200); // short vibration feedback when turned on
		}
	};

	const testVibration = () => {
		if (vibrationEnabled) {
			Vibration.vibrate(500);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Sound & Vibration Settings</Text>

			<View style={styles.settingRow}>
				<Text style={styles.label}>Enable Sound</Text>
				<Switch
					value={soundEnabled}
					onValueChange={setSoundEnabled}
					trackColor={{false: '#767577', true: Colors.danger}}
					thumbColor={soundEnabled ? Colors.white : '#f4f3f4'}
				/>
			</View>

			<View style={styles.settingRow}>
				<Text style={styles.label}>Volume</Text>
			</View>
			<Slider
				style={styles.slider}
				value={volume}
				onValueChange={setVolume}
				minimumValue={0}
				maximumValue={1}
				step={0.01}
				disabled={!soundEnabled}
				minimumTrackTintColor={Colors.danger}
				maximumTrackTintColor="#d3d3d3"
				thumbTintColor={Colors.danger}
			/>
			<Text style={styles.volumeLabel}>{Math.round(volume * 100)}%</Text>

			<View style={[styles.settingRow, {marginTop: 30}]}>
				<Text style={styles.label}>Enable Vibration</Text>
				<Switch
					value={vibrationEnabled}
					onValueChange={handleVibrationToggle}
					trackColor={{false: '#767577', true: Colors.danger}}
					thumbColor={vibrationEnabled ? Colors.white : '#f4f3f4'}
				/>
			</View>

			<TouchableOpacity
				style={[styles.testButton, {backgroundColor: vibrationEnabled ? Colors.danger : '#ccc'}]}
				onPress={testVibration}
				disabled={!vibrationEnabled}
			>
				<Text style={styles.testButtonText}>Test Vibration</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#fff',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 30,
	},
	settingRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	label: {
		fontSize: 18,
	},
	slider: {
		width: '100%',
		height: 40,
	},
	volumeLabel: {
		fontSize: 16,
		textAlign: 'center',
		marginTop: 10,
		color: '#666',
	},
	testButton: {
		marginTop: 20,
		padding: 15,
		borderRadius: 8,
		alignItems: 'center',
	},
	testButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
