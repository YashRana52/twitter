import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { getOtherUser } from '../redux/userSlice';

const useOtherUsers = (id) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!id) return;

        const fetchOtherUsers = async () => {
            try {
                const res = await axios.get(`${USER_API_END_POINT}/otheruser/${id}`, {
                    withCredentials: true,
                });
                dispatch(getOtherUser(res.data.otherUsers));
            } catch (error) {
                console.error('Error fetching other users:', error);
            }
        };

        fetchOtherUsers();
    }, [id, dispatch]);

};

export default useOtherUsers;
