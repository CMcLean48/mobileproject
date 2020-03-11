import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FormGenerator from './Register';

export default function Home({ navigation }) {
	return (
		<View style={styles.container}>
			<Button
				title="register"
				onPress={() => navigation.navigate('Register')}
			/>
			<Text>Open up App.js to start working on your app!!</Text>
		</View>
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
