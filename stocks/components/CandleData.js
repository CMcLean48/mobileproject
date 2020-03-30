import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Dimensions } from 'react-native';

export const CandleData = ({ lineData, chartConfig, labels }) => {
	const API_KEY = 'bprd3evrh5r8s3uv7k0g'; //API Key - This should probably be moved to a central file later
	const [candle, setCandle] = useState(null);
	var currentDate = Math.round(new Date().getTime() / 1000);
	let fromDate = currentDate - 2592000;

	const searchAPICandle = async () => {
		const candleResponse = await finnhub.get(
			`/stock/candle?symbol=${route.params.stock}&resolution=D&to=${currentDate}&from=${fromDate}&token=${API_KEY}`
		);
		//console.log(candleResponse.data);
		setCandle(candleResponse.data);
	};
	useEffect(() => {
		
		searchAPICandle();
		//Get Params from Route
		//console.log(route.params.stock);
	}, []);

	return (searchAPICandle);
};	