import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
    name: "user",
    initialState: {
        user: null,
        otherUsers: null,
        profile: null
    },
    reducers: {
        //multiple action
        getUser: (state, action) => {
            state.user = action.payload;

        },
        getOtherUser: (state, action) => {
            state.otherUsers = action.payload;

        },
        getMyProfile: (state, action) => {
            state.profile = action.payload
        },
        followingUpdate: (state, action) => {
            //unfloow
            if (state.user.following.includes(action.payload)) {
                state.user.following = state.user.following.filter((itemId) => {
                    return itemId !== action.payload


                })


            }
            else {
                state.user.following.push(action.payload)

            }

        }



    }
})
export const { getUser, getOtherUser, getMyProfile, followingUpdate } = userSlice.actions;
export default userSlice.reducer;