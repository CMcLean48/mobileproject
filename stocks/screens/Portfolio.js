import React, {useState} from 'react';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity, Alert, Dimensions, ScrollView } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import { AsyncStorage } from "react-native";
import { LineChart } from 'react-native-chart-kit';



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
					setjson(data)
					console.log(data)
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

	function displayMore(stock) {
		Alert.alert(
`${stock.companyName}`,
`Avg Cost: ${stock.averageCost.toFixed(2)}
Current Price: ${stock.currentPrice.toFixed(2)}
Current Value: ${stock.currentValue.toFixed(2)}
Total Cost: ${stock.totalCost.toFixed(2)}
Unrealized Gain/Loss: ${stock.unrealizedGainLoss.toFixed(2)}
`)
	}

	const lineData = {
		labels: ['Week 1 (latest)', 'Week 2', 'Week 3', 'Week 4'],
		datasets: [
			{
				data: json.portfolio30DayHistory ? json.portfolio30DayHistory.map((history) => {if(history.basePortfolioValue) {return (history.snapshotPortfolioValue - history.basePortfolioValue)/history.basePortfolioValue*100}else{return 0}}) : [0],
				strokeWidth: 4 // optional
			}
		],
		legend: ['percentage gain / loss over 4 weeks  ']
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

	return(
		<SafeAreaView style={styles.container}>
			<LineChart
					data={lineData}
					width={Dimensions.get('window').width} // from react-native
					height={240}
					yAxisLabel={'% '}
					chartConfig={chartConfig}
					bezier
					style={{
						marginVertical: 8,
						borderRadius: 16
					}}
				/>
			<ScrollView contentContainerStyle={styles.scroll}>
			<SafeAreaView style={styles.textContainer}>
			<Text style={styles.textBold}>{json.userEmail}</Text>
			{!!json.cashBalance && <Text style={styles.text}>Cash Balance: $ {json.cashBalance} USD</Text>}
			{!!json.currentPortfolioValue && <Text style={styles.text}>Portfolio Value: $ {json.currentPortfolioValue} USD</Text>}
			</SafeAreaView>
			{!!json.stockHoldings && json.stockHoldings.map((stock, index) => {
				return ( <TouchableOpacity onPress={() => {displayMore(stock)}} key={stock.stockSymbol} style={{backgroundColor: (checkIndexIsEven(index) ? "#ff8a3c" : "#33A5FF"), 	paddingBottom: 10,	borderRadius: 10, width: 250, alignItems: "center", marginTop: 10	}}>
							<Text style={styles.bold}>{stock.companyName} | {stock.stockSymbol}</Text>
							<Text>Stock Price: {stock.currentPrice.toFixed(2)}</Text>
							<Text>Quantity: {stock.quantity}</Text>
							<Text>Click for more info</Text>
						</TouchableOpacity>
					)
			})}
			</ScrollView>
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
	scroll: {
		marginHorizontal: 0,
		width: "100%",
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
