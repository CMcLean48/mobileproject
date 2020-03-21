import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import finnhub from '../api/finnhub';

export default function Detail({ route , navigation}) {
	const [quote, setQuote] = useState(null);

	const searchAPI = async () => {
		const response = await finnhub.get('/quote?symbol='(`${route.params}`));
		{
		}
		setQuote(response.data);
		console.log(response);
	};
	useEffect(() => {
		searchAPI();
	}, []);
	if (!quote) {
		return null;
	}

	return (
		<View style={styles.container}>
			<Text>Open up App.js to start working on your app!</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	}
});
