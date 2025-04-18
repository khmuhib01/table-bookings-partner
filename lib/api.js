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
		if (config.url !== '/user/login') {
			try {
				const token = await AsyncStorage.getItem('token');
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
			} catch (error) {
				console.error('Error getting token from storage:', error);
			}
		}
		return config;
	},
	(error) => {
		console.error('Request error:', error);
		return Promise.reject(error);
	}
);

// Response interceptor
axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response && error.response.status === 401) {
			console.error('Unauthorized access - possibly expired token');
		}
		console.error('Response error:', error.response ? error.response.data : error.message);
		return Promise.reject(error);
	}
);

// API functions
export const postUserLogin = async (data) => {
	try {
		const response = await axiosInstance.post('/user/login', data);

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

export const getGuestReservationInfo = async (restaurantId) => {
	try {
		const response = await axiosInstance.get('/secure/restaurant/reservation-for-restaurant', {
			params: {
				rest_uuid: restaurantId,
				params: 'info',
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error fetching guest reservation info:', error.response ? error.response.data : error.message);
		throw error;
	}
};

export const getAcceptReservation = async (restaurantId, reservationId, userId) => {
	try {
		const response = await axiosInstance.get('/secure/restaurant/reservation-for-restaurant', {
			params: {
				rest_uuid: restaurantId,
				params: 'accept',
				uuid: reservationId,
				user_uuid: userId,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error accepting reservation:', error.response ? error.response.data : error.message);
		throw error;
	}
};

export const getRejectReservation = async (restaurantId, reservationId, userId) => {
	try {
		const response = await axiosInstance.get('/secure/restaurant/reservation-for-restaurant', {
			params: {
				rest_uuid: restaurantId,
				params: 'reject',
				uuid: reservationId,
				user_uuid: userId,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error rejecting reservation:', error.response ? error.response.data : error.message);
		throw error;
	}
};

export const getCancelReservation = async (restaurantId, reservationId, userId) => {
	try {
		const response = await axiosInstance.get('/secure/restaurant/reservation-for-restaurant', {
			params: {
				rest_uuid: restaurantId,
				params: 'cancel',
				uuid: reservationId,
				user_uuid: userId,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error cancelling reservation:', error.response ? error.response.data : error.message);
		throw error;
	}
};

export const getCheckInReservation = async (restaurantId, reservationId, checkInTime) => {
	try {
		const response = await axiosInstance.get('/secure/restaurant/reservation-for-restaurant', {
			params: {
				rest_uuid: restaurantId,
				params: 'checkin',
				checkin_time: checkInTime,
				uuid: reservationId,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error checking in:', error.response ? error.response.data : error.message);
		throw error;
	}
};

export const getCheckOutReservation = async (restaurantId, reservationId, checkedOutTime) => {
	try {
		const response = await axiosInstance.get('/secure/restaurant/reservation-for-restaurant', {
			params: {
				rest_uuid: restaurantId,
				params: 'checkout',
				uuid: reservationId,
				checkout_time: checkedOutTime,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Error checking out:', error.response ? error.response.data : error.message);
		throw error;
	}
};

export const getRestaurantDetails = async (id) => {
	try {
		const {data} = await axiosInstance.get(`/user/restaurant-single-info/${id}`);
		return data;
	} catch (error) {
		console.error('Error fetching restaurant details:', error.response ? error.response.data : error.message);
		throw error;
	}
};

export default axiosInstance;
