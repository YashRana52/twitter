/* eslint-disable */
import React, { useEffect } from 'react';
import LeftSideBar from './LeftSideBar';
import RightSideBar from './RightSideBar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useOtherUsers from '../hooks/useOtherUsers';
import useGetMyTweets from '../hooks/useGetMyTweets';

function Home() {

    const { user, otherUsers } = useSelector(store => store.user);
    const navigate = useNavigate()
    useEffect(() => {
        if (!user) {
            navigate("/login")


        }

    }, [])



    useOtherUsers(user?._id);
    useGetMyTweets(user?._id)

    return (
        <div className='flex justify-between w-[85%] mx-auto'>
            <LeftSideBar className="" />
            <Outlet className="w-[60%] h-screen overflow-y-auto" />
            <RightSideBar otherUsers={otherUsers} />
        </div>
    );
}

export default Home;
