import { createSlice } from "@reduxjs/toolkit";

const tweetSlice = createSlice({
    name: "tweet",
    initialState: {
        tweets: [],
        refresh: false,
        isActive: true
    },
    reducers: {
        getAllTweets: (state, action) => {
            state.tweets = action.payload.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        },
        addTweet: (state, action) => {
            state.tweets = [action.payload, ...state.tweets];
        },
        getRefresh: (state) => {
            state.refresh = !state.refresh;
        },
        updateTweetLikes: (state, action) => {
            const { tweetId, userId } = action.payload;
            state.tweets = state.tweets.map(tweet => {
                if (tweet._id === tweetId) {
                    const isLiked = tweet.likes.includes(userId);
                    return {
                        ...tweet,
                        likes: isLiked
                            ? tweet.likes.filter(id => id !== userId)
                            : [...tweet.likes, userId]
                    };
                }
                return tweet;
            });
        },
        removeTweet: (state, action) => {
            state.tweets = state.tweets.filter(tweet => tweet._id !== action.payload);
        },
        getIsActive: (state, action) => {
            state.isActive = action.payload;
        }
    }
});

export const { getAllTweets, addTweet, getRefresh, updateTweetLikes, removeTweet, getIsActive } = tweetSlice.actions;
export default tweetSlice.reducer;
