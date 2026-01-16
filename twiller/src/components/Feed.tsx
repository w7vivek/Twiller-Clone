"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import LoadingSpinner from "./loading-spinner";
import TweetCard from "./TweetCard";
import TweetComposer from "./TweetComposer";
import axiosInstance from "@/lib/axiosInstance";
import { containsKeyword } from "@/lib/keywordCheck";
import { showTweetNotification } from "@/lib/showTweetNotification";
import { useAuth } from "@/context/AuthContext";

const Feed = () => {
  const { user } = useAuth(); // 🔑 get logged-in user
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH TWEETS (STEP-10 HERE)
  // =========================
  const fetchTweets = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/post");
      setTweets(res.data);

      // 🔔 STEP-10: TRIGGER NOTIFICATIONS
      if (user?.notificationsEnabled) {
        res.data.forEach((tweet: any) => {
          if (containsKeyword(tweet.content)) {
            showTweetNotification(tweet.content, user);
          }
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  // =========================
  // HANDLE NEW TWEET
  // =========================
  const handlenewtweet = (newtweet: any) => {
    setTweets((prev) => [newtweet, ...prev]);

    // 🔔 Notify for newly posted tweet
    if (
      user?.notificationsEnabled &&
      containsKeyword(newtweet.content)
    ) {
      showTweetNotification(newtweet.content, user);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold text-white">Home</h1>
        </div>

        <Tabs defaultValue="foryou" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-gray-800 rounded-none h-auto">
            <TabsTrigger
              value="foryou"
              className="data-[state=active]:text-white text-gray-400 py-4 font-semibold"
            >
              For you
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="data-[state=active]:text-white text-gray-400 py-4 font-semibold"
            >
              Following
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tweet Composer */}
      <TweetComposer onTweetPosted={handlenewtweet} />

      {/* Feed */}
      <div className="divide-y divide-gray-800">
        {loading ? (
          <Card className="bg-black border-none">
            <CardContent className="py-12 text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-gray-400">Loading tweets...</p>
            </CardContent>
          </Card>
        ) : (
          tweets.map((tweet) => (
            <TweetCard key={tweet._id} tweet={tweet} />
          ))
        )}
      </div>
      <div className="bg-(--card) text-(--card-foreground) p-6 rounded-xl">
        Tailwind + CSS variables working ✅
      </div>
    </div>

  );
};

export default Feed;
