import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, VirtualizedList } from 'react-native';
import finnhub from '../api/finnhub';

const Home = () => {
  
  const API_KEY = ""; //Add HERE your API-Key

  const [stocks, setStocks] = useState([]);
  const searchAPI = async () => {
    const response = await finnhub.get('/stock/symbol?exchange=US&token=' + API_KEY, {});
    setStocks(response.data);
  }

  useEffect(() => { searchAPI() }, []);

  return (
    <SafeAreaView  style={styles.container}>
    <VirtualizedList
      windowSize={10}
      data={stocks}
      initialNumberToRender={20}
        renderItem={({ item }) => (
          <Text style={styles.cell}>[{item.symbol}] {item.description}</Text>
      )}
      keyExtractor={(item) => {
        return item.key;
      }}
      getItem={(stocks, index) => {
        const item = stocks[index]
        return {
          ...item,
          key: `Item${index}${item.id}`,
        };
      }}
      сolumnWrapperStyle={{ marginBottom: 26 }}
      numColumns={1}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      horizontal={false}
      getItemCount={(stocks) => stocks.length}
    />
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cell: {
    margin: 10,
    fontSize: 16,
    fontWeight: "bold"
  }
});

export default Home;