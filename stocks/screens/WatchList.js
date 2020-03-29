import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Button,
  View,
  AsyncStorage,
  TouchableOpacity,
  VirtualizedList
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function WatchList({ navigation }) {
  const [watchList, setWatchList] = useState([]);
  const [refreshScreen, setRefreshScreen] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getWatchList();
    }, [refreshScreen])
  );

  async function getJWT() {
    try {
      let value = await AsyncStorage.getItem("JWT_TOKEN");
      if (value !== null) return value;
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
        //console.log(data.stocks);
      })
      .catch(err => {
        //alert(err.message);
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

  return (
    <SafeAreaView>
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
              <Text style={styles.deleteButton}> [X] </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Stock Detail", {
                  stock: item.stockSymbol
                })
              }
            >
              <Text style={styles.cell}>
                [{item.stockSymbol}] {item.companyName}
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
    color: "red",
    fontWeight: "bold",
    fontSize: 23
  }
});
