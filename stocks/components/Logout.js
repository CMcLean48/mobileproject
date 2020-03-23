import React from "react";
import { StyleSheet, Text, SafeAreaView, Button } from 'react-native';
import firebase from '../firebase';

const Logout = (props) => {


    async function signOutUser (){
    await firebase.auth().signOut().then(function () {
        console.log("signed out")
    }).catch(function (error) {
        // An error happened.
    });
    await clearData;
    props.getLoggedIn(false);
}

clearData = async () => {
    try {
      console.log("inside retrive data");
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
