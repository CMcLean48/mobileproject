import React, { useState, useEffect } from 'react';
import {

	StyleSheet,
	SafeAreaView,
	Text,
	TextInput,
	View,
	Dimensions,
	Button,
	Picker
} from 'react-native';
import { AsyncStorage } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import finnhub from '../api/finnhub';
import { LineChart } from 'react-native-chart-kit';
import { ScrollView } from 'react-native-gesture-handler';
import { Formik } from 'formik';
import * as Yup from 'yup';
import firebase from "../firebase";


//import { FINNHUB_API_KEY } from 'react-native-dotenv';

const API_KEY = 'bprd3evrh5r8s3uv7k0g'; //API Key - This should probably be moved to a central file later

export default function Detail({ route, navigation }) {

	useFocusEffect(
		React.useCallback(() => {
		  let isActive = true;

		  const getCurrentUser = async () => {
			try {
			  let currentUser = await firebase.auth().currentUser;

			  if (currentUser != null) {
				setLoggedIn(true);
			  } else {
				setLoggedIn(false);
				console.log(currentUser)
			  }
			} catch (error) {
			  console.log("Error Checking Logged In User" + error);
			}
		  };


		  getCurrentUser();


		  return () => {
			isActive = false;
		  };
		}, [navigation])
	  );

	useFocusEffect(
		React.useCallback(() => {
			searchAPI();
			searchAPICandle();
			//Get Params from Route
			//console.log(route.params.stock);
		}, [navigation])
	);

	const [quote, setQuote] = useState(null);
	const [candle, setCandle] = useState(null);
	const [JWT, setJWT] = useState('');
	const [loggedIn, setLoggedIn] = useState(false);
	const [value, onChangeText] = React.useState('stock qty');

	const searchAPI = async () => {
		const response = await finnhub.get(
			`/quote?token=${API_KEY}&symbol=${route.params.stock}`
		);
		//.then(response => (response.data));
		setQuote(response.data);
		console.log(response.data);
	};
  
  // async function getJWT() {
  //   try {
  //     let value = await AsyncStorage.getItem("JWT_TOKEN");
  //     if (value !== null) return value;
  //   } catch (error) {
  //     //console.error(error);
  //   }
  // }

  async function watchStock(stockSymbol) {
    let JWTtoken = await (await firebase.auth().currentUser.getIdTokenResult())
      .token;
    //var JWTtoken = await getJWT();
    //console.log(JWTtoken);
    //console.log(stockSymbol);
    if (JWTtoken !== null) {
      await fetch("https://ssdstockappapi.azurewebsites.net/api/WatchList", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${JWTtoken}`
        },
        body: JSON.stringify({ stockSymbol: stockSymbol })
      })
        .then(res => res.json())
        .then(data => {
          if (data.stockSymbol == stockSymbol) {
            alert(data.stockSymbol + "was placed in your watch list");
          } else {
            alert("Something went wrong: " + data.message);
          }
          //console.log(data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }



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
				data: candle.c === undefined ? [0] : candle.c,
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

	async function getJWT() {
		try {
			let value = await AsyncStorage.getItem('JWT_TOKEN');
			if (value !== null) return value;
		} catch (error) {
			//console.error(error);
		}
	}

	async function watchStock(stockSymbol) {
		var JWTtoken = await getJWT();
		//console.log(JWTtoken);
		//console.log(stockSymbol);
		if (JWTtoken !== null) {
			await fetch(
				'https://ssdstockappapi.azurewebsites.net/api/WatchList',
				{
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
						Authorization: `Bearer ${JWTtoken}`
					},
					body: JSON.stringify({ stockSymbol: stockSymbol })
				}
			)
				.then(res => res.json())
				.then(data => {
					if (data.stockSymbol == stockSymbol) {
						alert(
							data.stockSymbol + 'was placed in your watch list'
						);
					} else {
						alert('Something went wrong: ' + data.message);
					}
					//console.log(data);
				})
				.catch(err => {
					console.log(err);
				});
		}
	}

	return (
		<>
			<SafeAreaView style={styles.container}>
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

				<Text style={styles.symbol}>Stock: {route.params.stock}</Text>
				<ScrollView>
					<View style={styles.quote}>
						{!!quote.o && (
							<Text style={styles.qt}>
								open:${quote.o.toFixed(2)}
							</Text>
						)}
						{!!quote.c && (
							<Text style={styles.qt}>
								close:${quote.c.toFixed(2)}
							</Text>
						)}
						{!!quote.h && (
							<Text style={styles.qt}>
								high:${quote.h.toFixed(2)}
							</Text>
						)}
						{!!quote.qt && (
							<Text style={styles.qt}>
								low:${quote.l.toFixed(2)}
							</Text>
						)}
						{!!quote.pc && (
							<Text style={styles.qt}>
								previous close:${quote.pc.toFixed(2)}
							</Text>
						)}
					</View>
					<View style={styles.btnGroup}>
						{!loggedIn && (
							<Button
								color="#33A5FF"
								style={styles.btn}
								title="Register"
								onPress={() => navigation.navigate('Register')}
							/>
						)}

						{!loggedIn && (
							<Button
								color="#33A5FF"
								title="Login"
								onPress={() => navigation.navigate('Login')}
							/>
						)}

						{loggedIn && (
							<Button
								color="#33A5FF"
								title="Portfolio"
								onPress={() => navigation.navigate('Portfolio')}
							/>
						)}

						{loggedIn && (
							<Button
								color="#33A5FF"
								title="Watch This Stock"
								onPress={() => watchStock(route.params.stock)}
							/>
						)}

						{loggedIn && (
							<Button
								color="#33A5FF"
								title="Watched Stocks"
								onPress={() => navigation.navigate('WatchList')}
							/>
						)}

					{loggedIn && (
							<Button
								color="#33A5FF"
								title="Buy or Sell"
								onPress={() => navigation.navigate('Transaction', {stock: route.params.stock})}
							/>
						)}
					</View>
				</ScrollView>

				{/* {loggedIn && (
							<Button title="Buy" onPress={() => buyStock()} />
						)} */}

				{/* {loggedIn && (
							<Button title="Sell" onPress={() => sellStock()} />
						)} */}

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
		paddingTop: 10,
		alignItems: 'center',
		justifyContent: 'flex-start',
		color: '#fff',
		fontSize: 25
	},
	quote: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		paddingTop: 10
	},
	qt: {
		color: '#fff',
		fontSize: 20,
		justifyContent: 'space-between',
		paddingRight: 20,
		paddingTop: 10
	},
	btnGroup: {
		paddingTop: 10,
		color: '#33A5FF'
	},
	picker: {
		flex: 1,
		paddingTop: 10,
		alignItems: 'center'
	},
	btns: {}
});
