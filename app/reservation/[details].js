import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {useLocalSearchParams, router} from 'expo-router';
import {Ionicons} from '@expo/vector-icons';

export default function ReservationDetails() {
	const {reservation: reservationString} = useLocalSearchParams();
	const [reservation, setReservation] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (reservationString) {
			try {
				const parsed = JSON.parse(reservationString);
				setReservation(parsed);
			} catch (err) {
				console.error('Invalid JSON in params:', err);
			}
			setIsLoading(false);
		}
	}, [reservationString]);

	if (isLoading || !reservation) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#555" />
				<Text style={styles.loadingText}>Loading reservation...</Text>
			</View>
		);
	}

	const guest = reservation.guest_information || {};
	const table = reservation.table_master || {};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.separator} />

			<Text style={styles.sectionTitle}>Guest Information</Text>
			<View style={styles.row}>
				<Text style={styles.label}>First Name:</Text>
				<Text>{guest.first_name}</Text>
			</View>
			<View style={styles.row}>
				<Text style={styles.label}>Last Name:</Text>
				<Text>{guest.last_name}</Text>
			</View>
			<View style={styles.row}>
				<Text style={styles.label}>Email:</Text>
				<Text>{guest.email}</Text>
			</View>
			<View style={styles.row}>
				<Text style={styles.label}>Phone:</Text>
				<Text>{guest.phone}</Text>
			</View>

			<Text style={styles.sectionTitle}>Reservation Details</Text>
			<View style={styles.row}>
				<Text style={styles.label}>Reservation ID:</Text>
				<Text>{reservation.reservation_id}</Text>
			</View>
			<View style={styles.row}>
				<Text style={styles.label}>Date:</Text>
				<Text>{reservation.reservation_date}</Text>
			</View>
			<View style={styles.row}>
				<Text style={styles.label}>Time:</Text>
				<Text>{reservation.reservation_time}</Text>
			</View>
			<View style={styles.row}>
				<Text style={styles.label}>Guests:</Text>
				<Text>{reservation.number_of_people}</Text>
			</View>
			<View style={styles.row}>
				<Text style={styles.label}>Status:</Text>
				<Text>{reservation.status}</Text>
			</View>
			<View style={styles.row}>
				<Text style={styles.label}>Notes:</Text>
				<Text>{reservation.noted || 'No additional notes'}</Text>
			</View>

			<Text style={styles.sectionTitle}>Table Information</Text>
			<View style={styles.row}>
				<Text style={styles.label}>Table Name:</Text>
				<Text>{table.table_name}</Text>
			</View>
			<View style={styles.row}>
				<Text style={styles.label}>Capacity:</Text>
				<Text>{table.capacity}</Text>
			</View>
			<View style={styles.row}>
				<Text style={styles.label}>Min Seats:</Text>
				<Text>{table.min_seats}</Text>
			</View>
			<View style={styles.row}>
				<Text style={styles.label}>Max Seats:</Text>
				<Text>{table.max_seats}</Text>
			</View>
			<View style={styles.row}>
				<Text style={styles.label}>Reservation Online:</Text>
				<Text>{table.is_online ? 'yes' : 'no'}</Text>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: '#fff',
		height: '100%',
	},
	separator: {
		width: 50,
		height: 2,
		backgroundColor: 'gray',
		borderRadius: 20,
		marginBottom: 20,
		alignSelf: 'center',
		marginTop: -10,
		borderRadius: 20,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 20,
		marginBottom: 8,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		marginBottom: 6,
	},
	label: {
		fontWeight: '600',
		width: '40%',
		color: '#555',
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		marginTop: 10,
		color: '#666',
	},
});
