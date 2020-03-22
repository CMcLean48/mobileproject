import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import finnhub from '../api/finnhub';

const API_KEY = 'bprd3evrh5r8s3uv7k0g'; //API Key - This should probably be moved to a central file later

export default function CandleData({ navigation, stocks }) {

let currentDate = Date.now();
let fromDate = currentDate - 2592000000;
const searchAPICandle = async () => {
	const response = await finnhub.get(
		`/stock/candle?symbol=${route.params.stock}&resolution=D&from=${fromDate}&to=${currentDate}&token=${API_KEY}`
	);
	//https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=1&from=1572651390&to=1572910590&token=bprd3evrh5r8s3uv7k0g', { json: true }, (err, res, body) => {
	// if (err) { return console.log(err); }
	setCandle(response.data);
	console.log(response.data);
};
useEffect(() => {
	searchAPICandle();
	//Get Params from Route
	//console.log(route.params.stock);
}, []);
if (!candle) {
	return null;
}


}