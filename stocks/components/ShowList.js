import React, { useEffect, useState } from "react";
import {Text, VirtualizedList, StyleSheet} from "react-native";

const ShowList = ({ stocks }) => {
    return (
        <VirtualizedList
        windowSize={10}
        data={stocks}
        initialNumberToRender={20}
        renderItem={({ item }) => (
          <Text style={styles.cell}>
            [{item.symbol}] {item.description}
          </Text>
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

export default ShowList;
