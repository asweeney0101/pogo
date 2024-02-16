import { useState, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';

const Chat = ({ route, navigation, db, isConnected }) => {
  // props defined in Start Component
  const { userID, background, screenRatio, username } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#90F"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }

  const renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  }

  useEffect(() => {
    navigation.setOptions({ title: username });
  }, []);

  
 
  let unsubMessages;
  useEffect(() => {
    if (isConnected === true) {
      if (unsubMessages) unsubMessages();
      unsubMessages = null;

    
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    unsubMessages = onSnapshot(q, (docSnapshot) => {
      let newMessages = [];
      docSnapshot.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        });
      });
      cachedMessages(newMessages);
      setMessages(newMessages);
    });
  }else loadCachedMessages();

  return () => {
    if (unsubMessages) unsubMessages();
  };
 
  }, [isConnected]);

  //Stores/Caches messages
  const cachedMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("chat_messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  //Loads cached messages
  const loadCachedMessages = async () => {
    const storedMessages = (await AsyncStorage.getItem("chat_messages")) || [];
    setMessages(JSON.parse(storedMessages));
  };

  
  
 return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
  <KeyboardAvoidingView style={[styles.container, { backgroundColor: background }]}>
     <GiftedChat
       renderBubble={renderBubble}
       messages={messages}
       renderInputToolbar={renderInputToolbar}
       onSend={messages => onSend(messages)}
       renderActions={renderCustomActions}
       user={{
         _id: userID,
         username: username
       }}
     />
   
  </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
 );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%'
  },

 });




export default Chat;