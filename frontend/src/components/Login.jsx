import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { getUser } from "../redux/userSlice";

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!isLogin && (!formData.name || !formData.username)) {
            toast.error("Name and Username are required for sign-up.");
            return false;
        }
        if (!formData.email || !formData.password) {
            toast.error("Email and Password are required.");
            return false;
        }
        if (!isLogin && formData.password.length <= 5) {
            toast.error("Password must be at least 5 characters long.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            const url = isLogin ? `${USER_API_END_POINT}/login` : `${USER_API_END_POINT}/register`;
            const data = isLogin
                ? { email: formData.email, password: formData.password }
                : { name: formData.name, username: formData.username, email: formData.email, password: formData.password };

            const res = await axios.post(url, data, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            console.log("Response from backend:", res.data);


            toast.success(res.data.message);
            dispatch(getUser(res?.data?.user));

            if (isLogin) {
                localStorage.setItem("token", res?.data?.token); // ✅ Token saved in localStorage
                navigate("/");
            } else {
                setIsLogin(true);
                navigate("/login");
            }
        } catch (error) {
            console.error("Login/Register Error:", error);
            toast.error(error?.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="flex items-center justify-between bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-xl w-[85%] max-w-4xl">

                {/* Logo Section */}
                <div className="hidden md:flex flex-col items-center">
                    <img
                        className="mb-4"
                        width={"150px"}
                        src="https://www.edigitalagency.com.au/wp-content/uploads/new-Twitter-logo-x-black-png-1200x1227.png"
                        alt="twitterlogo"
                    />
                    <h1 className="text-white text-4xl font-extrabold">Happening now</h1>
                    <p className="text-white text-lg mt-2">Join today.</p>
                </div>

                {/* Login/Signup Section */}
                <div className="w-full md:w-[50%] bg-white p-8 rounded-xl shadow-lg">
                    <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
                        {isLogin ? "Login to Twitter" : "Sign up for Twitter"}
                    </h1>

                    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </>
                        )}

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 outline-none"
                        />

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-full hover:bg-blue-600 transition disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : isLogin ? "Login" : "Sign up"}
                        </button>
                    </form>

                    <p className="text-gray-500 text-sm text-center mt-4">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-blue-500 hover:underline"
                        >
                            {isLogin ? "Sign up" : "Login"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
