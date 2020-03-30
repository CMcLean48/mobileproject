import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import firebase from "../firebase";


export default function Transaction({navigation, route}) {

		  async function getJWT() {
			try {
			  console.log("inside retrive data");
			  let value = await firebase.auth().currentUser.getIdTokenResult()
			  if (value.token !== null) {
				// We have data!!
				console.log(value);
				return value.token;
			  }
			} catch (error) {
			  // Error retrieving data
			  console.error(error);
			}
		  }


      async function getBuy() {
          fetch("https://ssdstockappapi.azurewebsites.net/api/StockTransaction/purchase", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${await getJWT()}`
            },
            body: JSON.stringify({
              StockSymbol: route.params.stock,
              quantity: parseInt(value)
            })
          })
            .then(res => res.json())
            .then(data => {
              console.log(data);
              navigation.navigate("Confirm")
            })
            .catch(error => {
              console.log(error);
            });
      }

      async function getSell() {
          fetch("https://ssdstockappapi.azurewebsites.net/api/StockTransaction/sell", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${await getJWT()}`
            }
          })
            .then(res => res.json())
            .then(data => {
              console.log(data);
              navigation.navigate("Confirm")
            })
            .catch(error => {
              console.log(error);
            });
      }

  const [value, onChangeText] = useState("");

  return (
    <View style={styles.container}>
      <Text>{route.params.stock}</Text>
      <Text>Stock Qty</Text>
				<TextInput

					keyboardType={'numeric'}
					style={{ height: 40, width:40, borderColor: 'gray', borderWidth: 1 }}
					onChangeText={text => onChangeText(text)}
					value={value}
				/>
        <Button title="Buy" onPress={getBuy} />
        <Button title="Sell" onPress={getSell} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
