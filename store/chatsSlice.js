import { createSlice } from "@reduxjs/toolkit";

const chatsSlice = createSlice({
    name: "chats",
    initialState: {
        chatsData: {},
    },
    reducers: {
   
        setChatsData: (state, action) => {        
            state.chatsData = action.payload.chatsData
        },
      
    }
});

export const setChatsData = chatsSlice.actions.setChatsData
export default chatsSlice.reducer;