import React from 'react'
import { Text, View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { useSelector } from 'react-redux'
import PageContainer from '../components/PageContainer'
import { useReducer } from 'react'
import { useCallback } from 'react'
import { useState } from 'react'

import PageTitle from '../components/pageTitle'
import ProfileImage from '../components/ProfileImage'
import Input from '../components/Input'
import { reducer } from '../utils/reducers/formReducer'
import { addUsersToChat, removeUserFromChat, updateChatData } from '../utils/actions/chatActions'
import { validateInput } from '../utils/actions/formActions'
import colors from '../constants/colors'
import SubmitButton from '../components/SubmitButton'
import DataItem from '../components/DataItem'
import { useEffect } from 'react'


const ChatSettingsScreen = props => {

    const [isLoading, setIsLoading] = useState(false)
    const [showSuccessMessagge, setShowSuccessMessagge] = useState(false)

    const chatId = props.route.params.chatId
    const chatData = useSelector(state => state.chats.chatsData[chatId] || {})
    const userData = useSelector(state => state.auth.userData)
    const storedUsers = useSelector(state => state.users.storedUsers)
    const starredMessages = useSelector(state => state.messages.starredMessages[chatId] ?? {})


    const initialState = {
        inputValues: { chatName: chatData.chatName },
        inputValidities: { chatName: undefined },
        formIsValid: false
    }
    selectedUsers
    const [formState, dispatchFormState] = useReducer(reducer, initialState);

    const selectedUsers = props.route.params && props.route.params.selectedUsers
    useEffect(() => {
        if (!selectedUsers) return

        const selectedUsersData = []
        selectedUsers.forEach(uid => {
            if (uid === userData.userId) return
            if (!storedUsers[uid]) {
                console.log('No user data found in the data store')
                return
            }
            selectedUsersData.push(storedUsers[uid])
        })
        addUsersToChat(userData, selectedUsersData, chatData)
    }, [selectedUsers])

    const inputChangedHandler = useCallback((inputId, inputValue) => {
        const result = validateInput(inputId, inputValue);
        dispatchFormState({ inputId, validationResult: result, inputValue })
    }, [dispatchFormState]);

    const saveHandler = useCallback(async () => {
        const updatedValues = formState.inputValues

        try {
            setIsLoading(true)
            await updateChatData(chatId, userData.userId, updatedValues)

            setShowSuccessMessagge(true)
            setTimeout(() => {
                setShowSuccessMessagge(false)
            }, 1500);

        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false)
        }
    }, [formState])

    const hasChanges = () => {
        const currentValues = formState.inputValues
        return currentValues.chatName !== chatData.chatName
    }

    const leaveChat = useCallback(async () => {
        try {
            setIsLoading(true)
            await removeUserFromChat(userData, userData, chatData)
            props.navigation.popToTop()
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    },
        [props.navigation, isLoading],
    )
    if (!chatData.users) return null

    return (
        <PageContainer>
            <PageTitle text='Chat Settings' />
            <ScrollView contentContainerStyle={styles.scrollView}>

                <ProfileImage
                    showEditButton={true}
                    size={80}
                    chatId={chatId}
                    userId={userData.userId}
                    uri={chatData.chatImage}
                />
                <Input
                    id='chatName'
                    label='Chat name'
                    auroCapitalize='none'
                    initialValue={chatData.chatName}
                    allowEmpty={false}
                    onInputChanged={inputChangedHandler}
                    errorText={formState.inputValidities['chatName']}
                />
                <View style={styles.sectionContainer}>
                    <Text style={styles.heading}>{chatData.users.length} participants</Text>
                    <DataItem
                        title='Add user'
                        icon='plus'
                        type='button'
                        onPress={() => props.navigation.navigate('NewChat', { isGroupChat: true, existingUsers: chatData.users, chatId })}
                    />

                    {
                        chatData.users.slice(0, 4).map(uid => {
                            const currnetUser = storedUsers[uid]
                            return <DataItem
                                key={uid}
                                image={currnetUser.profilePicture}
                                title={`${currnetUser.firstName} ${currnetUser.lastName}`}
                                subtitle={currnetUser.about}
                                type={uid !== userData.userId && 'link'}
                                onPress={() => uid !== userData.userId && props.navigation.navigate('Contact', { uid, chatId })}
                            />
                        })
                    }
                    {/* TODO:change the condition to -- >4 -- the current is for development */}
                    {
                        chatData.users.length > 2 &&
                        <DataItem
                            type='link'
                            title='View all'
                            hideImage={true}
                            onPress={() => props.navigation.navigate('DataList', { title: 'Participants', data: chatData.users, type: 'users', chatId })}
                        />
                    }
                </View>


                {showSuccessMessagge && <Text>Saved!</Text>}

                {
                    isLoading ?
                        <ActivityIndicator
                            size={'small'}
                            color={colors.primary}
                        /> :

                        hasChanges() && <SubmitButton
                            title='Save changes'
                            colors={colors.primary}
                            onPress={saveHandler}
                            disabled={!formState.formIsValid}
                        />
                }
                <DataItem
                    type='link'
                    title='Starred messages'
                    hideImage={true}
                    onPress={() => props.navigation.navigate('DataList', { title: 'Starred messages', data: Object.values(starredMessages), type: 'messages' })}
                />
            </ScrollView>


            {
                <SubmitButton
                    title='Leave chat'
                    color={colors.red}
                    onPress={() => leaveChat()}
                    style={{ marginBottom: 20 }}
                />
            }

        </PageContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionContainer: {
        width: '100%',
        marginTop: 10,

    },
    heading: {
        marginVertical: 8,
        color: colors.textColor,
        fontFamily: 'bold',
        letterSpacing: 0.4,
    },


})


export default ChatSettingsScreen




// export  function ChatSettingsScreen(props) {
//   return (
//     <div>ChatSettingsScreen</div>
//   )
// }