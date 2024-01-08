import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  const { content, owner } = req.body;
  if (!content || !owner) {
    throw new ApiError(400, "Content or Owner Id is empty.");
  }
  if (!isValidObjectId(owner)) {
    throw new ApiError(400, "Owner id is not valid.");
  }
  const newTweet = new Tweet.create({
    content,
    owner,
  });

  await newTweet.save();

  const tweets = await Tweet.find();

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweet created success."));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets

  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "UserId is empty.");
  }

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "User id is not valid.");
  }
  let userTweets = [];
  const allTweets = await Tweet.find();

  allTweets.forEach((tweet) => {
    if (tweet.owner === userId) userTweets.push(tweet);
  });

  return res
    .status(200)
    .json(new ApiResponse(200, userTweets, "UserTweets fetched successfully."));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet

  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "TweetId is empty.");
  }

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Tweet is is not valid.");
  }
  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      content: content,
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully."));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "TweetId is empty.");
  }
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Tweet id is not valid.");
  }

  await Tweet.findByIdAndDelete(tweetId);
  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet deleted successfully."));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
