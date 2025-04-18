import React, {useState, useCallback, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useRouter} from 'expo-router';
import {useSelector} from 'react-redux';
import ReservationList from '../../components/ReservationList';
import {
	getAcceptReservation,
	getCancelReservation,
	getCheckInReservation,
	getCheckOutReservation,
	getRejectReservation,
} from './../../lib/api';
import PopupModal from '../../components/PopupModal';

const initialLayout = {width: Dimensions.get('window').width};

export default function HomeScreen() {
	const [index, setIndex] = useState(0);
	const [counts, setCounts] = useState({today: 0, upcoming: 0});
	const [routes, setRoutes] = useState([
		{key: 'today', title: "Today's(0)"},
		{key: 'upcoming', title: 'Upcoming(0)'},
	]);
	const [modalConfig, setModalConfig] = useState({
		visible: false,
		title: '',
		message: '',
		action: null,
		reservationId: null,
	});
	const [isProcessing, setIsProcessing] = useState(false);
	const [refreshKey, setRefreshKey] = useState(0);

	const router = useRouter();
	const storeUserId = useSelector((state) => state.user?.user?.uuid);
	const storeRestaurantId = useSelector((state) => state.user?.user?.res_uuid);

	const updateCounts = useCallback((allReservations) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		let todayCount = 0;
		let upcomingCount = 0;

		allReservations.forEach((res) => {
			try {
				const [day, month, year] = res.reservation_date.split('/').map(Number);
				const resDate = new Date(year, month - 1, day);

				if (resDate.getTime() === today.getTime()) {
					todayCount++;
				} else if (resDate > today) {
					upcomingCount++;
				}
			} catch (e) {
				console.error('Error counting reservation:', res.reservation_date, e);
			}
		});

		setCounts({today: todayCount, upcoming: upcomingCount});
	}, []);

	useEffect(() => {
		setRoutes([
			{key: 'today', title: `Today's(${counts.today})`},
			{key: 'upcoming', title: `Upcoming(${counts.upcoming})`},
		]);
	}, [counts]);

	const TodayReservations = useCallback(
		() => (
			<ReservationList
				filterType="today"
				onView={handleViewPress}
				onAction={showConfirmationModal}
				refreshKey={refreshKey}
				onUpdateCounts={updateCounts}
			/>
		),
		[refreshKey, updateCounts]
	);

	const UpcomingReservations = useCallback(
		() => (
			<ReservationList
				filterType="upcoming"
				onView={handleViewPress}
				onAction={showConfirmationModal}
				showOnlyViewButton
				refreshKey={refreshKey}
				onUpdateCounts={updateCounts}
			/>
		),
		[refreshKey, updateCounts]
	);

	const renderScene = SceneMap({
		today: TodayReservations,
		upcoming: UpcomingReservations,
	});

	const renderTabBar = (props) => (
		<TabBar
			{...props}
			indicatorStyle={styles.indicator}
			style={styles.tabBar}
			labelStyle={styles.label}
			activeColor="#EF4444"
			inactiveColor="#555"
		/>
	);

	const handleViewPress = (item) => {
		router.push({
			pathname: '/reservation/[details]',
			params: {reservation: JSON.stringify(item)},
		});
	};

	const showConfirmationModal = (action, reservationId) => {
		const messages = {
			accept: {
				title: 'Confirm Acceptance',
				message: 'Are you sure you want to accept this reservation?',
			},
			reject: {
				title: 'Confirm Rejection',
				message: 'Are you sure you want to reject this reservation?',
			},
			cancel: {
				title: 'Confirm Cancellation',
				message: 'Are you sure you want to cancel this reservation?',
			},
			checkin: {
				title: 'Confirm Checked In',
				message: 'Are you sure you want to checked in this guest?',
			},
			checkout: {
				title: 'Confirm Check Out',
				message: 'Are you sure you want to check out this guest?',
			},
		};

		setModalConfig({
			visible: true,
			...messages[action],
			action,
			reservationId,
		});
	};

	const handleConfirmAction = async () => {
		try {
			setIsProcessing(true);
			const {action, reservationId} = modalConfig;
			let data;

			switch (action) {
				case 'accept':
					data = await getAcceptReservation(storeRestaurantId, reservationId, storeUserId);
					break;
				case 'reject':
					data = await getRejectReservation(storeRestaurantId, reservationId, storeUserId);
					break;
				case 'cancel':
					data = await getCancelReservation(storeRestaurantId, reservationId, storeUserId);
					break;
				case 'checkin':
					const checkInTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
					data = await getCheckInReservation(storeRestaurantId, reservationId, checkInTime);
					break;
				case 'checkout':
					const checkOutTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
					data = await getCheckOutReservation(storeRestaurantId, reservationId, checkOutTime);
					break;
				default:
					break;
			}

			console.log(`${action} successful:`, data);
			// Trigger refresh after successful action
			setRefreshKey((prev) => prev + 1);
		} catch (error) {
			console.error(`Error in ${modalConfig.action}:`, error);
		} finally {
			setIsProcessing(false);
			setModalConfig({...modalConfig, visible: false});
		}
	};

	useEffect(() => {
		// Increase the refreshKey whenever the tab changes.
		setRefreshKey((prev) => prev + 1);
	}, [index]);

	return (
		<View style={styles.container}>
			<TabView
				navigationState={{index, routes}}
				renderScene={renderScene}
				onIndexChange={setIndex}
				initialLayout={initialLayout}
				renderTabBar={renderTabBar}
				swipeEnabled={true}
			/>

			<PopupModal
				isVisible={modalConfig.visible}
				onClose={() => !isProcessing && setModalConfig({...modalConfig, visible: false})}
				title={modalConfig.title}
				message={modalConfig.message}
				isLoading={isProcessing}
				loadingButtonIndex={1}
				buttons={[
					{
						text: 'Cancel',
						onPress: () => setModalConfig({...modalConfig, visible: false}),
						style: {backgroundColor: '#f44336'},
						textStyle: {fontSize: 16},
					},
					{
						text: 'Confirm',
						onPress: handleConfirmAction,
						style: {backgroundColor: '#4CAF50'},
						textStyle: {fontSize: 16},
					},
				]}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#F3F3F3',
	},
	tabBar: {
		backgroundColor: '#fff',
		elevation: 0,
		shadowOpacity: 0,
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	indicator: {
		backgroundColor: '#EF4444',
		height: 3,
	},
	label: {
		fontWeight: '600',
		textTransform: 'capitalize',
		fontSize: 16,
	},
});
