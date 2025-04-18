import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://apiservice.tablebookings.co.uk/api/v1',
});

export const postUserLogin = async (data) => {
	try {
		console.log('Calling Login API with data:', data);
		const response = await axiosInstance.post('/user/login', data, {
			headers: {'Content-Type': 'application/json'},
		});
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
