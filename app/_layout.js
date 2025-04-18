import {Provider} from 'react-redux';
import store from '../store/store';
import {Stack} from 'expo-router';
import Colors from '../constants/colors';

export default function RootLayout() {
	return (
		<Provider store={store}>
			<Stack
				screenOptions={{
					headerShown: false,
					headerStyle: {backgroundColor: Colors.danger},
					headerTitleStyle: {color: Colors.white},
					headerTintColor: Colors.white,
					animation: 'slide_from_right',
				}}
			>
				<Stack.Screen
					name="reservation/[details]"
					options={{
						presentation: 'formSheet',
						gestureDirection: 'vertical',
						animation: 'slide_from_bottom',
						sheetInitialDetentIndex: 0,
						sheetAllowedDetents: [0.5, 1.0],
					}}
				/>
				<Stack.Screen
					name="settings/profile"
					options={{
						headerShown: true,
						headerTitle: 'Profile',
					}}
				/>
				<Stack.Screen
					name="settings/sounds"
					options={{
						headerShown: true,
						headerTitle: 'Sound & Vibration',
					}}
				/>
				<Stack.Screen
					name="settings/notifications"
					options={{
						headerShown: true,
						headerTitle: 'Notifications',
					}}
				/>
				<Stack.Screen
					name="settings/helps"
					options={{
						headerShown: false,
						headerTitle: 'Helps',
					}}
				/>
				<Stack.Screen
					name="settings/about"
					options={{
						headerShown: false,
						headerTitle: 'About',
					}}
				/>
			</Stack>
		</Provider>
	);
}
