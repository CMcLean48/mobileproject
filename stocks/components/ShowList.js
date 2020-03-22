import React, { Fragment, navigation } from "react";
import { Text, VirtualizedList, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function ShowList({ navigation, stocks }) {
  // const showDetail = ({ navigation, symbol }) => {
  // 	// console.log(symbol);
  // 	navigation.navigate('Detail', symbol);
  // };

  function showDetail(symbol) {
    alert(symbol);

    //Navigate to Stock Detail w/ Params
    navigation.navigate("Stock Detail", { stock: symbol });
  }

  return (
    <VirtualizedList
      windowSize={10}
      data={stocks}
      initialNumberToRender={20}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => showDetail(item.symbol)}>
          <Text style={styles.cell}>
            [{item.symbol}] {item.description}
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
  );
}

const styles = StyleSheet.create({
  cell: {
    margin: 10,
    fontSize: 16,
    fontWeight: "bold"
  }
});
