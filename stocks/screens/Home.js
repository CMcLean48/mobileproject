import React, { useState, useEffect } from "react";
import { StyleSheet, View, SafeAreaView, Button } from "react-native";
import finnhub from "../api/finnhub";
import { useFocusEffect } from "@react-navigation/native";
import SearchBar from "../components/SearchBar";
import ShowList from "../components/ShowList";
import Logout from "../components/Logout";
import firebase from "../firebase";

export default function Home({ navigation }) {
  useEffect(() => {
    // the list of exchanges
    getDataFromAPI(["US", "TO"]);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const getCurrentUser = async () => {
        try {
          let currentUser = await firebase.auth().currentUser;

          if (currentUser != null) {
            setLoggedIn(true);
          } else {
            setLoggedIn(false);
          }
        } catch (error) {
          console.log("Error Checking Logged In User" + error);
        }
      };
      getCurrentUser();

      return () => {
        isActive = false;
      };
    }, [navigation])
  );

  const API_KEY = "bprd3evrh5r8s3uv7k0g"; //Add HERE your API-Key
  const [stocks, setStocks] = useState([]);
  const [query, setQuery] = useState("");
  const [JWT, setJWT] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  function goToPortfolio() {
    navigation.navigate("Portfolio");
  }

  const getDataFromAPI = exchangeCodeArray => {
    var array = [];
    exchangeCodeArray.forEach(async eCode => {
      const response = await searchAPI(eCode);
      array = array.concat(response.data);
      var filteredArray = array.filter(el => el.description != "N/A");
      setStocks(filteredArray);
      //console.log(stocks.length);
    });
  };

  function goToPortfolio() {
    navigation.navigate("Portfolio");
  }

  const searchAPI = async exchangeCode => {
    console.log("CALL");
    return await finnhub.get(
      "/stock/symbol?exchange=" + exchangeCode + "&token=" + API_KEY,
      {}
    );
  };

  function getLoggedIn(boolean) {
    setLoggedIn(boolean);
  }

  return (
    <SafeAreaView style={styles.container}>
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
      <View style={styles.btns}>
        {!loggedIn && (
          <Button
            title="Register"
            onPress={() => navigation.navigate("Register")}
          />
        )}
        {!loggedIn && (
          <Button title="Login" onPress={() => navigation.navigate("Login")} />
        )}
        {loggedIn && (
          <Button title="Portfolio" onPress={() => goToPortfolio()} />
        )}
        {loggedIn && (
          <Button
            color="#33A5FF"
            title="WatchList"
            onPress={() => navigation.navigate("WatchList")}
          />
        )}
        {loggedIn && <Logout getLoggedIn={getLoggedIn} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  btns: {
    flexDirection: "row",
    margin: 10,
    justifyContent: "space-around"
  }
});
