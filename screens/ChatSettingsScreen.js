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
import { removeUserFromChat, updateChatData } from '../utils/actions/chatActions'
import { validateInput } from '../utils/actions/formActions'
import colors from '../constants/colors'
import SubmitButton from '../components/SubmitButton'
import DataItem from '../components/DataItem'


const ChatSettingsScreen = props => {

    const [isLoading, setIsLoading] = useState(false)
    const [showSuccessMessagge, setShowSuccessMessagge] = useState(false)

    const chatId = props.route.params.chatId
    const chatData = useSelector(state => state.chats.chatsData[chatId]||{})
    const userData = useSelector(state => state.auth.userData)
    const storedUsers = useSelector(state => state.users.storedUsers)

    const initialState = {
        inputValues: { chatName: chatData.chatName },
        inputValidities: { chatName: undefined },
        formIsValid: false
    }

    const [formState, dispatchFormState] = useReducer(reducer, initialState);
    console.log(formState.formIsValid);

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
if(!chatData.users) return null

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
                    />

                    {
                        chatData.users.map(uid => {
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