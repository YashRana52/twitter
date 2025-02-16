/* eslint-disable */
import React from 'react';
import Avatar from 'react-avatar';
import { MdDeleteOutline } from "react-icons/md";
import { FaRegComment } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import axios from 'axios';
import { TWEET_API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { getRefresh, updateTweetLikes, removeTweet } from '../redux/tweetSlice';

function Tweet({ tweet }) {
    const { user } = useSelector(store => store.user);
    const dispatch = useDispatch();
    const userId = user?._id;
    const tweetUser = tweet?.userDetails[0];

    const likeOrDislikeHandler = async () => {
        if (!userId) return toast.error("You need to be logged in!");

        try {
            dispatch(updateTweetLikes({ tweetId: tweet?._id, userId }));
            const res = await axios.put(`${TWEET_API_END_POINT}/like/${tweet?._id}`, { id: userId }, { withCredentials: true });

            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.error(error);
        }
    };

    const deleteTweetHandler = async () => {
        if (!userId) return toast.error("You need to be logged in!");

        try {
            axios.defaults.withCredentials = true;
            const res = await axios.delete(`${TWEET_API_END_POINT}/delete/${tweet?._id}`);

            toast.success(res.data.message);

            // Redux store se tweet remove karna (UI instantly update hoga)
            dispatch(removeTweet(tweet?._id));
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.error(error);
        }
    };

    return (
        <div className="border-b border-gray-200 p-4 hover:bg-gray-50 transition">
            <div className="flex">
                <Avatar src="https://avatar.iran.liara.run/public" size="40" round={true} />
                <div className="ml-3 w-full">
                    <div className="flex items-center text-sm">
                        <h1 className="font-bold">{tweetUser?.name}</h1>
                        <p className="text-gray-500 ml-2">{`@${tweetUser?.username}`} · 1m</p>
                    </div>
                    <p className="text-gray-800 mt-1">{tweet?.description}</p>
                    <div className="flex justify-start space-x-10 text-gray-500 text-sm mt-3">
                        <div className="flex items-center space-x-1 hover:text-green-500 cursor-pointer">
                            <FaRegComment size="20px" />
                            <p>0</p>
                        </div>
                        <div
                            onClick={likeOrDislikeHandler}
                            className="flex items-center space-x-1 cursor-pointer"
                        >
                            {tweet?.likes.includes(userId) ? (
                                <AiFillHeart size="20px" className="text-red-500" />
                            ) : (
                                <AiOutlineHeart size="20px" className="hover:text-red-500" />
                            )}
                            <p>{tweet?.likes.length}</p>
                        </div>
                        <div className="flex items-center space-x-1 hover:text-[#1DA1F2] cursor-pointer">
                            <CiBookmark size="20px" />
                            <p>0</p>
                        </div>
                        {userId === tweet?.userId && (
                            <div
                                onClick={deleteTweetHandler}
                                className="flex items-center space-x-1 hover:text-red-400 cursor-pointer"
                            >
                                <MdDeleteOutline size="20px" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Tweet;
