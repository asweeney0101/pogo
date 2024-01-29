import { useState, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
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
 
  useEffect(() => {
    navigation.setOptions({ title: username });
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach((doc) => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        });
      });
      setMessages(newMessages);
    });

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, []);
  
  
 return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
  <KeyboardAvoidingView style={[styles.container, { backgroundColor: background }]}>
     <GiftedChat
       renderBubble={renderBubble}
       messages={messages}
       onSend={messages => onSend(messages)}
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