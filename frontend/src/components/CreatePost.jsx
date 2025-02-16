import axios from 'axios';
import React, { useState } from 'react';
import Avatar from 'react-avatar';
import { CiImageOn } from "react-icons/ci";
import { TWEET_API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addTweet, getIsActive, getRefresh } from '../redux/tweetSlice';

function CreatePost() {
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const { isActive, tweets } = useSelector(store => store.tweet);
    const user = useSelector(store => store.user?.user);
    const token = user?.token || localStorage.getItem("token");

    const submitHandler = async () => {
        if (!description.trim()) {
            toast.error("Post cannot be empty!");
            return;
        }

        if (!token) {
            toast.error("Authentication failed! Please login again.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${TWEET_API_END_POINT}/create`,
                { description, id: user?._id },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                }
            );

            if (response?.data?.success) {
                toast.success(response.data.message || "Post created successfully!");

                const newTweet = response.data.tweet;
                dispatch(addTweet(newTweet));
                dispatch(getRefresh());

                setDescription("");
            } else {
                toast.error(response.data?.message || "Failed to create post.");
            }
        } catch (error) {
            console.error("Error creating post:", error.response || error);
            toast.error(error.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    const forYouHandler = () => {
        dispatch(getIsActive(true));
    };

    const followingHandler = () => {
        dispatch(getIsActive(false));
    };

    return (
        <div className="w-full border-b border-gray-200 bg-white">
            {/* For You / Following Tabs */}
            <div className="flex items-center border-b border-gray-200">
                <div
                    onClick={forYouHandler}
                    className={`${isActive ? "border-b-4 border-blue-600" : "border-b-4 border-transparent"} cursor-pointer hover:bg-gray-100 w-full text-center px-4 py-3`}
                >
                    <h1 className="font-semibold text-gray-600 text-lg">For You</h1>
                </div>
                <div
                    onClick={followingHandler}
                    className={`${!isActive ? "border-b-4 border-blue-600" : "border-b-4 border-transparent"} cursor-pointer hover:bg-gray-100 w-full text-center px-4 py-3`}
                >
                    <h1 className="font-semibold text-gray-600 text-lg">Following</h1>
                </div>
            </div>

            {/* Create Post Input */}
            <div className="p-4">
                <div className="flex items-start space-x-4">
                    <Avatar src={user?.avatar || "https://avatar.iran.liara.run/public"} size="40" round={true} />
                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full outline-none border-none text-lg placeholder-gray-500 bg-transparent"
                        type="text"
                        placeholder="What is happening?!"
                        aria-label="Tweet input"
                        disabled={!isActive}
                    />
                </div>

                {/* Post Button */}
                <div className="flex items-center justify-between mt-3 border-t border-gray-200 pt-3">
                    <button
                        className="text-[#1DA1F2] text-2xl hover:bg-blue-100 p-2 rounded-full transition disabled:opacity-50"
                        disabled={!isActive}
                    >
                        <CiImageOn size="24px" />
                    </button>

                    <button
                        onClick={submitHandler}
                        className="bg-[#1DA1F2] hover:bg-[#0d8de5] px-5 py-2 rounded-full text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || !isActive}
                    >
                        {loading ? "Posting..." : "Post"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
