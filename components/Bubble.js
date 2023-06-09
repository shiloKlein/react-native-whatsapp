import React, { useRef } from 'react'
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import * as Clipboard from 'expo-clipboard'
import uuid from 'react-native-uuid'
import colors from '../constants/colors'
import { Feather, FontAwesome } from '@expo/vector-icons'
import { starMessage } from '../utils/actions/chatActions'
import { useSelector } from 'react-redux'

function formatAmPm(dateString) {
    const date = new Date(dateString)
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
}

const MenuItem = props => {
    const Icon = props.iconPack ?? Feather
    return <MenuOption onSelect={props.onSelect}>
        <View style={styles.menuItemContainer}>
            <Text style={styles.menuText}>{props.text}</Text>
            <Icon name={props.icon} size={18} />
        </View>
    </MenuOption >
}
const Bubble = props => {

    const { text, type, messageId, userId, chatId, date, setReply, replyingTo, name, imageUrl } = props

    const starredMessages = useSelector(state => state.messages.starredMessages[chatId] ?? {})
    const storedUsers = useSelector(state => state.users.storedUsers)

    const bubbleStyle = { ...styles.container }
    const textStyle = { ...styles.text }
    const wrapperStyle = { ...styles.wrapperStyle }

    const menuRef = useRef(null)
    const id = useRef(uuid.v4())

    let Container = View
    let isUserMessage = false
    const dateString = date && formatAmPm(date)

    switch (type) {
        case 'system':
            textStyle.color = '#65644a'
            bubbleStyle.backgroundColor = colors.beige
            bubbleStyle.alighnItems = 'center'
            bubbleStyle.marginTop = 10
            break;
        case 'error':
            textStyle.color = 'white'
            bubbleStyle.backgroundColor = colors.red
            bubbleStyle.marginTop = 10
            break;
        case 'myMessage':
            wrapperStyle.justifyContent = 'flex-end'
            bubbleStyle.backgroundColor = '#e7fed6'
            bubbleStyle.maxWidth = '90%'
            bubbleStyle.marginTop = 10
            Container = TouchableWithoutFeedback
            isUserMessage = true
            break;
        case 'theirMessage':
            wrapperStyle.justifyContent = 'flex-start'
            bubbleStyle.maxWidth = '90%'
            Container = TouchableWithoutFeedback
            isUserMessage = true
            break;
        case 'reply':
            bubbleStyle.backgroundColor = '#f2f2f2'
            break;
        case 'info':
            bubbleStyle.backgroundColor = 'white'
            bubbleStyle.alighnItems = 'center'
            textStyle.color = colors.textColor
            break;

        default:
            break;
    }

    const copyToClipboard = async text => {
        try {
            await Clipboard.setStringAsync(text)
        } catch (err) {
            console.log('error in bubble component, copy to clipboard function', err)
        }
    }
    const isStarred = isUserMessage && starredMessages[messageId]
    const replyingToUser = replyingTo && storedUsers[replyingTo.sentBy]
    return (
        <View style={wrapperStyle}>
            <Container style={{ width: '100%' }} onLongPress={() => menuRef.current.props.ctx.menuActions.openMenu(id.current)}>
                <View style={bubbleStyle}>

                    {
                        name && type !== 'info' &&
                        <Text style={styles.name}>{name}</Text>
                    }
                    {
                        replyingToUser && <Bubble
                            type='reply'
                            text={replyingTo.text}
                            name={`${replyingToUser.firstName} ${replyingToUser.lastName}`}
                        />
                    }

                    {!imageUrl &&
                        <Text style={textStyle}>
                            {text}
                        </Text>}

                    {
                        imageUrl &&
                        <Image source={{ uri: imageUrl }} style={styles.image} />
                    }

                    {
                        dateString && type!=='info'&& <View style={styles.timeContainer}>
                            {isStarred && <FontAwesome name='star' size={14} color={colors.textColor} style={{ marginEnd: 5 }} />}
                            <Text style={styles.time}> {dateString} </Text>
                        </View>
                    }
                    <Menu name={id.current} ref={menuRef}>
                        <MenuTrigger />
                        <MenuOptions>

                            <MenuItem text='Copy to clipboard'
                                icon='copy'
                                onSelect={() => copyToClipboard(text)} />

                            <MenuItem text={`${isStarred ? 'Unstar' : 'Star'}`}
                                icon={`${isStarred ? 'star' : 'star-o'}`}
                                iconPack={FontAwesome}
                                onSelect={() => starMessage(messageId, chatId, userId)} />

                            <MenuItem text={`reply`}
                                icon={`mail-reply`}
                                iconPack={FontAwesome}
                                onSelect={setReply} />

                        </MenuOptions>

                    </Menu>

                </View>
            </Container>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapperStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    container: {
        backgroundColor: 'white',
        borderRadius: 6,
        padding: 5,
        marginBottom: 10,
        borderColor: '#e2dacc',
        borderWidth: 1,
    },
    text: {
        fontFamily: 'regular',
        letterSpacing: 0.4,
    },
    menuItemContainer: {
        flexDirection: 'row',
        padding: 5,
    },
    menuText: {
        flex: 1,
        fontFamily: 'regular',
        letterSpacing: 0.4,
        fontSize: 16,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    time: {
        fontFamily: 'regular',
        letterSpacing: 0.4,
        color: colors.grey,
        fontSize: 12,
    },
    name: {
        fontFamily: 'medium',
        letterSpacing: 0.4,
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 5,
    }



})
export default Bubble
