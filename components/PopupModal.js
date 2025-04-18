import React, {useState, useEffect} from 'react';
import {View, Text, Modal, TouchableOpacity, StyleSheet, Animated, ActivityIndicator} from 'react-native';

const PopupModal = ({
	isVisible = false,
	onClose,
	title = 'Default Title',
	message = 'Default message',
	buttons = [
		{text: 'OK', onPress: () => {}, style: {}, textStyle: {}},
		{text: 'Close', onPress: () => {}, style: {}, textStyle: {}},
	],
	isLoading = false,
	loadingButtonIndex = buttons.length - 1, // Default to last button
}) => {
	const fadeAnim = useState(new Animated.Value(0))[0];

	useEffect(() => {
		if (isVisible) {
			fadeIn();
		}
	}, [isVisible]);

	const fadeIn = () => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};

	const fadeOut = () => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start(onClose);
	};

	const handleButtonPress = (button) => {
		if (isLoading && buttons.indexOf(button) === loadingButtonIndex) {
			return; // Prevent action while loading
		}
		button.onPress();
		if (buttons.indexOf(button) !== loadingButtonIndex) {
			fadeOut();
		}
	};

	return (
		<Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={fadeOut}>
			<Animated.View style={[styles.modalContainer, {opacity: fadeAnim}]}>
				<View style={styles.modalContent}>
					{title && <Text style={styles.modalTitle}>{title}</Text>}
					{message && <Text style={styles.modalText}>{message}</Text>}

					<View style={styles.buttonContainer}>
						{buttons.map((button, index) => (
							<TouchableOpacity
								key={index}
								style={[
									styles.button,
									button.style,
									isLoading && index === loadingButtonIndex ? styles.loadingButton : null,
								]}
								onPress={() => handleButtonPress(button)}
								disabled={isLoading && index === loadingButtonIndex}
							>
								{isLoading && index === loadingButtonIndex ? (
									<ActivityIndicator color={button.textStyle?.color || 'white'} />
								) : (
									<Text style={[styles.buttonText, button.textStyle]}>{button.text}</Text>
								)}
							</TouchableOpacity>
						))}
					</View>
				</View>
			</Animated.View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
	modalContent: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 10,
		width: '80%',
		alignItems: 'center',
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 20,
		textAlign: 'center',
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
	},
	button: {
		flex: 1,
		marginHorizontal: 5,
		backgroundColor: '#3498db',
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 40,
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
	},
	loadingButton: {
		opacity: 0.8,
	},
});

export default PopupModal;
