import React, { useCallback, useEffect, useState } from 'react'
import { TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native'
import { Text, View, StyleSheet, Button, ImageBackground } from 'react-native'
import { Feather } from '@expo/vector-icons';
// import { HeaderButtons, Item } from 'react-navigation-header-buttons'

import bgImage from '../assets/images/chat-bg.jpg'
import colors from '../constants/colors';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { HeaderButtons } from 'react-navigation-header-buttons';
import PageContainer from '../components/PageContainer';
import Bubble from '../components/Bubble';
import { createChat, sendTextMessage } from '../utils/actions/chatActions';
import { FlatList } from 'react-native-gesture-handler';
import ReplyTo from '../components/ReplyTo';
// import CustomHeaderButton from '../components/CustomHeaderButton';

const ChatScreen = (props) => {
    const [chatUsers, setChatUsers] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [chatId, setChatId] = useState(props.route?.params?.chatId);
    const [errorBannerText, setErrorBannerText] = useState('');
    const [replyingTo, setReplyingTo] = useState()


    const userData = useSelector(state => state.auth.userData);
    const storedUsers = useSelector(state => state.users.storedUsers);
    const storedChats = useSelector(state => state.chats.chatsData);
    const chatMessages = useSelector(state => {
        if (!chatId) return []
        const chatsMessagesData = state.messages.messagesData[chatId]
        if (!chatsMessagesData) return []
        const messageList = []
        for (const key in chatsMessagesData) {
            const message = chatsMessagesData[key]
            messageList.push({ key, ...message })
        }
        return messageList
    });


    const chatData = (chatId && storedChats[chatId]) || props.route?.params?.newChatData;

    const getChatTitleFromName = () => {
        // console.log('chatUsers', chatUsers)
        const otherUserId = chatUsers.find(uid => uid !== userData.userId)
        const otherUserData = storedUsers[otherUserId]
        return otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`
    }

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: getChatTitleFromName()
        })
        setChatUsers(chatData.users)
    }, [chatUsers])

    const sendMessage = useCallback(async () => {
        try {
            let id = chatId
            if (!id) {
                // no chat id create chat
                id = await createChat(userData.userId, props.route.params.newChatData)
                setChatId(id)
            }
            await sendTextMessage(chatId, userData.userId, messageText, replyingTo?.key)
            setMessageText('')
            setReplyingTo(null)
        } catch (err) {
            console.log('error in sendMessage function in chatScreen component', err)
            setErrorBannerText('Message failed to send')
            setTimeout(() => setErrorBannerText(''), 5000);
        }
    }, [messageText, chatId])

    return (
        <SafeAreaView
            edges={['right', 'left', 'bottom']}
            style={styles.container}>
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={100}
            >

                <ImageBackground source={bgImage} style={styles.backgroundImage}>

                    <PageContainer style={{ backgroundColor: 'transparent' }}>
                        {
                            !chatId && <Bubble text={'This is a new chat say hi'} type='system' />
                        }

                        {
                            errorBannerText && <Bubble text={errorBannerText} type={'error'} />
                        }
                        {
                            chatId &&
                            <FlatList
                                data={chatMessages}
                                renderItem={(itemData) => {
                                    const message = itemData.item
                                    const isownMessage = message.sentBy === userData.userId

                                    const messageType = isownMessage ? 'myMessage' : 'theirMessage'
                                    return <Bubble
                                        type={messageType}
                                        text={message.text}
                                        messageId={message.key}
                                        userId={userData.userId}
                                        chatId={chatId}
                                        date={message.sentAt}
                                        setReply={() => setReplyingTo(message)}
                                        replyingTo={message.replyTo && chatMessages.find(m => m.key === message.replyTo)}

                                    />
                                }}
                            />
                        }
                    </PageContainer>
                    {
                        replyingTo && <ReplyTo
                            text={replyingTo.text}
                            user={storedUsers[replyingTo.sentBy]}
                            onCancel={() => setReplyingTo(null)}
                        />
                    }
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
    screen: {
        flex: 1,
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