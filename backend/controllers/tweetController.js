import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";

export const createTweet = async (req, res) => {
    try {

        const { description, id } = req.body;
        if (!description || !id) {
            return res.status(401).json({
                message: "All field are required",
                success: false
            })

        }
        const user = await User.findById(id).select("-password")

        await Tweet.create({
            description,
            userId: id,
            userDetails: user
        })
        return res.status(201).json({
            message: "Tweet created succesfully",
            success: true
        })



    } catch (error) {
        console.log(error);


    }

}
export const deleteTweet = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTweet = await Tweet.findByIdAndDelete(id);

        if (!deletedTweet) {
            return res.status(404).json({ message: "Tweet not found", success: false });
        }

        return res.status(200).json({
            message: "Tweet deleted successfully",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const likeOrDislike = async (req, res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;

        if (!loggedInUserId) {
            return res.status(400).json({ message: "User ID is required", success: false });
        }

        // Find the tweet
        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({ message: "Tweet not found", success: false });
        }

        let updatedTweet;

        if (tweet.likes.includes(loggedInUserId)) {
            // Dislike (remove like)
            updatedTweet = await Tweet.findByIdAndUpdate(
                tweetId,
                { $pull: { likes: loggedInUserId } },
                { new: true }
            );

            return res.status(200).json({
                message: " disliked  tweet",
                success: true,
                likes: updatedTweet.likes
            });

        } else {
            // Like the tweet
            updatedTweet = await Tweet.findByIdAndUpdate(
                tweetId,
                { $push: { likes: loggedInUserId } },
                { new: true }
            );

            return res.status(200).json({
                message: " liked  tweet",
                success: true,
                likes: updatedTweet.likes
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getAllTweet = async (req, res) => {
    try {
        const id = req.params.id;

        // Fetch the logged-in user
        const loggedInUser = await User.findById(id);
        if (!loggedInUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch logged-in user's tweets
        const loggedInUserTweets = await Tweet.find({ userId: id });

        // Fetch tweets from users they follow
        const followingUserTweet = await Promise.all(
            loggedInUser.following.map(async (otherUserId) => {
                return Tweet.find({ userId: otherUserId });
            })
        );

        // Merge all tweets and send response
        return res.status(200).json({
            tweets: loggedInUserTweets.concat(...followingUserTweet),
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
export const getFollowingTweets = async (req, res) => {

    try {
        const id = req.params.id;

        // Fetch the logged-in user
        const loggedInUser = await User.findById(id);
        if (!loggedInUser) {
            return res.status(404).json({ message: "User not found" });
        }



        // Fetch tweets from users they follow
        const followingUserTweet = await Promise.all(
            loggedInUser.following.map(async (otherUserId) => {
                return Tweet.find({ userId: otherUserId });
            })
        );

        // following  user tweets
        return res.status(200).json({
            tweets: [].concat(...followingUserTweet),
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }

}
