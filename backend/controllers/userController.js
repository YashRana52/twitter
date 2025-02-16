import { User } from "../models/userSchema.js";
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken";



export const Register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {


            //basic validation

            return res.status(401).json({
                message: "All fields are required",
                success: false
            })

        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(401).json({
                message: "User already exist.",
                success: false
            })

        }

        const hashedPassword = await bcryptjs.hash(password, 10)

        await User.create({
            name,
            username,
            email,
            password: hashedPassword

        })
        return res.status(201).json({
            message: "Account created succefully",
            success: true
        })



    } catch (error) {
        console.log(error);


    }
}

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //  Basic Validation
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        //  Check if User Exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User does not exist with this email",
                success: false
            });
        }

        //  Compare Password
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            });
        }

        //  Create Token
        const tokenData = {
            userId: user._id
        };

        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });

        return res
            .status(200)
            .cookie("token", token, { maxAge: 86400000, httpOnly: true })
            .json({
                message: `Welcome back, ${user.name}!`,
                user,
                token,

                success: true
            });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};
export const logout = (req, res) => {
    return res.cookie("token", "", {
        expires: new Date(0),
        httpOnly: true
    }).json({
        message: "User Logged out successfully.",
        success: true
    });
};

export const bookmark = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const user = await User.findById(loggedInUserId);
        if (user.bookmarks.includes(tweetId)) {
            // remove
            await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Removed from bookmarks."
            });
        } else {
            // bookmark
            await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: tweetId } });
            return res.status(200).json({
                message: "Saved to bookmarks."
            });
        }
    } catch (error) {
        console.log(error);
    }

};

export const getMyProfile = async (req, res) => {
    try {

        const id = req.params.id;

        const user = await User.findById(id).select("-password")
        return res.status(201).json({
            user,
        })

    } catch (error) {
        console.log(error);


    }

}

export const getOtherUsers = async (req, res) => {

    try {

        const { id } = req.params;
        const otherUsers = await User.find({ _id: { $ne: id } }).select("-password")
        if (!otherUsers) {
            return res.status(401).json({
                message: "currently do not have any users"
            })

        }
        return res.status(201).json({
            otherUsers,
        })





    } catch (error) {
        console.log(error);


    }

}

export const follow = async (req, res) => {
    try {
        const loggedInUserId = req.body.id; //jo login h uski id
        const userId = req.params.id; // jisko follow krna h
        const loggedInUser = await User.findById(loggedInUserId)
        const user = await User.findById(userId)
        if (!user.followers.includes(loggedInUser)) {
            await user.updateOne({ $push: { followers: loggedInUserId } })
            await loggedInUser.updateOne({ $push: { following: userId } })


        } else {
            return res.status(401).json({
                message: `User allready follow to ${user.name}`
            })
        }

        return res.status(200).json({
            message: `${loggedInUser.name} just follow to ${user.name}`,
            success: true
        })


    } catch (error) {
        console.log(error);


    }
}

export const unfollow = async (req, res) => {



    try {
        const loggedInUserId = req.body.id; //jo login h uski id
        const userId = req.params.id; // jisko follow krna h
        const loggedInUser = await User.findById(loggedInUserId)
        const user = await User.findById(userId)
        if (loggedInUser.following.includes(userId)) {
            await user.updateOne({ $pull: { followers: loggedInUserId } })
            await loggedInUser.updateOne({ $pull: { following: userId } })


        } else {
            return res.status(401).json({
                message: `User has not follow yet`
            })
        }

        return res.status(200).json({
            message: `${loggedInUser.name} just unfollow to ${user.name}`,
            success: true
        })


    } catch (error) {
        console.log(error);


    }

}