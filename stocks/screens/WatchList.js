import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  AsyncStorage,
  TouchableOpacity,
  VirtualizedList
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useFocusEffect } from "@react-navigation/native";
import firebase from "../firebase";

export default function WatchList({ navigation }) {
  const [watchList, setWatchList] = useState([]);
  const [refreshScreen, setRefreshScreen] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getWatchList();
      setRefreshScreen(false);
    }, [refreshScreen])
  );

  async function getJWT() {
    try {
      //let value = await AsyncStorage.getItem("JWT_TOKEN");
      let value = await firebase.auth().currentUser.getIdTokenResult();
      if (value.token !== null) return value.token;
    } catch (error) {
      console.log(error);
    }
  }

  async function getWatchList() {
    fetch("https://ssdstockappapi.azurewebsites.net/api/WatchList", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${await getJWT()}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setWatchList(data.stocks);
      })
      .catch(err => {
        console.log(err);
      });
  }

  async function deleteStockFromList(stockSymbol) {
    fetch("https://ssdstockappapi.azurewebsites.net/api/WatchList", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${await getJWT()}`
      },
      body: JSON.stringify({ stockSymbol: stockSymbol })
    })
      .then(res => {
        if (res.status == 200) {
          alert(stockSymbol + " was deleted from your watch list");
          setRefreshScreen(true);
        } else if (res.status == 401) {
          console.log("response 401");
          alert("Session time expired. Please log in");
        } else {
          var data = res.json();
          if (data.message) {
            alert("Something went wrong: " + data.message);
          }
        }
      })
      .catch(err => {
        //alert(err.message);
        console.log(err);
      });
  }

  function getGrowthPercentage(currentPrice, openPrice) {
    if (currentPrice !== 0) {
      var percent = (((currentPrice - openPrice) / currentPrice) * 100).toFixed(
        2
      );
    } else {
      var percent = 0;
    }
    if (percent >= 0) {
      return <Text style={styles.green}>+{percent}%</Text>;
    }
    return <Text style={styles.red}>{percent}%</Text>;
  }

  return (
    <SafeAreaView>
      <Text>Open price-(O) Current price-(C) Low-(L) High-(H)</Text>
      <VirtualizedList
        windowSize={10}
        data={watchList}
        initialNumberToRender={20}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => {
                deleteStockFromList(item.stockSymbol);
              }}
            >
              {/* <Text style={styles.deleteButton}> [X] </Text> */}
              <Icon name="delete-forever" size={35} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Stock Detail", {
                  stock: item.stockSymbol
                })
              }
            >
              <Text style={styles.cell}>
                [{item.stockSymbol}] {item.companyName} {}(
                {getGrowthPercentage(item.currentPrice, item.openPrice)})
              </Text>
              <Text>
                O:{item.openPrice.toFixed(2)} {"  "}
                C:{item.currentPrice.toFixed(2)} {"  "}
                L:{item.lowPrice.toFixed(2)} {"  "}
                H:{item.highPrice.toFixed(2)} {"  "}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => {
          return item.key;
        }}
        getItem={(stocks, index) => {
          const item = stocks[index];
          return {
            ...item,
            key: `Item${index}${item.id}`
          };
        }}
        сolumnWrapperStyle={{ marginBottom: 26 }}
        numColumns={1}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal={false}
        getItemCount={stocks => stocks.length}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    margin: 7,
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  cell: {
    margin: 10,
    fontSize: 16,
    fontWeight: "bold"
  },
  deleteButton: {
    marginRight: 5,
    color: "red",
    fontWeight: "bold",
    fontSize: 23
  },
  red: {
    color: "red"
  },
  green: {
    color: "green"
  }
});
