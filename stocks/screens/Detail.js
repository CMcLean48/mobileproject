import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	SafeAreaView,
	Text,
	View,
	Button,
	Dimensions
} from 'react-native';
import { AsyncStorage } from 'react-native';
import finnhub from '../api/finnhub';
import { LineChart } from 'react-native-chart-kit';
//import { FINNHUB_API_KEY } from 'react-native-dotenv';

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
	//console.log('current date' + currentDate);
	//console.log('from date' + fromDate);
	const searchAPICandle = async () => {
		const candleResponse = await finnhub.get(
			`/stock/candle?symbol=${route.params.stock}&resolution=D&to=${currentDate}&from=${fromDate}&token=${API_KEY}`
		);
		//console.log(candleResponse.data);
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
		console.log('candle ' + candle.c);
	}
	const lineData = {
		labels: ['week 2', 'week 1', 'current week'],
		datasets: [
			{
				data: candle.c,
				strokeWidth: 4 // optional
			}
		],
		legend: ['closing price over 3 weeks  ']
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
					data={lineData}
					width={Dimensions.get('window').width} // from react-native
					height={240}
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
				<Text style={styles.symbol}>Stock: {route.params.stock}</Text>
				<View style={styles.quote}>
					<Text style={styles.qt}>open:${quote.o}</Text>
					<Text style={styles.qt}>close:${quote.c}</Text>
					<Text style={styles.qt}>high:${quote.h}</Text>
					<Text style={styles.qt}>low:${quote.l}</Text>
					<Text style={styles.qt}>previous close:${quote.pc}</Text>
				</View>

				<Button
					title="Register"
					onPress={() => navigation.navigate('Register')}
				/>

				<Button
					title="Login"
					onPress={() => navigation.navigate('Login')}
				/>

				<Button
					title="Portfolio"
					onPress={() => navigation.navigate('Portfolio')}
				/>

				<Button title="Watch Stock" onPress={() => watchStock()} />

				<Button
					title="Watched Stocks"
					onPress={() => navigation.navigate('WatchList')}
				/>

				<Button
					title="Portfolio"
					onPress={() => navigation.navigate('Portfolio')}
				/>
				<Button title="Buy" onPress={() => buyStock()} />

				<Button title="Sell" onPress={() => sellStock()} />
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,

		backgroundColor: '#ff8a3c',
		alignItems: 'center'
		//	justifyContent: 'center'
	},
	symbol: {
		paddingTop: 20,
		alignItems: 'center',
		justifyContent: 'flex-start',
		color: '#fff',
		fontSize: 25
	},
	quote: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		paddingTop: 40
	},
	qt: {
		color: '#fff',
		fontSize: 20,
		justifyContent: 'space-between',
		paddingRight: 20,
		paddingTop: 20
	}
});
