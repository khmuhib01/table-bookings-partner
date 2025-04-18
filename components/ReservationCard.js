import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

export default function ReservationCard({
	item,
	onAccept,
	onReject,
	onCancel,
	onCheckIn,
	onCheckOut,
	onView,
	loadingAction,
	showOnlyViewButton = false,
}) {
	const isButtonLoading = (action) => {
		return loadingAction && loadingAction.reservationId === item.uuid && loadingAction.action === action;
	};

	const getStatusStyle = () => {
		switch (item.status.toLowerCase()) {
			case 'confirmed':
				return styles.confirmedText;
			case 'pending':
				return styles.pendingText;
			case 'cancelled':
				return styles.cancelledText;
			case 'check_in':
				return styles.checkInText;
			case 'check_out':
				return styles.checkOutText;
			case 'completed':
				return styles.completedText;
			case 'rejected':
				return styles.rejectedText;
			default:
				return styles.defaultText;
		}
	};

	const handleButtonPress = (e, action) => {
		e.stopPropagation(); // Prevent card's onPress from firing
		action();
	};

	return (
		<TouchableOpacity style={styles.cardContainer} onPress={() => onView(item)} activeOpacity={0.9}>
			<View style={styles.card}>
				<View style={styles.topRow}>
					<View style={styles.tableBadge}>
						<Text style={styles.badgeLabel}>TABLE</Text>
						<Text style={styles.badgeValue}>{item.table_master?.table_name || 'N/A'}</Text>
					</View>
					<View style={styles.infoContainer}>
						<View style={styles.infoRow}>
							<Ionicons name="people-outline" size={16} color="#555" style={styles.infoIcon} />
							<Text style={styles.infoText}>
								{item.number_of_people} Guest{item.number_of_people > 1 ? 's' : ''}
							</Text>
						</View>
						<View style={styles.infoRow}>
							<Ionicons name="time-outline" size={16} color="#555" style={styles.infoIcon} />
							<Text style={styles.infoText}>{item.reservation_time}</Text>
						</View>
						<View style={styles.infoRow}>
							<Ionicons name="calendar-outline" size={16} color="#555" style={styles.infoIcon} />
							<Text style={styles.infoText}>{item.reservation_date}</Text>
						</View>
						<View style={styles.infoRow}>
							<Ionicons name="flash-outline" size={16} color="#555" style={styles.infoIcon} />
							<Text style={[styles.statusText, getStatusStyle()]}>
								{item.status === 'pending'
									? 'Pending'
									: item.status === 'confirmed'
									? 'Confirmed'
									: item.status === 'cancelled'
									? 'Cancelled'
									: item.status === 'check_in'
									? 'Checked In'
									: item.status === 'check_out'
									? 'Check Out'
									: item.status === 'reject'
									? 'Rejected'
									: 'Completed'}
							</Text>
						</View>
					</View>
				</View>

				<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.buttonRow}>
					<TouchableOpacity
						style={[styles.button, styles.viewButton]}
						onPress={(e) => handleButtonPress(e, () => onView(item))}
					>
						<Text style={[styles.buttonText, styles.viewButtonText]}>View</Text>
					</TouchableOpacity>

					{!showOnlyViewButton && (
						<>
							{item.status.toLowerCase() === 'pending' && (
								<>
									<TouchableOpacity
										style={[styles.button, styles.rejectButton]}
										onPress={(e) => handleButtonPress(e, () => onReject(item.uuid))}
									>
										<View style={styles.contentContainer}>
											{isButtonLoading('reject') ? <ActivityIndicator color="#991B1B" style={styles.loader} /> : null}
											<Text style={[styles.buttonText, styles.rejectButtonText]}>Reject</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										style={[styles.button, styles.acceptButton]}
										onPress={(e) => handleButtonPress(e, () => onAccept(item.uuid))}
									>
										<View style={styles.contentContainer}>
											{isButtonLoading('accept') ? <ActivityIndicator color="#065F46" style={styles.loader} /> : null}
											<Text style={[styles.buttonText, styles.acceptButtonText]}>Accept</Text>
										</View>
									</TouchableOpacity>
								</>
							)}

							{item.status.toLowerCase() === 'confirmed' && (
								<>
									<TouchableOpacity
										style={[styles.button, styles.cancelButton]}
										onPress={(e) => handleButtonPress(e, () => onCancel(item.uuid))}
									>
										<View style={styles.contentContainer}>
											{isButtonLoading('cancel') ? <ActivityIndicator color="#92400E" style={styles.loader} /> : null}
											<Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
										</View>
									</TouchableOpacity>
									<TouchableOpacity
										style={[styles.button, styles.checkInButton]}
										onPress={(e) => handleButtonPress(e, () => onCheckIn(item.uuid))}
									>
										<View style={styles.contentContainer}>
											{isButtonLoading('checkin') ? <ActivityIndicator color="#1D4ED8" style={styles.loader} /> : null}
											<Text style={[styles.buttonText, styles.checkInButtonText]}>Checked In</Text>
										</View>
									</TouchableOpacity>
								</>
							)}

							{item.status.toLowerCase() === 'check_in' && (
								<TouchableOpacity
									style={[styles.button, styles.checkOutButton]}
									onPress={(e) => handleButtonPress(e, () => onCheckOut(item.uuid))}
								>
									<View style={styles.contentContainer}>
										{isButtonLoading('checkout') ? <ActivityIndicator color="#B45309" style={styles.loader} /> : null}
										<Text style={[styles.buttonText, styles.checkOutButtonText]}>Check Out</Text>
									</View>
								</TouchableOpacity>
							)}
						</>
					)}
				</ScrollView>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	cardContainer: {
		marginBottom: 16,
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: 8,
		padding: 16,
		elevation: 2,
		shadowColor: '#000',
		shadowOffset: {width: 0, height: 1},
		shadowOpacity: 0.1,
		shadowRadius: 2,
	},
	contentContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	topRow: {
		flexDirection: 'row',
		marginBottom: 16,
	},
	tableBadge: {
		backgroundColor: '#E0ECFF',
		borderRadius: 6,
		padding: 8,
		marginRight: 12,
		justifyContent: 'center',
		alignItems: 'center',
		width: 60,
	},
	badgeLabel: {
		fontSize: 10,
		color: '#888',
		marginBottom: 2,
	},
	badgeValue: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#1A73E8',
	},
	infoContainer: {
		flex: 1,
		justifyContent: 'center',
	},
	infoRow: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 4,
	},
	infoIcon: {
		marginRight: 4,
	},
	infoText: {
		fontSize: 14,
		color: '#333',
	},
	statusText: {
		fontWeight: '600',
		textTransform: 'uppercase',
		fontSize: 12,
		letterSpacing: 0.5,
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 4,
	},
	confirmedText: {
		color: '#28a745',
		backgroundColor: '#D1FAE5',
	},
	pendingText: {
		color: '#FFA500',
		backgroundColor: '#FEF3C7',
	},
	cancelledText: {
		color: '#dc3545',
		backgroundColor: '#FEE2E2',
	},
	checkInText: {
		color: '#1D4ED8',
		backgroundColor: '#DBEAFE',
	},
	checkOutText: {
		color: '#B45309',
		backgroundColor: '#FDE68A',
	},
	completedText: {
		color: '#065F46',
		backgroundColor: '#D1FAE5',
	},
	rejectedText: {
		color: '#92400E',
		backgroundColor: '#FEE2E2',
	},
	defaultText: {
		color: '#333',
		backgroundColor: '#f0f0f0',
	},
	buttonRow: {
		paddingTop: 8,
		paddingBottom: 4,
	},
	button: {
		borderRadius: 4,
		borderWidth: 1,
		paddingVertical: 6,
		paddingHorizontal: 12,
		marginRight: 8,
	},
	buttonText: {
		fontWeight: '600',
		fontSize: 14,
	},
	viewButton: {
		borderColor: '#28a745',
		backgroundColor: '#E6F4EA',
	},
	viewButtonText: {
		color: '#1A7F3B',
	},
	acceptButton: {
		borderColor: '#28a745',
		backgroundColor: '#D1FAE5',
	},
	acceptButtonText: {
		color: '#065F46',
	},
	rejectButton: {
		borderColor: '#dc3545',
		backgroundColor: '#FEE2E2',
	},
	rejectButtonText: {
		color: '#991B1B',
	},
	cancelButton: {
		borderColor: '#dc3545',
		backgroundColor: '#FEF3C7',
	},
	cancelButtonText: {
		color: '#92400E',
	},
	checkInButton: {
		borderColor: '#0d6efd',
		backgroundColor: '#DBEAFE',
	},
	checkInButtonText: {
		color: '#1D4ED8',
	},
	checkOutButton: {
		borderColor: '#D97706',
		backgroundColor: '#FDE68A',
	},
	checkOutButtonText: {
		color: '#B45309',
	},
	loader: {
		marginRight: 4,
	},
});
