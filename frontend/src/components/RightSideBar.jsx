/* eslint-disable */
import React from 'react';
import Avatar from 'react-avatar';
import { CiSearch } from 'react-icons/ci';
import { Link } from 'react-router-dom';


function RightSideBar({ otherUsers }) {
    return (
        <div className="w-[25%] px-4 py-2">
            {/* Search Bar */}
            <div className="flex items-center bg-gray-200 rounded-full p-2 border border-gray-300 focus-within:border-gray-400 w-full transition">
                <CiSearch size="20px" className="text-gray-500 ml-2" />
                <input
                    type="text"
                    className="bg-transparent outline-none px-2 w-full text-gray-800 placeholder-gray-500"
                    placeholder="Search Twitter"
                />
            </div>

            {/* Who to Follow Section  */}
            <div className="p-4 bg-gray-100 rounded-2xl my-4 shadow-sm">
                <h1 className="font-bold text-lg text-gray-800">Who to Follow</h1>
                {
                    otherUsers?.map((user) => {
                        return (
                            <div key={user?._id} className="flex items-center justify-between my-3">
                                <div className="flex items-center">
                                    <Avatar src="https://avatar.iran.liara.run/public" size="40" round={true} />
                                    <div className="ml-2 mr-2">
                                        <h1 className="font-bold text-gray-900">{user?.name}</h1>
                                        <p className="text-sm text-gray-500">{`${user?.username}`}</p>
                                    </div>
                                </div>
                                <Link to={`/profile/${user?._id}`}>

                                    <button className="px-4 py-1 bg-black text-white rounded-full hover:bg-gray-800 transition duration-200">
                                        Profile
                                    </button>


                                </Link>

                            </div>

                        )


                    })

                }

            </div>
        </div>
    );
}

export default RightSideBar;
