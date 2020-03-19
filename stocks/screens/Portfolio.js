import React from 'react';
import { StyleSheet, Text, SafeAreaView, Button } from 'react-native';
import firebase from '../firebase';
import Logout from '../components/Logout';
import { render } from 'react-dom';

export default function Portfolio({ navigation }) {
	var user = firebase.auth().currentUser;

	console.log(user);
	
	return (
		<>

			<Text>Portfolio</Text>
            <Logout/>
		</>
	);
}
