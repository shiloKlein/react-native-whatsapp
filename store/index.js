import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import chatsSlice from "./chatsSlice";
import messagesSlice from "./messagesSlice";
import userSlice from "./userSlice";


export const store = configureStore({
    reducer: {
        auth: authSlice,
        users: userSlice,
        chats: chatsSlice,
        messages:messagesSlice,
    }
})