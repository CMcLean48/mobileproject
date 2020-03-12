import React from 'react';
import { StyleSheet, Text, View , Button} from 'react-native';


export default function Home({ navigation }) {
	return (
		<View style={styles.container}>
			<Button
				title="Register"
				onPress={() => navigation.navigate('Register')}
			/>
			<Button
				title="Login"
				onPress={() => navigation.navigate('Login')}
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
