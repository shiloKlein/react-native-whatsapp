import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import chatsSlice from "./chatsSlice";
import userSlice from "./userSlice";


export const store = configureStore({
    reducer: {
        auth: authSlice,
        users: userSlice,
        chats: chatsSlice,
    }
})