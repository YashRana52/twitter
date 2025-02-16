import axios from "axios";
import { TWEET_API_END_POINT } from "../utils/constant";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTweets, getRefresh } from "../redux/tweetSlice";

const useGetMyTweets = (id) => {
    const dispatch = useDispatch();
    const { refresh, isActive } = useSelector(store => store.tweet);

    useEffect(() => {
        let isMounted = true;

        const fetchTweets = async () => {
            try {
                dispatch(getAllTweets([]));

                const endpoint = isActive
                    ? `${TWEET_API_END_POINT}/alltweets/${id}`
                    : `${TWEET_API_END_POINT}/followingtweets/${id}`;

                const res = await axios.get(endpoint, { withCredentials: true });

                if (isMounted && res.data && Array.isArray(res.data.tweets)) {
                    dispatch(getAllTweets(res.data.tweets));
                }
            } catch (error) {
                console.error("Error fetching tweets:", error);
            }
        };

        if (id) {
            fetchTweets();
        }

        return () => { isMounted = false; };
    }, [isActive, id, refresh]);

};

export default useGetMyTweets;
