import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getMyProfile } from '../redux/userSlice';

const useGetProfile = (id) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!id) return;

        const fetchMyProfile = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/profile/${id}`, {
                    withCredentials: true,
                });
                dispatch(getMyProfile(res.data.user));
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchMyProfile();
    }, [id, dispatch]);
};

export default useGetProfile;
