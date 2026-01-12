"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";

export default function TweetCard({ tweet }: any) {
  const { user } = useAuth();
  const [tweetstate, settweetstate] = useState(tweet);
  const likeTweet = async (tweetId: string) => {
    try {
      const res = await axiosInstance.post(`/like/${tweetId}`, {
        userId: user?._id,
      });
      settweetstate(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const retweetTweet = async (tweetId: string) => {
    try {
      const res = await axiosInstance.post(`/retweet/${tweetId}`, {
        userId: user?._id,
      });
      settweetstate(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };
  const isLiked = tweetstate.likedBy?.includes(user?._id);
  const isRetweet = tweetstate.retweetedBy?.includes(user?._id);
  return (
    <Card className="bg-black border-gray-800 border-x-0 border-t-0 rounded-none hover:bg-gray-950/50 transition-colors cursor-pointer">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={tweetstate.author.avatar}
              alt={tweetstate.author.displayName}
            />
            <AvatarFallback>{tweetstate.author.displayName}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-bold text-white">
                {tweetstate.author.displayName}
              </span>
              {tweetstate.author.verified && (
                <div className="bg-blue-500 rounded-full p-0.5">
                  <svg
                    className="h-4 w-4 text-white fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                </div>
              )}
              <span className="text-gray-500">
                @{tweetstate.author.username}
              </span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500">
                {tweetstate.timestamp &&
                  new Date(tweetstate.timestamp).toLocaleDateString("en-us", {
                    month: "long",
                    year: "numeric",
                  })}
              </span>
              <div className="ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 rounded-full hover:bg-gray-900"
                >
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            </div>

            <div className="text-white mb-3 leading-relaxed">
              {tweetstate.content}
            </div>

            {tweetstate.image && (
              <div className="mb-3 rounded-2xl overflow-hidden">
                <img
                  src={tweetstate.image}
                  alt="Tweet image"
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}

            <div className="flex items-center justify-between max-w-md">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-blue-900/20 text-gray-500 hover:text-blue-400 group"
              >
                <MessageCircle className="h-5 w-5 group-hover:text-blue-400" />
                <span className="text-sm">
                  {formatNumber(tweetstate.comments)}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-2 p-2 rounded-full hover:bg-green-900/20 group ${
                  isRetweet
                    ? "text-green-400"
                    : "text-gray-500 hover:text-green-400"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  retweetTweet(tweetstate._id);
                }}
              >
                <Repeat2
                  className={`h-5 w-5 ${
                    tweet.retweeted
                      ? "text-green-400"
                      : "group-hover:text-green-400"
                  }`}
                />
                <span className="text-sm">
                  {formatNumber(tweetstate.retweets)}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-2 p-2 rounded-full hover:bg-red-900/20 group ${
                  isLiked ? "text-red-500" : "text-gray-500 hover:text-red-400"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  likeTweet(tweetstate._id);
                }}
              >
                <Heart
                  className={`h-5 w-5 ${
                    tweetstate.liked
                      ? "text-red-500 fill-current"
                      : "group-hover:text-red-400"
                  }`}
                />
                <span className="text-sm">
                  {formatNumber(tweetstate.likes)}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-blue-900/20 text-gray-500 hover:text-blue-400 group"
              >
                <Share className="h-5 w-5 group-hover:text-blue-400" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
