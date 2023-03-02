import React, { useCallback, useState } from 'react'
import { TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native'
import { Text, View, StyleSheet, Button, ImageBackground } from 'react-native'
import { Feather } from '@expo/vector-icons';

import bgImage from '../assets/images/chat-bg.jpg'
import colors from '../constants/colors';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';

const ChatScreen = props => {

    const [messageText, setMessageText] = useState('')
    console.log('messageText', messageText)

    const sendMessage = useCallback(() => {
        setMessageText('')
    }, [messageText])
    return (
        <SafeAreaView
            edges={['right', 'left', 'bottom']}
            style={styles.container}>
            <KeyboardAvoidingView 
            style={styles.screen}
            behavior={Platform.OS==='ios'?'padding': undefined}
            keyboardVerticalOffset={100}
            >

                <ImageBackground source={bgImage} style={styles.backgroundImage}>

                </ImageBackground>

                <View style={styles.inputContainer}>

                    <TouchableOpacity
                        style={styles.mediaButton}
                        onPress={() => console.log('pressed')}>
                        <Feather name="plus" size={24} color={colors.blue} />
                    </TouchableOpacity>

                    <TextInput
                        onChangeText={text => setMessageText(text)}
                        value={messageText}
                        style={styles.textbox}
                        onSubmitEditing={sendMessage}
                    />

                    {
                        !messageText && <TouchableOpacity
                            style={styles.mediaButton}
                            onPress={() => console.log('pressed')}>
                            <Feather name="camera" size={24} color={colors.blue} />
                        </TouchableOpacity>
                    }
                    {
                        messageText && <TouchableOpacity
                            style={{ ...styles.mediaButton, ...styles.sendButton }}
                            onPress={() => sendMessage()}>
                            <Feather name="send" size={20} color={'white'} />
                        </TouchableOpacity>
                    }

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
        
    },
    screen:{
        flex:1,
    },
    backgroundImage: {
        flex: 1
    },
    inputContainer: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 10,
        height: 50
    },
    textbox: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 25,
        borderColor: colors.lightGrey,
        marginHorizontal: 15,
        paddingHorizontal: 12,
    },
    mediaButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 35,
    },
    sendButton: {
        backgroundColor: colors.blue,
        borderRadius: 50,
        padding: 8,
    },
})


export default ChatScreen




// export  function ChatListScreen(props) {
//   return (
//     <div>ChatListScreen</div>
//   )
// }