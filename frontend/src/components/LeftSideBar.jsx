import React from 'react';
import { CiHome, CiHashtag, CiUser, CiBookmark } from "react-icons/ci";
import { IoIosNotificationsOutline } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, getOtherUser, getUser } from '../redux/userSlice';

function LeftSideBar() {
    const { user } = useSelector(store => store.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`)
            dispatch(getUser(null))
            dispatch(getOtherUser(null))
            dispatch(getMyProfile(null))
            navigate("/login")
            toast.success(res.data.message);


        } catch (error) {
            console.log(error);


        }

    }
    return (
        <div className="w-[20%] h-screen px-6 py-4 ">

            <div className="mb-4">
                <img className="ml-2 w-8" src="https://www.edigitalagency.com.au/wp-content/uploads/new-Twitter-logo-x-black-png-1200x1227.png" alt="twitterlogo" />
            </div>


            <div className="my-4 space-y-2">
                <Link to='/' className="flex items-center my-2 hover:bg-gray-200 rounded-full px-4 py-2 cursor-pointer transition">
                    <CiHome size="24px" />
                    <h1 className="font-bold text-lg ml-3">Home</h1>
                </Link>

                <div className="flex items-center my-2 hover:bg-gray-200 rounded-full px-4 py-2 cursor-pointer transition">
                    <CiHashtag size="24px" />
                    <h1 className="font-bold text-lg ml-3">Explore</h1>
                </div>

                <div className="flex items-center my-2 hover:bg-gray-200 rounded-full px-4 py-2 cursor-pointer transition">
                    <IoIosNotificationsOutline size="24px" />
                    <h1 className="font-bold text-lg ml-3">Notifications</h1>
                </div>

                <Link to={`/profile/${user?._id}`} className="flex items-center my-2 hover:bg-gray-200 rounded-full px-4 py-2 cursor-pointer transition">
                    <CiUser size="24px" />
                    <h1 className="font-bold text-lg ml-3">Profile</h1>
                </Link>

                <div className="flex items-center my-2 hover:bg-gray-200 rounded-full px-4 py-2 cursor-pointer transition">
                    <CiBookmark size="24px" />
                    <h1 className="font-bold text-lg ml-3">Bookmarks</h1>
                </div>

                <div onClick={logoutHandler} className="flex items-center my-2 hover:bg-gray-200 rounded-full px-4 py-2 cursor-pointer transition">
                    <AiOutlineLogout size="24px" />
                    <h1 className="font-bold text-lg ml-3">Logout</h1>
                </div>
            </div>


            <button className="px-4 py-2 w-full bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition">
                Post
            </button>
        </div>
    );
}

export default LeftSideBar;
