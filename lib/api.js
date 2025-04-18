import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://apiservice.tablebookings.co.uk/api/v1';

// Create axios instance
const axiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
	async (config) => {
		console.log('Making request to:', config.url);

		// Skip adding token for login endpoint
		if (config.url !== '/user/login') {
			try {
				const token = await AsyncStorage.getItem('token');
				console.log('token....................', token);
				console.log('Retrieved token for API call:', token);
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
			} catch (error) {
				console.log('Error getting token from storage:', error);
			}
		}

		return config;
	},
	(error) => {
		console.log('Request error:', error);
		return Promise.reject(error);
	}
);

// Response interceptor
axiosInstance.interceptors.response.use(
	(response) => {
		console.log('Response from:', response.config.url, response.data);
		return response;
	},
	(error) => {
		console.log('Response error:', error.response ? error.response.data : error.message);

		// Handle token expiration or unauthorized errors
		if (error.response && error.response.status === 401) {
			console.log('Unauthorized access - possibly expired token');
			// You might want to add logic to redirect to login here
		}

		return Promise.reject(error);
	}
);

export const postUserLogin = async (data) => {
	try {
		console.log('Calling Login API with data:', data);
		const response = await axiosInstance.post('/user/login', data);
		console.log('Login API response:', response.data);

		if (!response.data.token) {
			throw new Error('Invalid response format from server');
		}

		return {
			token: response.data.token,
			data: response.data.data,
			message: response.data.message,
			status: response.data.status,
		};
	} catch (error) {
		console.error('Error logging in:', error.response ? error.response.data : error.message);
		throw error;
	}
};

// All your other API functions remain the same but will now automatically include the token
export const getGuestReservationInfo = async (restaurantId) => {
	try {
		console.log('Fetching guest reservation info for:', restaurantId);
		const response = await axiosInstance.get('/secure/restaurant/reservation-for-restaurant', {
			params: {
				rest_uuid: restaurantId,
				params: 'info',
			},
		});
		console.log('Guest reservation info response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error fetching guest reservation info:', error.response ? error.response.data : error.message);
		throw error;
	}
};

export const getAcceptReservation = async (restaurantId, reservationId, userId) => {
	try {
		console.log('Accepting reservation:', {restaurantId, reservationId, userId});
		const response = await axiosInstance.get('/secure/restaurant/reservation-for-restaurant', {
			params: {
				rest_uuid: restaurantId,
				params: 'accept',
				uuid: reservationId,
				user_uuid: userId,
			},
		});
		console.log('Accept reservation response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error accepting reservation:', error.response ? error.response.data : error.message);
		throw error;
	}
};

export const getRejectReservation = async (restaurantId, reservationId, userId) => {
	try {
		console.log('Rejecting reservation:', {restaurantId, reservationId, userId});
		const response = await axiosInstance.get('/secure/restaurant/reservation-for-restaurant', {
			params: {
				rest_uuid: restaurantId,
				params: 'reject',
				uuid: reservationId,
				user_uuid: userId,
			},
		});
		console.log('Reject reservation response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error rejecting reservation:', error.response ? error.response.data : error.message);
		throw error;
	}
};

export const getCancelReservation = async (restaurantId, reservationId, userId) => {
	try {
		console.log('Cancelling reservation:', {restaurantId, reservationId, userId});
		const response = await axiosInstance.get('/secure/restaurant/reservation-for-restaurant', {
			params: {
				rest_uuid: restaurantId,
				params: 'cancel',
				uuid: reservationId,
				user_uuid: userId,
			},
		});
		console.log('Cancel reservation response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error cancelling reservation:', error.response ? error.response.data : error.message);
		throw error;
	}
};

export const getCheckInReservation = async (restaurantId, reservationId, checkInTime) => {
	try {
		console.log('Checking in reservation:', {restaurantId, reservationId, checkInTime});
		const response = await axiosInstance.get('/secure/restaurant/reservation-for-restaurant', {
			params: {
				rest_uuid: restaurantId,
				params: 'checkin',
				checkin_time: checkInTime,
				uuid: reservationId,
			},
		});
		console.log('Check-in response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error checking in:', error.response ? error.response.data : error.message);
		throw error;
	}
};

export const getCheckOutReservation = async (restaurantId, reservationId, checkedOutTime) => {
	try {
		console.log('Checking out reservation:', {restaurantId, reservationId, checkedOutTime});
		const response = await axiosInstance.get('/secure/restaurant/reservation-for-restaurant', {
			params: {
				rest_uuid: restaurantId,
				params: 'checkout',
				uuid: reservationId,
				checkout_time: checkedOutTime,
			},
		});
		console.log('Check-out response:', response.data);
		return response.data;
	} catch (error) {
		console.error('Error checking out:', error.response ? error.response.data : error.message);
		throw error;
	}
};

export const getRestaurantDetails = async (id) => {
	try {
		console.log('Fetching restaurant details for:', id);
		const {data} = await axiosInstance.get(`/user/restaurant-single-info/${id}`);
		console.log('Restaurant details response:', data);
		return data;
	} catch (error) {
		console.error('Error fetching restaurant details:', error);
		throw error;
	}
};

export default axiosInstance;
