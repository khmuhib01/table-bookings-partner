// src/components/ReservationList.js

import React, {useEffect, useState, useRef} from 'react';
import {View, Text, FlatList, StyleSheet, ActivityIndicator, Platform} from 'react-native';
import {useSelector} from 'react-redux';
import * as Notifications from 'expo-notifications';

import ReservationCard from './ReservationCard';
import {getGuestReservationInfo} from '../lib/api';
import {getToken} from '../lib/storage';

////////////////////////////////////////////////////////////////////////////////
// 1. Show notifications even in foreground
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: false,
	}),
});

export default function ReservationList({filterType, onView, onAction, showOnlyViewButton, onUpdateCounts}) {
	// 2. Grab these from Redux
	const storeRestaurantId = useSelector((state) => state.user?.user?.res_uuid);
	const isAuthenticated = useSelector((state) => state.user?.isAuthenticated);

	const [reservations, setReservations] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	// 3. Remember last count
	const prevCount = useRef(0);

	// Parse “DD/MM/YYYY” into Date
	const parseDate = (dateString) => {
		const [day, month, year] = dateString.split('/').map(Number);
		return new Date(year, month - 1, day);
	};

	// Filter based on “today” or “future”
	const filterByType = (all) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		return all.filter((res) => {
			const date = parseDate(res.reservation_date);
			return filterType === 'today' ? date.getTime() === today.getTime() : date > today;
		});
	};

	// 4. Fetch + notify if new
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

			// <-- Pass storeRestaurantId here
			const response = await getGuestReservationInfo(storeRestaurantId);
			const all = response?.data?.data || [];

			if (onUpdateCounts) onUpdateCounts(all);

			const filtered = filterByType(all);

			// Send local notification when count increases
			if (filtered.length > prevCount.current) {
				const diff = filtered.length - prevCount.current;
				await Notifications.scheduleNotificationAsync({
					content: {
						title: `New Reservation${diff > 1 ? 's' : ''}`,
						body: `You have ${diff} new ${diff > 1 ? 'reservations' : 'reservation'}.`,
					},
					trigger: null,
				});
			}

			prevCount.current = filtered.length;
			setReservations(filtered);
		} catch (err) {
			console.error('Error loading reservations:', err);
		} finally {
			setIsLoading(false);
			setRefreshing(false);
		}
	};

	// 5. On mount, set up Android channel, load once & poll
	useEffect(() => {
		if (Platform.OS === 'android') {
			Notifications.setNotificationChannelAsync('default', {
				name: 'default',
				importance: Notifications.AndroidImportance.MAX,
			});
		}

		loadReservations();
		const interval = setInterval(loadReservations, 30000);
		return () => clearInterval(interval);
	}, []);

	// 6. Render loading / empty / list
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
