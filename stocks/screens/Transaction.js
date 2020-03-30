import React, {useState} from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

export default function Transaction({navigation, route}) {

  const [value, onChangeText] = useState("");

  return (
    <View style={styles.container}>
      <Text>{route.params.stock}</Text>
      <Text>Buy Stock Qty</Text>
				<TextInput

					keyboardType={'numeric'}
					style={{ height: 40, width:40, borderColor: 'gray', borderWidth: 1 }}
					onChangeText={text => onChangeText(text)}
					value={value}
				/>
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
