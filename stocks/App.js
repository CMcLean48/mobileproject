import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home  from './screens/Home';
import Register from './screens/Register';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Stocks" component={Home} />
        <Stack.Screen name="Register" component = {Register}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;