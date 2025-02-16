import React from 'react'
import Avatar from 'react-avatar';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
import useGetProfile from '../hooks/useGetProfile'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast'
import { followingUpdate } from '../redux/userSlice';
import { getRefresh } from '../redux/tweetSlice';

function Profile() {
    const { user, profile } = useSelector(store => store.user)
    const { id } = useParams()
    useGetProfile(id)
    const dispatch = useDispatch()

    const followAndUnfollowHandler = async () => {
        try {
            axios.defaults.withCredentials = true;
            let res;

            if (user.following.includes(id)) {
                // Unfollow
                res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`, { id: user?._id });
            } else {
                // Follow
                res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, { id: user?._id });
            }
            dispatch(followingUpdate(id))
            dispatch(getRefresh())

            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong!");
        }
    };

    return (
        <div className='w-[50%] border-l border-r border-gray-200'>
            <div className=''>
                <div className='flex items-center py-2'>
                    <Link to='/' className='p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer'>
                        <IoMdArrowBack size='24px' />

                    </Link>
                    <div className='ml-2'>
                        <h1 className='font-bold text-lg'>{profile?.name}</h1>
                        <p className='text-gray-500 text-sm'>10 post</p>

                    </div>

                </div>
                <div className="w-[646px] h-[200px]">
                    <img
                        src="https://plus.unsplash.com/premium_photo-1726754457459-d2dfa2e3a434?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFubmVyJTIwY29kaW5nfGVufDB8fDB8fHww"
                        alt="banner"
                        className="w-full h-full object-cover"
                    />
                    <div className='absolute top-52 ml-2 border-4 border-white rounded-full'>
                        <Avatar src="https://avatar.iran.liara.run/public" size="120" round={true} />
                    </div>

                    <div className='text-right m-4'>

                        {
                            profile?._id === user?._id ? (<button className='px-4 py-1 rounded-full  border border-gray-400 hover:bg-gray-200'>
                                Edit Profile</button>) : (
                                <button onClick={followAndUnfollowHandler} className='px-4 py-1 rounded-full    bg-black text-white'>
                                    {user.following.includes(id) ? "Unfollow" : "Follow"}</button>

                            )
                        }
                    </div>
                    <div className='m-4' >
                        <h1 className='font-bold text-xl'>
                            {profile?.name}
                        </h1>
                        <p>{`@${profile?.username}`}</p>
                    </div>
                    <div className='m-4 text-sm'>
                        <p> Software Engineer💻 | 👨‍💻Passionate about code & innovation |💡 Building the future, one line at a time🔧</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile