import React from 'react'
import { useCallback } from 'react'
import { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import DataItem from '../components/DataItem'

import PageContainer from '../components/PageContainer'
import PageTitle from '../components/pageTitle'
import ProfileImage from '../components/ProfileImage'
import SubmitButton from '../components/SubmitButton'
import colors from '../constants/colors'
import { removeUserFromChat } from '../utils/actions/chatActions'
import { getUserChats } from '../utils/actions/userAction'

const ContactScreen = props => {
    const storedUsers = useSelector(state => state.users.storedUsers)
    const storedChats = useSelector(state => state.chats.chatsData)
    const userData = useSelector(state => state.auth.userData)

    const currentUser = storedUsers[props.route.params.uid]
    const [commonChats, setCommonChats] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const chatId = props.route.params.chatId
    const chatData = chatId && storedChats[chatId]

    useEffect(() => {
        const getCommonUserChats = async () => {
            const currentUserChats = await getUserChats(currentUser.userId)
            setCommonChats(
                Object.values(currentUserChats).filter(chatId => storedChats[chatId] && storedChats[chatId].isGroupChat)
            )
        }
        getCommonUserChats()
    }, [])

    const removeFromChat = useCallback(async () => {
        try {
            setIsLoading(true)
            await removeUserFromChat(userData, currentUser, chatData)
            props.navigation.goBack()
        } catch (err) {
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    },
        [props.navigation, isLoading],
    )


    return (
        <PageContainer>
            <View style={styles.topContainer}>
                <ProfileImage
                    uri={currentUser.profilePicture}
                    size={80}
                    style={{ marginBottom: 20 }}
                />
                <PageTitle text={`${currentUser.firstName} ${currentUser.lastName}`} />
                {
                    currentUser.about &&
                    <Text style={styles.about} numberOfLines={2}>{currentUser.about}</Text>
                }
            </View>
            {
                commonChats.length > 0 &&
                <>
                    <Text style={styles.heading}>{commonChats.length} {commonChats.length === 1 ? 'Group' : 'Groups'} in Common</Text>
                    {
                        commonChats.map(chatId => {
                            const chatData = storedChats[chatId]

                            return <DataItem
                                key={chatId}
                                title={chatData.chatName}
                                subtitle={chatData.latestMessageText}
                                type={'link'}
                                image={chatData.chatImage}
                                onPress={() => props.navigation.push('ChatScreen', { chatId })}
                            // in the previous line there is use of push and not navigate, 
                            // because there is already a chatScreen behind the contactscreen.
                            //  and it will navigate to it and not to the one we need
                            />
                        })
                    }
                </>
            }

            {
                chatData && chatData.isGroupChat &&
                (
                    isLoading ?
                        <ActivityIndicator
                            size='small'
                            color={colors.primary}
                        /> :
                        <SubmitButton
                            title='Remove from chat'
                            color={colors.red}
                            onPress={removeFromChat}
                        />
                )
            }

        </PageContainer>
    )
}

const styles = StyleSheet.create({
    topContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    about: {
        fontFamily: 'medium',
        fontSize: 16,
        letterSpacing: 0.4,
        color: colors.grey
    },
    heading: {
        fontFamily: 'bold',
        letterSpacing: 0.4,
        color: colors.textColor,
        marginVertical: 8,
    },

})

export default ContactScreen
