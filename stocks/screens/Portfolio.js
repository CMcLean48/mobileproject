import React, {useState} from 'react';
import { StyleSheet, Text, SafeAreaView, Button } from 'react-native';
import firebase from '../firebase';
import { useFocusEffect } from "@react-navigation/native";
import { AsyncStorage } from "react-native";



export default function Portfolio({ navigation }) {

	useFocusEffect(
		React.useCallback(() => {
		  let isActive = true;

		  getData(isActive);

		  return () => {
			isActive = false;
		  };
		}, [])
	  );

	const [JWT, setJWT] = useState("")

	async function getJWT() {
		try {
			console.log("inside retrive data");
			let value = await AsyncStorage.getItem("JWT_TOKEN");
			if (value !== null) {
			  // We have data!!
			  setJWT(value)
			  console.log(value)
		  	}
		  } catch (error) {
			// Error retrieving data
			console.error(error)
		  }
		}

	async function getData(isActive) {
		if(isActive){
		getJWT().then(() => {
		fetch("https://ssdstockappapi.azurewebsites.net/api/Portfolio", {
		  method: "GET",
		  headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			Authorization: `Bearer ${JWT}`
		  }
		})
		  .then(res => { res.json(); })
		  // Data Retrieved.
		  .then(data => {
			alert(data);
		  })
		  .catch((error) => {
			console.error('Error:', error);
		  });
		})
	}
	  }



	//console.log(user);

	return (
		<>
			<Text>Portfolio</Text>
		</>
	);
}
