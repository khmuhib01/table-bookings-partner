import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, ScrollView, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';
import {getRestaurantDetails} from './../../lib/api';
import Colors from '../../constants/colors';

const BASE_URL = 'https://apiservice.tablebookings.co.uk';

export default function Profile() {
	// Get the restaurant ID from Redux
	const restaurantId = useSelector((state) => state.user?.user?.res_uuid);

	// Local state for data, loading, and error
	const [restaurantData, setRestaurantData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [errorMsg, setErrorMsg] = useState('');

	useEffect(() => {
		// If we have an ID, fetch details
		if (restaurantId) {
			fetchData();
		}
	}, [restaurantId]);

	async function fetchData() {
		try {
			const response = await getRestaurantDetails(restaurantId);
			// response.data holds the restaurant info
			setRestaurantData(response.data);
		} catch (error) {
			setErrorMsg('Could not load restaurant information.');
		}
		setLoading(false);
	}

	// Show loader while fetching
	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color={Colors.danger} />
			</View>
		);
	}

	// Show error if fetch failed
	if (errorMsg) {
		return (
			<View style={styles.center}>
				<Text style={styles.errorText}>{errorMsg}</Text>
			</View>
		);
	}

	// If we have data, render it
	if (!restaurantData) {
		return null;
	}

	// Extract fields
	const avatarUrl = `${BASE_URL}/${restaurantData.avatar}`;
	const name = restaurantData.name;
	const address = restaurantData.address;
	const postcode = restaurantData.post_code;
	const phone = restaurantData.phone;
	const email = restaurantData.email;
	const website = restaurantData.website;
	const slots = restaurantData.aval_slots || {};

	return (
		<ScrollView style={styles.container}>
			{restaurantData.avatar ? <Image source={{uri: avatarUrl}} style={styles.image} /> : null}

			<View style={styles.content}>
				<Text style={styles.name}>{name}</Text>

				<View style={styles.infoSection}>
					<Text style={styles.label}>Address:</Text>
					<Text style={styles.info}>
						{address}, {postcode}
					</Text>
				</View>

				<View style={styles.infoSection}>
					<Text style={styles.label}>Phone:</Text>
					<Text style={styles.info}>{phone}</Text>
				</View>

				<View style={styles.infoSection}>
					<Text style={styles.label}>Email:</Text>
					<Text style={styles.info}>{email}</Text>
				</View>

				<View style={styles.infoSection}>
					<Text style={styles.label}>Website:</Text>
					<Text style={styles.info}>{website}</Text>
				</View>

				<View style={styles.infoSection}>
					<Text style={styles.label}>Available Slots:</Text>
					{Object.keys(slots).map((day) => (
						<View key={day} style={styles.slotDay}>
							<Text style={styles.slotDayLabel}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
							{slots[day].length > 0 ? (
								slots[day].map((slot) => (
									<Text key={slot.id} style={styles.slotText}>
										{slot.slot_start} - {slot.slot_end}
									</Text>
								))
							) : (
								<Text style={styles.slotText}>No slots</Text>
							)}
						</View>
					))}
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {flex: 1, backgroundColor: '#fff'},
	center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
	errorText: {color: 'red'},

	image: {width: '100%', height: 200},
	content: {padding: 20},

	name: {fontSize: 24, fontWeight: 'bold', marginBottom: 15},

	infoSection: {marginBottom: 15},
	label: {fontSize: 16, fontWeight: 'bold'},
	info: {fontSize: 16, marginTop: 4},

	slotDay: {marginTop: 10, paddingLeft: 10},
	slotDayLabel: {fontSize: 15, fontWeight: 'bold'},
	slotText: {fontSize: 14, marginLeft: 5},
});
