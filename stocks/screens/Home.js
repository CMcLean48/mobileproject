import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Button
} from "react-native";
import {AsyncStorage} from 'react-native'
import finnhub from "../api/finnhub";
import SearchBar from "../components/SearchBar";
import ShowList from "../components/ShowList";
import { getProvidesAudioData } from "expo/build/AR";



export default function Home({ navigation }) {

  useEffect(() => {
    searchAPI();
  }, []);

  useEffect(() => {
    retrieveData();
  }, [navigation])


  const API_KEY = ""; //Add HERE your API-Key
  const [stocks, setStocks] = useState([]);
  const [query, setQuery] = useState("");
  const [JWT, setJWT] = useState("");
  const [loggedIn, setLoggedIn] = useState(false)

  retrieveData = async () => {
    try {
      console.log("inside retrive data")
      const value = await AsyncStorage.getItem('JWT_TOKEN');
      if (value !== null) {
        // We have data!!
        console.log(value);
        setJWT(value)
        setLoggedIn(true)
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  function getData() {
    fetch("https://ssdstockappapi.azurewebsites.net/api/Example/secure", {
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JWT}`
      }
  })
  .then(res => res.json())
  // Data Retrieved.
  .then((data) => {
      alert(JSON.stringify(data));
  })
  }


  return (
    <SafeAreaView style={styles.container}>
      {/* <Text>TEST</Text> */}
      <SearchBar
        query={query}
        onQueryChange={newQuery => {
          setQuery(newQuery);
        }}
      />
      <ShowList stocks={stocks.filter(stock => stock.symbol.toUpperCase().includes(query.toUpperCase()) || 
                                               stock.description.toUpperCase().includes(query.toUpperCase()))} />
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />
      {!loggedIn && <Button title="Login" onPress={() => navigation.navigate("Login")} />}
      {loggedIn && <Button title="Get Secure Data" onPress={() => getData()} />}
    </SafeAreaView>
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
