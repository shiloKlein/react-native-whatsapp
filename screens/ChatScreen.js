import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Image, TextInput, TouchableOpacity } from 'react-native'
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
import { createChat, sendImage, sendTextMessage } from '../utils/actions/chatActions';
import { FlatList } from 'react-native-gesture-handler';
import ReplyTo from '../components/ReplyTo';
import { launchImagePicker, openCamera, uploadImageAsync } from '../utils/imagePickerHelper';
import AwesomeAlert from 'react-native-awesome-alerts';
// import CustomHeaderButton from '../components/CustomHeaderButton';

const ChatScreen = (props) => {
    const [chatUsers, setChatUsers] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [chatId, setChatId] = useState(props.route?.params?.chatId);
    const [errorBannerText, setErrorBannerText] = useState("");
    const [replyingTo, setReplyingTo] = useState();
    const [tempImageUri, setTempImageUri] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const flatList = useRef()


    const userData = useSelector(state => state.auth.userData);
    const storedUsers = useSelector(state => state.users.storedUsers);
    const storedChats = useSelector(state => state.chats.chatsData);
    const chatMessages = useSelector(state => {
        if (!chatId) return [];

        const chatMessagesData = state.messages.messagesData[chatId];

        if (!chatMessagesData) return [];

        const messageList = [];
        for (const key in chatMessagesData) {
            const message = chatMessagesData[key];

            messageList.push({
                key,
                ...message
            });
        }

        return messageList;
    });

    const chatData = (chatId && storedChats[chatId]) || props.route?.params?.newChatData;

    const getChatTitleFromName = () => {
      const otherUserId = chatUsers.find(uid => uid !== userData.userId);
      const otherUserData = storedUsers[otherUserId];
  
      return otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`;
    }
  
    const title = chatData.chatName ?? getChatTitleFromName();
  
    useEffect(() => {
      props.navigation.setOptions({
        headerTitle: title
      })
      setChatUsers(chatData.users)
    }, [chatUsers])

    const sendMessage = useCallback(async () => {
        // TODO: something wrong with the setchatid and asynchronous behavior, the chatId is not updated on time for the send message func.
        try {
            let id = chatId;
            if (!chatId) {
                // No chat Id. Create the chat
                id = await createChat(userData.userId, props.route.params.newChatData)
                setChatId(id)
            }
            await sendTextMessage(id, userData.userId, messageText, replyingTo && replyingTo.key);
            setMessageText("");
            setReplyingTo(null);
        } catch (error) {
            console.log('error', error);
            setErrorBannerText("Message failed to send");
            setTimeout(() => setErrorBannerText(""), 5000);
        }
    }, [messageText, chatId]);


    const pickImage = useCallback(async () => {
        try {
            const tempUri = await launchImagePicker();
            if (!tempUri) return;

            setTempImageUri(tempUri);
        } catch (error) {
            console.log(error);
        }
    }, [tempImageUri])

    const takePhoto = useCallback(async () => {
        try {
            const tempUri = await openCamera();
            if (!tempUri) return;

            setTempImageUri(tempUri);
        } catch (error) {
            console.log(error);
        }
    }, [tempImageUri]);

    const uploadImage = useCallback(async () => {
        setIsLoading(true);

        try {
            let id = chatId;
            if (!id) {
                // No chat Id. Create the chat
                id = await createChat(userData.userId, props.route.params.newChatData);
                setChatId(id);
            }

            const uploadUrl = await uploadImageAsync(tempImageUri, true);
            setIsLoading(false);

            await sendImage(id, userData.userId, uploadUrl, replyingTo && replyingTo.key)

            setReplyingTo(null)
            setTimeout(() => setTempImageUri(""), 200)
        } catch (error) {
            console.log(error);

        }
    }, [isLoading, tempImageUri])

    return (
        <SafeAreaView
            edges={['right', 'left', 'bottom']}
            style={styles.container}>


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
                            ref={(ref) => flatList.current = ref}
                            onContentSizeChange={() => flatList.current.scrollToEnd({ animated: false })}
                            onLayout={() => flatList.current.scrollToEnd({ animated: false })}
                            data={chatMessages}
                            renderItem={(itemData) => {
                                const message = itemData.item
                                const isownMessage = message.sentBy === userData.userId

                                const messageType = isownMessage ? 'myMessage' : 'theirMessage'
                                const sender = message.sentBy && storedUsers[message.sentBy];
                                const name = sender && `${sender.firstName} ${sender.lastName}`;
                                return <Bubble
                                    type={messageType}
                                    text={message.text}
                                    messageId={message.key}
                                    userId={userData.userId}
                                    chatId={chatId}
                                    date={message.sentAt}
                                    name={!chatData.isGroupChat || isownMessage ? undefined : name}
                                    setReply={() => setReplyingTo(message)}
                                    replyingTo={message.replyTo && chatMessages.find(m => m.key === message.replyTo)}
                                    imageUrl={message.imageUrl}

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
                    onPress={pickImage}>
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
                        onPress={takePhoto}>
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

                <AwesomeAlert
                    show={tempImageUri !== ''}
                    title='Send image?'
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText='Cancel'
                    confirmText='Send image'
                    confirmButtonColor={colors.primary}
                    titleStyle={styles.popupTitleStyle}
                    onCancelPressed={() => setTempImageUri('')}
                    onConfirmPressed={uploadImage}
                    onDismiss={() => setTempImageUri('')}
                    customView={(
                        <View>
                            {
                                isLoading &&
                                <ActivityIndicator size='small' color={colors.primary} />
                            }
                            {
                                !isLoading && tempImageUri &&
                                <Image source={{ uri: tempImageUri }} style={{ width: 200, height: 200 }} />
                            }
                        </View>
                    )}
                />

            </View>

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
    popupTitleStyle: {
        fontFamily: 'medium',
        letterSpacing: 0.4,
        color: colors.textColor

    },
})


export default ChatScreen




// export  function ChatListScreen(props) {
//   return (
//     <div>ChatListScreen</div>
//   )
// }