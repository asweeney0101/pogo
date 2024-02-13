import { StyleSheet, LogBox, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  enableNetwork,
  disableNetwork,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from "react";

//import the screens
import Start from "./components/Start";
import Chat from "./components/Chat";

//create the navigator
const Stack = createNativeStackNavigator();
LogBox.ignoreLogs(["AsyncStorage has been extracted from", "@firebase/auth"]);

export default function App() {
  // Used to check if app is online or offline
  const connectionStatus = useNetInfo();
console.log(connectionStatus)
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  //Database authentication
  const firebaseConfig = {
    apiKey: "AIzaSyCgqbVXJRRESGfAUQGetl7oeveL79QJFwE",
    authDomain: "pogo-chat-ajs-db.firebaseapp.com",
    projectId: "pogo-chat-ajs-db",
    storageBucket: "pogo-chat-ajs-db.appspot.com",
    messagingSenderId: "1045824084311",
    appId: "1:1045824084311:web:a7ef72328233be9034c612",
    measurementId: "G-XTEWXMF001"
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});