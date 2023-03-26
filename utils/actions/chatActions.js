import { child, get, getDatabase, push, ref, remove, set, update } from "firebase/database"
import { getFirebaseApp } from "../firebaseHelper"

export const createChat = async (loggedInUserId, chatData) => {
    console.log('chatData',chatData)
    const newChatData = {
        ...chatData,
        createdBy: loggedInUserId,
        updatedBy: loggedInUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()

    }
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const newChat = await push(child(dbRef, 'chats'), newChatData);

    const chatUsers = newChatData.users;
    for (let i = 0; i < chatUsers.length; i++) {
        const userId = chatUsers[i];
        await push(child(dbRef, `userChats/${userId}`), newChat.key);
    }

    return newChat.key;
}

export const sendTextMessage = async (chatId, senderId, messageText, replyTo) => {
    console.log('chatId in sendText',chatId)
    await sendMessage(chatId, senderId, messageText, null, replyTo);
}

export const sendImage = async (chatId, senderId, imageUrl, replyTo) => {
    await sendMessage(chatId, senderId, 'Image', imageUrl, replyTo);
}

const sendMessage = async (chatId, senderId, messageText, imageUrl, replyTo) => {
    const app = getFirebaseApp()
    const dbRef = ref(getDatabase(app))
    const messagesRef = child(dbRef, `messages/${chatId}`)

    const messageData = {
        sentBy: senderId,
        sentAt: new Date().toISOString(),
        text: messageText
    }
    if (replyTo) messageData.replyTo = replyTo

    if (imageUrl) {
        messageData.imageUrl = imageUrl
    }
    await push(messagesRef, messageData)

    const chatRef = child(dbRef, `chats/${chatId}`);
    await update(chatRef, {
        updatedBy: senderId,
        updatedAt: new Date().toISOString(),
        latestMessageText: messageText
    })
}

export const starMessage = async (messageId, chatId, userId) => {
    try {
        const app = getFirebaseApp()
        const dbRef = ref(getDatabase(app))
        const childRef = child(dbRef, `userStarredMessages/${userId}/${chatId}/${messageId}`)

        const snapshot = await get(childRef)

        if (snapshot.exists()) {
            // starred item existst - unstar
            await remove(childRef)
        } else {
            // starred item does not existst - star
            const starredMessageData = {
                messageId,
                chatId,
                starredAt: new Date().toISOString()
            }
            await set(childRef, starredMessageData)
        }
    } catch (err) {
        console.log('error in chatAction at the starMessage function', err);
    }
}