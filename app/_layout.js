import {Provider} from 'react-redux';
import store from '../store/store';
import {Stack} from 'expo-router';

export default function RootLayout() {
	return (
		<Provider store={store}>
			<Stack screenOptions={{headerShown: false}}>
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
			</Stack>
		</Provider>
	);
}
