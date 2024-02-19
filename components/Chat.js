import { useState, useEffect } from 'react';
import { StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Image, TouchableOpacity, Text } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  // props defined in Start Component
  const { userID, background, screenRatio, username } = route.params;
  const [messages, setMessages] = useState([]);
  const [draftImageUri, setDraftImageUri] = useState(null);

  const handleDraft = (uri) => {
    setDraftImageUri(uri);
  };

  const removeDraftImage = () => {
    setDraftImageUri(null);
  };

  const renderDraftPreview = () => {
    if (draftImageUri) {
      return (
        <TouchableOpacity onPress={removeDraftImage} style={styles.draftPreviewContainer}>
          <Image source={{ uri: draftImageUri }} style={styles.draftPreviewImage} />
          <Text style={styles.removeDraftButtonText}>X</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const onSend = (newMessages) => {
    if (draftImageUri) {
      const messageWithImage = {
        ...newMessages[0],
        image: draftImageUri, 
      };
      addDoc(collection(db, "messages"), messageWithImage);
      setDraftImageUri(null);
    } else {
      addDoc(collection(db, "messages"), newMessages[0]);
    }
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

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null;
  }
 
  let unsubMessages;
  
  useEffect(() => {
    navigation.setOptions({ title: username });

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

  const renderCustomActions = (props) => {
    return <CustomActions onDraft={handleDraft} userID={userID} storage={storage} {...props} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage} = props;
    if (currentMessage.location) {
      return (
          <MapView
            style={{width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3}}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
      );
    }
    return null;
  }


  
 return (
<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} style={styles.container}>
      <KeyboardAvoidingView style={[styles.container, { backgroundColor: background }]} behavior="padding">
        {renderDraftPreview()} 
     <GiftedChat
       renderBubble={renderBubble}
       messages={messages}
       renderInputToolbar={renderInputToolbar}
       onSend={messages => onSend(messages)}
       renderActions={renderCustomActions}
       renderCustomView={renderCustomView}
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
  draftPreviewContainer: {
    position: 'absolute',
    bottom: 100, 
    right: 10,
    zIndex: 10, // Ensure it's above other elements
    alignItems: 'center',
    justifyContent: 'center',
  },
  draftPreviewImage: {
    width: 100, 
    height: 100,
    borderRadius: 10, 
  },
  removeDraftButtonText: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'red',
    color: 'white',
    paddingHorizontal: 5,
    borderRadius: 15,
  }

 });




export default Chat;