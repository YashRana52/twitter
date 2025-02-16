import React from 'react';
import CreatePost from './CreatePost';
import Tweet from './Tweet';
import { useSelector } from 'react-redux';

function Feed() {
    const { tweets = [], loading } = useSelector(store => store.tweet);

    return (
        <div className='w-[50%] mx-auto'>
            <CreatePost />
            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : tweets.length === 0 ? (
                <p className="text-center text-gray-500 mt-4">🚀 No tweets available. Be the first to post!</p>
            ) : (
                tweets
                    .filter(tweet => tweet && tweet._id)
                    .map(tweet => <Tweet key={tweet._id} tweet={tweet} />)
            )}
        </div>
    );
}

export default Feed;
