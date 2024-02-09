import Start from './components/Start';
import Chat from './components/Chat';

import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';
import { getFirestore, disableNetwork, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
const Stack = createNativeStackNavigator();

const App = () => {

  const firebaseConfig = {
    apiKey: "AIzaSyCgqbVXJRRESGfAUQGetl7oeveL79QJFwE",
    authDomain: "pogo-chat-ajs-db.firebaseapp.com",
    projectId: "pogo-chat-ajs-db",
    storageBucket: "pogo-chat-ajs-db.appspot.com",
    messagingSenderId: "1045824084311",
    appId: "1:1045824084311:web:a7ef72328233be9034c612",
    measurementId: "G-XTEWXMF001"
  };
  
	const connectionStatus = useNetInfo();

	useEffect(() => {
		if (connectionStatus.isConnected === false) {
			Alert.alert('Connection Lost!');
			disableNetwork(db);
		} else if (connectionStatus.isConnected === true) {
			enableNetwork(db);
		}
	}, [connectionStatus.isConnected]);

	const app = initializeApp(firebaseConfig);
	const db = getFirestore(app);
	const storage = getStorage(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Start'>
        <Stack.Screen
          name='Start'
          component={Start}
        />
        
        <Stack.Screen name="Chat">
          {(props) => 
           <Chat isConnected={connectionStatus.isConnected} db={db} storage={storage} {...props} />
           }
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;