import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, Button, TextInput, ActivityIndicator, FlatList } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { FontAwesome } from '@expo/vector-icons';


import comonStyles from '../constants/comonStyles';
import CustomHeaderButton from '../components/CustomHeaderButton';
import PageContainer from '../components/PageContainer';
import colors from '../constants/colors';
import { searchUsers } from '../utils/actions/userAction';
import DataItem from '../components/DataItem';
import { useDispatch, useSelector } from 'react-redux';
import { setStoredUsers } from '../store/userSlice';

const NewChatScreen = props => {

const dispatch = useDispatch()

    const [isLoading, setIsLloading] = useState(false)
    const [users, setUsers] = useState()
    const [noResultFound, setNoResultFound] = useState(false)
    const [searchTerm, setNoSearchTerm] = useState('')

    const userData = useSelector(state => state.auth.userData)


    useEffect(() => {
        props.navigation.setOptions({
            headerLeft: () => {
                return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item
                        title='Close'
                        onPress={() => props.navigation.goBack()}
                    />
                </HeaderButtons>
            },
            headerTitle: 'New chat'
        })
    }, [])

    useEffect(() => {
        const delaySearch = setTimeout(async () => {
            if (!searchTerm) {
                setUsers()
                setNoResultFound(false)
                return
            }
            setIsLloading(true)
            const usersResult = await searchUsers(searchTerm)
            delete usersResult[userData.userId]
            setUsers(usersResult)

            if (Object.keys(usersResult).length === 0) setNoResultFound(true)
            else{
            setNoResultFound(false)
            dispatch(setStoredUsers({newUsers:usersResult}))
            } 


            setIsLloading(false)

        }, 500);
        return () => clearTimeout(delaySearch)
    }, [searchTerm])


    const userPressed = userId => {
        props.navigation.navigate('ChatList', {
            selectedUserId: userId
        })
    }
    return (
        <PageContainer>
            <View style={styles.searchContainer}>
                <FontAwesome name="search" size={15} color={colors.lightGrey} />

                <TextInput
                    placeholder='Search'
                    style={styles.searchBox}
                    onChangeText={text => setNoSearchTerm(text)}
                />
            </View>

            {
                isLoading &&
                <View style={comonStyles.center}>
                    <ActivityIndicator size={'large'} color={colors.primary} />

                </View>
            }
            {
                !isLoading && !noResultFound && users &&
                <FlatList
                    data={Object.keys(users)}
                    renderItem={itemData => {
                        const userId = itemData.item
                        const userData = users[userId]

                        return <DataItem
                            title={`${userData.firstName} ${userData.lastName}`}
                            subtitle={userData.about}
                            image={userData.profilePicture}
                            onPress={()=>userPressed(userId)}
                        />
                    }}
                />
            }

            {
                !isLoading && noResultFound && (
                    <View style={comonStyles.center}>
                        <FontAwesome
                            name="question"
                            size={55}
                            color={colors.lightGrey}
                            style={styles.noResultsIcon}
                        />
                        <Text
                            style={styles.noResultsText}>
                            No users found!
                        </Text>
                    </View>
                )
            }
            {
                !isLoading && !users && (
                    <View style={comonStyles.center}>
                        <FontAwesome
                            name="users"
                            size={55}
                            color={colors.lightGrey}
                            style={styles.noResultsIcon}
                        />
                        <Text
                            style={styles.noResultsText}>
                            Enter a name to search for a user!
                        </Text>
                    </View>
                )
            }
        </PageContainer>

    )
}

const styles = StyleSheet.create({

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.extraLightGrey,
        height: 30,
        marginVertical: 8,
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 5,

    },
    searchBox: {
        marginLeft: 8,
        fontSize: 15,
        width: '100%'
    },
    noResultsIcon: {
        marginBottom: 20,

    },
    noResultsText: {
        color: colors.textColor,
        fontFamily: 'regular',
        fontSize: 16,
        letterSpacing: 0.4,
    },
})


export default NewChatScreen






