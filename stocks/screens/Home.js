import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Button
} from "react-native";
import finnhub from "../api/finnhub";
import SearchBar from "../components/SearchBar";
import ShowList from "../components/ShowList";

export default function Home({ navigation }) {
  const API_KEY = ""; //Add HERE your API-Key

  const [stocks, setStocks] = useState([]);
  const [query, setQuery] = useState("");

  const searchAPI = async () => {
    //console.log("CALL");
    const response = await finnhub.get(
      "/stock/symbol?exchange=US&token=" + API_KEY,
      {}
    );
    setStocks(response.data);
  };

  useEffect(() => {
    searchAPI();
  }, []);

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
      <Button title="Login" onPress={() => navigation.navigate("Login")} />
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
