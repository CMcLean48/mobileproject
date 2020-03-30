import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import firebase from '../firebase';

export default function Transaction({ navigation, route }) {

  const [value, onChangeText] = useState('');
  const [balanceValue, onChangeBalanceText] = useState('');

	async function getJWT() {
		try {
			console.log('inside retrive data');
			let value = await firebase.auth().currentUser.getIdTokenResult();
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
		fetch(
			'https://ssdstockappapi.azurewebsites.net/api/StockTransaction/purchase',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${await getJWT()}`
				},
				body: JSON.stringify({
					StockSymbol: route.params.stock,
					quantity: parseInt(value)
				})
			}
		)
			.then(res => res.json())
			.then(data => {
				console.log(data.stockSymbol);
				if (!data.message) {
					navigation.navigate('Confirm');
				}
			})
			.catch(error => {
				console.log(error);
			});
	}

	async function getSell() {
		console.log(value);
		fetch(
			'https://ssdstockappapi.azurewebsites.net/api/StockTransaction/sell',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${await getJWT()}`
				},
				body: JSON.stringify({
					StockSymbol: route.params.stock,
					quantity: -parseInt(value)
				})
			}
		)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if (!data.message) {
					navigation.navigate('Confirm');
				}
			})
			.catch(error => {
				console.log(error);
			});
	}

	async function addBalance() {
		console.log(balanceValue);
		fetch(
			'https://ssdstockappapi.azurewebsites.net/api/User/updatebalance',
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${await getJWT()}`
				},
				body: JSON.stringify({
					depositWithdrawAmount: parseInt(balanceValue)
				})
			}
		)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if (!data.message) {
					navigation.navigate('Confirm');
				}
			})
			.catch(error => {
				console.log(error);
			});
	}


	return (
		<View style={styles.container}>
			<Text>{route.params.stock}</Text>
			<Text>Stock Qty</Text>
			<TextInput
				keyboardType={'numeric'}
				style={{
					height: 40,
					width: 40,
					borderColor: 'gray',
					borderWidth: 1
				}}
				onChangeText={text => onChangeText(text)}
				value={value}
			/>
			<Button title="Buy" onPress={getBuy} />
			<Button title="Sell" onPress={getSell} />

			<Text>Add to Balance</Text>
			<TextInput
				keyboardType={'numeric'}
				style={{
					height: 40,
					width: 140,
					borderColor: 'gray',
					borderWidth: 1
				}}
				onChangeText={text => onChangeBalanceText(text)}
				value={balanceValue}
			/>
			<Button title="add to balance" onPress={addBalance} />

			<Button
				color="#33A5FF"
				title="Go To Portfolio"
				onPress={() => navigation.navigate('Portfolio')}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		alignItems: 'center',
	}
});
