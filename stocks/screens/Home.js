import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import finnhub from '../api/finnhub';

const Home = () => {
  //const baseURL = 'https://finnhub.io/api/v1';
  const [stocks, setStocks] = useState([]);

  const searchAPI = async () => {
    const response = await finnhub.get('/stock/symbol?exchange=US&token=bpkirnfrh5rcgrlrakt0', {});
    setStocks(response.data);
    console.log("+++++++++++++++++++");
    console.log(response.data);
  }

  useEffect(()=>{searchAPI()},[]);

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;