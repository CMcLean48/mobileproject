import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  Button,
  AsyncStorage,
  TouchableOpacity,
  VirtualizedList
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function WatchList({ navigation }) {
  const [watchList, setWatchList] = useState([]);
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      async function getJWT() {
        try {
          let value = await AsyncStorage.getItem("JWT_TOKEN");
          if (value !== null) return value;
        } catch (error) {
          console.log(error);
        }
      }

      async function getWatchList(isActive) {
        if (isActive) {
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
              console.log(err);
            });
        }
      }

      getWatchList(isActive);
      return () => {
        isActive = false;
      };
    }, [])
  );
  return (
    <SafeAreaView>
      <Text>Your Watch List</Text>
      <VirtualizedList
        windowSize={10}
        data={watchList}
        initialNumberToRender={20}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Stock Detail", { stock: item.stockSymbol })
            }
          >
            <Text style={styles.cell}>
              [{item.stockSymbol}] {item.companyName}
            </Text>
          </TouchableOpacity>
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
  cell: {
    margin: 10,
    fontSize: 16,
    fontWeight: "bold"
  }
});
