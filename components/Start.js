import { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, TouchableOpacity, TextInput, Keyboard, 
  TouchableWithoutFeedback, Dimensions, KeyboardAvoidingView, Platform, Alert } from 'react-native';

import { getAuth, signInAnonymously } from "firebase/auth";

import Icon from 'react-native-vector-icons/FontAwesome';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

// styles using screenRatio will be using pixel values that would make sense on a ~ 375 x 667 screen
// using a <1 power so large screens aren't scaled up as aggressively
const screenRatio = Math.pow((screenHeight + screenWidth)/1000, .8);

const Start = ({ navigation }) => {

  const auth = getAuth();
  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        if (result.user) {
          navigation.navigate("Chat", {
            userID: result.user.uid,
            username: username,
            screenRatio: screenRatio, 
            background: background,
          });
          Alert.alert("Signed In Successfully!");
        } else {
          Alert.alert("Authentication failed.");
        }
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try again later.");
      });
  };

  const [username, setUsername] = useState('');
  const colors = ['#090C08', '#8A95A5', '#B9C6AE', '#474056'];
  const [background, setBackground] = useState(colors[0]);



  
  return (
    // allow the keyboard to be dismissed, and squish the sreen so the keyboard doesn't block
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={styles.body}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

    <ImageBackground source={require('../assets/BackgroundImage.png')} style={styles.body}>

        <Text style={styles.startTitle}>Pogo Chat</Text>


        <View style={styles.startContainer}>

          <View style={styles.nameInputContainer}>
          <Icon style={styles.usernameIcon} name="user" size={screenRatio*20} color={background} />
              <TextInput
                style={styles.usernameInput}
                onChangeText={setUsername}
                placeholder='Your Name'
              />
          </View>    
             
          <View>
            <Text style={styles.chooseBackgroundText}>Choose Background Color: </Text>
            <View style={styles.colorChoiceContainer}>
            {colors.map((color, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.colorChoice, 
                  { backgroundColor: color },
                  background === color && styles.selectedColor
                ]} 
                onPress={() => setBackground(color)}
                >
                  {/* Render the inner circle with a white border on the selected color */}
                  {background === color && (
                    <View style={[styles.innerCircle, { backgroundColor: color }]} />
                  )}
              </TouchableOpacity>
            ))}
            </View>
          </View>   

          <TouchableOpacity
            style={[styles.startChatButton,{ backgroundColor: background }]}
            onPress={signInUser}>
            <Text style={styles.startChatText}>Start Chatting!</Text>
          </TouchableOpacity>

        </View>

    </ImageBackground> 
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

  );
};


const styles = StyleSheet.create({
  body: { 
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%'
  },
  startTitle:{
    fontSize: 45 * screenRatio,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: '25%'
  },
  startContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    justifyContent: 'space-between',
    height: '44%',
    width: '88%', 
    borderRadius: screenRatio * 8,
    backgroundColor: '#FFFFFF',
    marginBottom: '6%', 
    borderWidth: screenRatio * 1    
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '88%',
    borderRadius: screenRatio * 5,    
    height: screenHeight * 0.06,
    borderWidth: screenRatio * 1,
    padding: '2%',
    marginTop: '6%',
  },
  usernameIcon: {
    marginLeft: screenRatio * 5,
    marginRight: screenRatio * 10
  },
  usernameInput: {
    width: '100%', 
    fontSize: screenRatio * 16
  },
  chooseBackgroundText: {
    fontSize: screenRatio * 16,
  },
  colorChoiceContainer: {
    flexDirection: 'row',
    marginTop: '1%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  colorChoice: {
    width: screenRatio * 30,
    height: screenRatio * 30,
    borderRadius: screenRatio * 15,
    margin: '2%'    
  },
  selectedColor: {
    width: screenRatio * 34,
    height: screenRatio * 34,
    borderRadius: screenRatio * 17,
    margin: '2%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: screenRatio * 30,
    height: screenRatio * 30,
    borderRadius: screenRatio * 15,
    borderWidth: screenRatio * 1.5,
    borderColor: '#FFF',
    alignSelf: 'center',
  },
  startChatButton: {
    width: '88%',
    height: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    borderRadius: screenRatio * 5,
    marginBottom: '6%'
  },
  startChatText: {
    fontSize: screenRatio * 16,
    color: '#FFFFFF',
    fontWeight: '600'
  }
});



 
export default Start;