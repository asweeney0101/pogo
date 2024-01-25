import { useState, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";



const Chat = ({ route }) => {
  // props defined in Start Component
  const { username, background, screenRatio } = route.params;
  
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'This is a system message',
        createdAt: new Date(),
        system: true,
      },
    ]);
  }, []);

  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages))
  }

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
 
  
  
 return (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
  <KeyboardAvoidingView style={[styles.container, { backgroundColor: background }]}>
     <GiftedChat
       renderBubble={renderBubble}
       messages={messages}
       onSend={messages => onSend(messages)}
       user={{
         _id: 1
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