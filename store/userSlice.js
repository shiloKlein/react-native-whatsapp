import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "users",
    initialState: {
        storedUsers: {},
    },
    reducers: {
   
        setStoredUsers: (state, action) => {
            const newUsers = action.payload.newUsers
            const existingUsers  = state.storedUsers

            const usersArray = Object.values(newUsers)
            usersArray.forEach(user=>{
            existingUsers[user.userId] = user
            })
            state.storedUsers = existingUsers
        },
      
    }
});

export const setStoredUsers = userSlice.actions.setStoredUsers
export default userSlice.reducer;