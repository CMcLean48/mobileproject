import React from "react";
import { StyleSheet, Text, SafeAreaView, Button } from 'react-native';
import firebase from '../firebase';

const Logout = ({}) => {
    

    function signOutUser (){
    firebase.auth().signOut().then(function () {
        console.log("signed out")
    }).catch(function (error) {
        // An error happened.
    });
}
	return (
		<Button
        title = "Logout"
			onPress={() => signOutUser()}
		/>
	);
};
export default Logout;
