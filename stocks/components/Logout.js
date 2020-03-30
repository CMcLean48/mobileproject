import React from "react";
import { StyleSheet, Text, SafeAreaView, Button } from 'react-native';
import firebase from '../firebase';
import { AsyncStorage } from "react-native";


const Logout = (props) => {


    async function signOutUser (){
    await firebase.auth().signOut().then(async function () {
        console.log("signed out")
        await clearData()
        .then(() =>{
        props.getLoggedIn(false)
    }).catch(function (error) {
        // An error happened.
    });

    }
    )
}

const clearData = async () => {
    try {
      console.log("inside clear data");
      await AsyncStorage.removeItem("JWT_TOKEN");
    } catch (error) {
      // Error retrieving data
    }
  };
	return (
		<Button
        title = "Logout"
			onPress={() => signOutUser()}
		/>
	);
};
export default Logout;
