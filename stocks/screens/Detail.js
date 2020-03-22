import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import finnhub from "../api/finnhub";

const API_KEY = ""; //API Key - This should probably be moved to a central file later

export default function Detail({ route, navigation }) {
  const [quote, setQuote] = useState(null);

  const searchAPI = async () => {
    const response = await finnhub
      .get(`/quote?token=${API_KEY}&symbol=${route.params.stock}`)
      .then(response => console.log(response.data));
    // setQuote(response.data);
    // console.log(response);
  };
  useEffect(() => {
    searchAPI();

    //Get Params from Route
    console.log(route.params.stock);
  }, []);
  if (!quote) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
    </View>
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
