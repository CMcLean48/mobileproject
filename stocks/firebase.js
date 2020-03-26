import firebase from 'firebase';
//import { FIREBASE_API_KEY } from 'react-native-dotenv';

// Initialize Firebase
const firebaseConfig = {
	apiKey: 'AIzaSyCvjnQptS7-QpYuMZnazQnDdSoSLIRgVfM',
	authDomain: 'ssdstocksapp.firebaseapp.com',
	projectId: 'ssdstocksapp',
	appId: '1:789669492893:web:2c62ebb507cf2121abbc74'
};

firebase.initializeApp(firebaseConfig);

export default firebase;
