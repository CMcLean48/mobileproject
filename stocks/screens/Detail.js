import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import finnhub from '../api/finnhub';
import CandleData from '../components/CandleData';

const API_KEY = 'bprd3evrh5r8s3uv7k0g'; //API Key - This should probably be moved to a central file later

export default function Detail({ route, navigation }) {
  const [quote, setQuote] = useState(null);
  const [candle, setCandle]= useState(null);

	const searchAPI = async () => {
		const response = await finnhub
			.get(`/quote?token=${API_KEY}&symbol=${route.params.stock}`)
			//.then(response => (response.data));
		 setQuote(response.data);
		console.log(response.data);
	};
	useEffect(() => {
		searchAPI();
		//Get Params from Route
    //console.log(route.params.stock);
    
	}, []);
	if (!quote) {
		return null;
	}

	return (
		<SafeAreaView style={styles.container}>
      <Text>Stock Symbol: {route.params.stock}</Text>
			<Text>open:{quote.o}</Text>
      <Text>close:{quote.c}</Text>
      <Text>high:{quote.h}</Text>
      <Text>low:{quote.l}</Text>
      <Text>volume:{quote.pc}</Text>
      <CandleData/>
		</SafeAreaView>
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
