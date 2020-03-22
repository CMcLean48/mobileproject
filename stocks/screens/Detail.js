import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Dimensions } from 'react-native';
import finnhub from '../api/finnhub';
import CandleData from '../components/CandleData';
import { LineChart } from 'react-native-chart-kit';

const API_KEY = 'bprd3evrh5r8s3uv7k0g'; //API Key - This should probably be moved to a central file later

export default function Detail({ route, navigation }) {
	const [quote, setQuote] = useState(null);
	const [candle, setCandle] = useState(null);

	const searchAPI = async () => {
		const response = await finnhub.get(
			`/quote?token=${API_KEY}&symbol=${route.params.stock}`
		);
		//.then(response => (response.data));
		setQuote(response.data);
		console.log(response.data);
	};

	var currentDate = Math.round(new Date().getTime() / 1000);
	let fromDate = currentDate - 2592000;
	console.log('current date' + currentDate);
	console.log('from date' + fromDate);
	const searchAPICandle = async () => {
		const candleResponse = await finnhub.get(
			`/stock/candle?symbol=${route.params.stock}&resolution=D&to=${currentDate}&from=${fromDate}&token=${API_KEY}`
		);
		console.log(candleResponse.data);
		setCandle(candleResponse.data);
	};

	useEffect(() => {
		searchAPI();
		searchAPICandle();
		//Get Params from Route
		//console.log(route.params.stock);
	}, []);
	if (!quote) {
		return null;
	}
	if (!candle) {
		return null;
	} else {
		console.log('candle' + candle.c);
	}
	const linedata = {
		labels: ['  week 2', 'week 1', 'current week'],
		datasets: [
			{
				data: candle.c,
				strokeWidth: 2 // optional
			}
    ],
    legend: ["closing "] 
	};
	const chartConfig = {
		backgroundColor: '#e26a00',
		backgroundGradientFrom: '#33A5FF',
		backgroundGradientTo: '#ffa726',
		decimalPlaces: 2, // optional, defaults to 2dp
		color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
		style: {
			borderRadius: 16
		}
	};

	return (
    <>
		<View>
			<Text>{route.params.stock}</Text>
			<LineChart
				data={linedata}
				width={Dimensions.get('window').width} // from react-native
				height={220}
				yAxisLabel={'$'}
				chartConfig={chartConfig}
				bezier
				style={{
					marginVertical: 8,
					borderRadius: 16
				}}
			/>
		</View>
    <SafeAreaView style={styles.container}>
				<Text>Stock Symbol: {route.params.stock}</Text>
				<Text>open:{quote.o}</Text>
				<Text>close:{quote.c}</Text>
				<Text>high:{quote.h}</Text>
				<Text>low:{quote.l}</Text>
				<Text>volume:{quote.pc}</Text>
    </SafeAreaView>
    </>
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
