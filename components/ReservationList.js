// src/components/ReservationList.js
import React, {useEffect, useState, useRef} from 'react';
import {View, Text, FlatList, StyleSheet, ActivityIndicator, Platform, AppState} from 'react-native';
import {useSelector} from 'react-redux';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

import ReservationCard from './ReservationCard';
import {getGuestReservationInfo} from '../lib/api';
import {getToken} from '../lib/storage';

// Enhanced notification handler
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

export default function ReservationList({filterType, onView, onAction, showOnlyViewButton, onUpdateCounts}) {
	const storeRestaurantId = useSelector((state) => state.user?.user?.res_uuid);
	const isAuthenticated = useSelector((state) => state.user?.isAuthenticated);

	const [reservations, setReservations] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	// Track all reservation UUIDs to detect new ones
	const reservationUuids = useRef(new Set());
	const isAppActive = useRef(true);
	const isInitialLoad = useRef(true);
	const notificationPermission = useRef(false);

	// Parse date function remains the same
	const parseDate = (dateString) => {
		const [day, month, year] = dateString.split('/').map(Number);
		return new Date(year, month - 1, day);
	};

	// Filter function remains the same
	const filterByType = (all) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		return all.filter((res) => {
			const date = parseDate(res.reservation_date);
			return filterType === 'today' ? date.getTime() === today.getTime() : date > today;
		});
	};

	// Enhanced notification function
	const showNotification = async (count) => {
		try {
			console.log('Attempting to show notification...');

			// Double-check permission
			const {status} = await Notifications.getPermissionsAsync();
			if (status !== 'granted') {
				console.log('Notification permission not granted');
				return;
			}

			await Notifications.scheduleNotificationAsync({
				content: {
					title: `New Reservation${count > 1 ? 's' : ''}`,
					body: `You have ${count} new ${count > 1 ? 'reservations' : 'reservation'}`,
					sound: true,
					priority: 'high',
					vibrate: [0, 250, 250, 250],
				},
				trigger: null,
			});
			console.log('Notification scheduled successfully');
		} catch (error) {
			console.error('Failed to show notification:', error);
		}
	};

	const loadReservations = async () => {
		if (!isAuthenticated || !storeRestaurantId) {
			setIsLoading(false);
			setRefreshing(false);
			return;
		}

		setRefreshing(true);

		try {
			const token = await getToken();
			if (!token) throw new Error('No auth token');

			const response = await getGuestReservationInfo(storeRestaurantId);
			const all = response?.data?.data || [];
			console.log('Fetched reservations:', all.length);

			if (onUpdateCounts) onUpdateCounts(all);

			const filtered = filterByType(all);
			const newReservations = [];

			// Check for new reservations
			filtered.forEach((res) => {
				if (!reservationUuids.current.has(res.uuid)) {
					newReservations.push(res);
					reservationUuids.current.add(res.uuid);
				}
			});

			console.log('New reservations detected:', newReservations.length);
			console.log('App state:', isAppActive.current ? 'active' : 'background');

			// Skip notification on initial load
			if (!isInitialLoad.current && newReservations.length > 0) {
				// Show notification if app is in background or testing on simulator
				if (!isAppActive.current || __DEV__) {
					await showNotification(newReservations.length);
				}
			}

			setReservations(filtered);
		} catch (err) {
			console.error('Error loading reservations:', err);
		} finally {
			setIsLoading(false);
			setRefreshing(false);
			isInitialLoad.current = false;
		}
	};

	useEffect(() => {
		// Enhanced notification setup
		const setupNotifications = async () => {
			try {
				// Request permissions
				const {status: existingStatus} = await Notifications.getPermissionsAsync();
				let finalStatus = existingStatus;

				if (existingStatus !== 'granted') {
					const {status} = await Notifications.requestPermissionsAsync();
					finalStatus = status;
				}

				notificationPermission.current = finalStatus === 'granted';
				console.log('Notification permission:', notificationPermission.current);

				if (Platform.OS === 'android') {
					await Notifications.setNotificationChannelAsync('default', {
						name: 'Default Channel',
						importance: Notifications.AndroidImportance.MAX,
						vibrationPattern: [0, 250, 250, 250],
						sound: true,
						lights: true,
						lockScreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
					});
					console.log('Android notification channel configured');
				}
			} catch (error) {
				console.error('Notification setup failed:', error);
			}
		};

		setupNotifications();

		// Track app state
		const handleAppStateChange = (nextAppState) => {
			isAppActive.current = nextAppState === 'active';
			console.log('App state changed to:', nextAppState);
		};

		const subscription = AppState.addEventListener('change', handleAppStateChange);

		// Initial load
		loadReservations();

		// Set up polling
		const interval = setInterval(loadReservations, 30000);

		// Test notification (remove in production)
		const testNotification = setTimeout(async () => {
			if (__DEV__) {
				console.log('Sending test notification...');
				await showNotification(1);
			}
		}, 5000);

		return () => {
			clearInterval(interval);
			clearTimeout(testNotification);
			subscription.remove();
		};
	}, []);

	// ... rest of your component (render methods) remains the same ...
	if (isLoading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color="#C1272D" />
				<Text>Loading reservations…</Text>
			</View>
		);
	}

	if (!reservations.length) {
		return (
			<View style={styles.center}>
				<Text>{filterType === 'today' ? 'No reservations for today' : 'No upcoming reservations'}</Text>
			</View>
		);
	}

	return (
		<FlatList
			data={reservations}
			keyExtractor={(item) => item.uuid || String(item.id)}
			renderItem={({item}) => (
				<ReservationCard
					item={item}
					onAccept={() => onAction('accept', item.uuid)}
					onReject={() => onAction('reject', item.uuid)}
					onCancel={() => onAction('cancel', item.uuid)}
					onCheckIn={() => onAction('checkin', item.uuid)}
					onCheckOut={() => onAction('checkout', item.uuid)}
					onView={() => onView(item)}
					showOnlyViewButton={showOnlyViewButton}
				/>
			)}
			refreshing={refreshing}
			onRefresh={loadReservations}
			contentContainerStyle={styles.list}
		/>
	);
}

const styles = StyleSheet.create({
	center: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
	},
	list: {
		padding: 16,
	},
});
