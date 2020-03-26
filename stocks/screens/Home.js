import React, { useEffect, useState } from "react";
import { StyleSheet, Text, SafeAreaView, Button } from "react-native";
import { AsyncStorage } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import finnhub from "../api/finnhub";
import SearchBar from "../components/SearchBar";
import ShowList from "../components/ShowList";
import Logout from "../components/Logout";

export default function Home({ navigation }) {
  useEffect(() => {
    searchAPI();
  }, []);

  useFocusEffect(() => {
    retrieveData();
  });

  const API_KEY = "bprd3evrh5r8s3uv7k0g"; //Add HERE your API-Key
  const [stocks, setStocks] = useState([]);
  const [query, setQuery] = useState("");
  const [JWT, setJWT] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  goToPortfolio = () => navigation.navigate("Portfolio");


  retrieveData = async () => {
    try {
      let value = await AsyncStorage.getItem("JWT_TOKEN");
      if (value !== null) {
        // We have data!!
        setJWT(value);
        setLoggedIn(true);
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  const searchAPI = async () => {
    //console.log("CALL");
    const response = await finnhub.get(
      "/stock/symbol?exchange=US&token=" + API_KEY,
      {}
    );
    setStocks(response.data);
  };

  function getData() {
    fetch("https://ssdstockappapi.azurewebsites.net/api/Example/secure", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`
      }
    })
      .then(res => res.json())
      // Data Retrieved.
      .then(data => {
        alert(JSON.stringify(data));
      });
  }

  function getLoggedIn(boolean){
    setLoggedIn(boolean)
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
      <ShowList
        navigation={navigation}
        stocks={stocks.filter(
          stock =>
            stock.symbol.toUpperCase().includes(query.toUpperCase()) ||
            stock.description.toUpperCase().includes(query.toUpperCase())
        )}
      />
      {!loggedIn && <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      /> }
      {!loggedIn && (
        <Button title="Login" onPress={() => navigation.navigate("Login")} />
      )}
      {loggedIn && <Button title="Get Secure Data" onPress={() => getData()} />}
      {loggedIn && <Logout getLoggedIn={getLoggedIn}/>}
      {loggedIn && <Button title="Portfolio" onPress={() => goToPortfolio()} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
