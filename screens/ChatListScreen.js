import React, { useEffect } from 'react'
import { Text, View, StyleSheet, Button, FlatList } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector } from 'react-redux';


import CustomHeaderButton from '../components/CustomHeaderButton';
import DataItem from '../components/DataItem';
import PageContainer from '../components/PageContainer';
import PageTitle from '../components/pageTitle';



const ChatListScreen = props => {

    const selectedUser = props.route?.params?.selectedUserId;
    console.log('selectedUser', selectedUser)
    const userData = useSelector(state => state.auth.userData);
    const storedUsers = useSelector(state => state.users.storedUsers);
    const userChats = useSelector(state => {
        const chatsData = state.chats.chatsData;
        return Object.values(chatsData).sort((a, b) => {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
    });


    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => {
                return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item
                        title="New chat"
                        iconName="create-outline"
                        onPress={() => props.navigation.navigate("NewChat")} />
                </HeaderButtons>
            }
        })
    }, []);

    useEffect(() => {

        if (!selectedUser) {
            return;
        }

        const chatUsers = [selectedUser, userData.userId];

        const navigationProps = {
            newChatData: { users: chatUsers }
        }

        props.navigation.navigate("ChatScreen", navigationProps);

    }, [props.route?.params])

    return (
        <PageContainer>
            <PageTitle text='Chats' />
            <FlatList
                data={userChats}
                renderItem={(itemData) => {
                    const chatData = itemData.item
                    const chatId = chatData.key

                    const otherUserId = chatData.users.find(uid => uid !== userData.userId)
                    const otherUser = storedUsers[otherUserId]

                    if (!otherUser) return
                    const title = `${otherUser.firstName} ${otherUser.lastName}`
                    const subtitle = chatData.latestMessageText || 'New chat'
                    const image = otherUser.profilePicture
                    return <DataItem
                        title={title}
                        subtitle={subtitle}
                        image={image}
                        onPress={() => props.navigation.navigate('ChatScreen', { chatId })}
                    />
                }}
            />
        </PageContainer>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})


export default ChatListScreen

