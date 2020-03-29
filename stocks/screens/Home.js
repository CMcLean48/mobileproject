import React, { useState, useEffect } from "react";
import { StyleSheet, Text, SafeAreaView, Button } from "react-native";
import { AsyncStorage } from "react-native";
import finnhub from "../api/finnhub";
import { useFocusEffect } from '@react-navigation/native';
//import { FINNHUB_API_KEY } from 'react-native-dotenv';
import SearchBar from "../components/SearchBar";
import ShowList from "../components/ShowList";
import Logout from "../components/Logout";

export default function Home({ navigation }) {
  useEffect(() => {
    // the list of exchanges
    getDataFromAPI(["US", "TO", "CN", "V", "NE"]);
  }, []);

  useFocusEffect(    React.useCallback(() => {
    let isActive = true

    const getJWT = async () => {

    try {
      if(isActive){
        // console.log("inside retrive data");
        const value = await AsyncStorage.getItem("JWT_TOKEN");
        if (value !== null) {
          // We have data!!
          console.log('Token Saved as', value);
          setJWT(value);
          setLoggedIn(true);
        }
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  getJWT()

    return () =>{
      isActive = false;
    };

  }, [navigation]));

  const API_KEY = "bprd3evrh5r8s3uv7k0g"; //Add HERE your API-Key
  const [stocks, setStocks] = useState([]);
  const [query, setQuery] = useState("");
  const [JWT, setJWT] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const getDataFromAPI = exchangeCodeArray => {
    var array = [];
    exchangeCodeArray.forEach(async eCode => {
      const response = await searchAPI(eCode);
      array = array.concat(response.data);
      setStocks(array);
      //console.log(stocks.length);
    });
  };

  const searchAPI = async exchangeCode => {
    console.log("CALL");
    return await finnhub.get(
      "/stock/symbol?exchange=" + exchangeCode + "&token=" + API_KEY,
      {}
    );
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

  function getLoggedIn(boolean) {
    setLoggedIn(boolean);
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
      {!loggedIn && (
        <Button
          title="Register"
          onPress={() => navigation.navigate("Register")}
        />
      )}
      {!loggedIn && (
        <Button title="Login" onPress={() => navigation.navigate("Login")} />
      )}
      {loggedIn && <Button title="Get Secure Data" onPress={() => getData()} />}
      {loggedIn && <Logout getLoggedIn={getLoggedIn} />}
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
