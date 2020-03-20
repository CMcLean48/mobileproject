import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Register from './screens/Register';
import Login from './screens/Login';
import Portfolio from './screens/Portfolio';

const Stack = createStackNavigator();

const App = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator>
				<Stack.Screen name="Stocks" component={Home} />
					<Stack.Screen name="Register" component={Register} />
					<Stack.Screen name="Login" component={Login} />
					<Stack.Screen name="Portfolio" component = {Portfolio}/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
