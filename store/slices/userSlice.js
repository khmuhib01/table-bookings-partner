import {createSlice} from '@reduxjs/toolkit';

const initialState = {
	user: null,
	token: null,
	isAuthenticated: false,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser(state, action) {
			state.user = action.payload;
			state.isAuthenticated = true;
		},
		setToken(state, action) {
			state.token = action.payload;
		},
		logout(state) {
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
		},
	},
});

export const {setUser, setToken, logout} = userSlice.actions;
export default userSlice.reducer;
