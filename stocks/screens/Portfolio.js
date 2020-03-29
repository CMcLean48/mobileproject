import React, {useState} from 'react';
import { StyleSheet, Text, SafeAreaView, Button } from 'react-native';
import firebase from '../firebase';
import { useFocusEffect } from "@react-navigation/native";
import { AsyncStorage } from "react-native";



export default function Portfolio({ navigation }) {

	useFocusEffect(
		React.useCallback(() => {
		  let isActive = true;

		  async function getJWT() {
			try {
			  console.log("inside retrive data");
			  let value = await AsyncStorage.getItem("JWT_TOKEN");
			  if (value !== null) {
				// We have data!!
				console.log(value);
				return value;
			  }
			} catch (error) {
			  // Error retrieving data
			  console.error(error);
			}
		  }

		  async function getData(isActive) {
			if (isActive) {
			  fetch("https://ssdstockappapi.azurewebsites.net/api/Portfolio", {
				method: "GET",
				headers: {
				  Authorization: `Bearer ${await getJWT()}`
				}
			  })
				.then(res => res.json())
				.then(data => {
				  setjson(data);
				})
				.catch(error => {
				  console.log(error);
				});
			}
		  }

		  getData(isActive).catch(e => {console.error(error)})

		  return () => {
			isActive = false;
		  };
		}, [])
	  );

	const [json, setjson] = useState({
		userEmail: "Loading"
	  })

	return(
		<SafeAreaView style={styles.container}>
		<SafeAreaView style={styles.textContainer}>
			<Text style={styles.textBold}>{json.userEmail}</Text>
			{!!json.cashBalance && <Text style={styles.text}>Cash Balance: $ {json.cashBalance} USD</Text>}
			{!!json.currentPortfolioValue && <Text style={styles.text}>Portfolio Value: $ {json.currentPortfolioValue} CAD</Text>}
			</SafeAreaView>
			{!!json.stockHoldings && json.stockHoldings.map((stock, index) => {
				return ( <SafeAreaView key={stock.stockSymbol} style={{backgroundColor: (checkIndexIsEven(index) ? "#ff8a3c" : "#33A5FF"), 		borderRadius: 10, width: "80%", alignItems: "center"	}}>
				<Text style={styles.bold}>{stock.companyName} | {stock.stockSymbol}</Text>
						<Text>Total Value: {stock.currentValue}</Text>
						<Text>Stock Price: {stock.currentPrice}</Text>
						<Text>Quantity: {stock.quantity}</Text>

						</SafeAreaView>
					)
			})}
		</SafeAreaView>);
}

function checkIndexIsEven (n) {
    return n % 2 == 0;
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  alignItems: "center",
	  backgroundColor: "#fff",
	  justifyContent: "center",
	},
	textContainer: {
		alignItems: "center",
	},
	text: {
		width: "80%",
		alignItems: "center"
	},
	textBold: {
		width: "80%",
		alignItems: "center",
		fontWeight: "bold"
	},
	bold: {
		paddingTop: 10,
		fontWeight: "bold"
	}
  });
