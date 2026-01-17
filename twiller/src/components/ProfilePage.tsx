"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Link as LinkIcon,
  MoreHorizontal,
  Camera,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import TweetCard from "./TweetCard";
import { Card, CardContent } from "./ui/card";
import Editprofile from "./Editprofile";
import axiosInstance from "@/lib/axiosInstance";
import { requestNotificationPermission } from "@/lib/notificationService";
import axios from "@/lib/axiosInstance";

export default function ProfilePage() {
  const { user, setUser } = useAuth();

  // 🔹 ALL HOOKS FIRST (IMPORTANT)
  const [activeTab, setActiveTab] = useState("posts");
  const [showEditModal, setShowEditModal] = useState(false);
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔔 Notification toggle handler
  const handleNotificationToggle = async () => {
    if (!user) return;

    const newValue = !user.notificationsEnabled;

    // Ask browser permission only when enabling
    if (newValue) {
      await requestNotificationPermission();
    }

    const res = await axiosInstance.put("/api/user/notifications", {
      email: user.email,
      enabled: newValue,
      soundEnabled: user.soundEnabled,
    });

    setUser(res.data);
  };

  // Fetch tweets
  const fetchTweets = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/post");
      setTweets(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  // Guard AFTER hooks
  if (!user) return null;

  const userTweets = tweets.filter(
    (tweet: any) => tweet.author._id === user._id
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="flex items-center px-4 py-3 space-x-8">
          <Button variant="ghost" size="sm" className="p-2 rounded-full">
            <ArrowLeft className="h-5 w-5 text-white" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">
              {user.displayName}
            </h1>
            <p className="text-sm text-gray-400">
              {userTweets.length} posts
            </p>
          </div>
        </div>
      </div>

      {/* Cover */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600" />
        <div className="absolute -bottom-16 left-4">
          <Avatar className="h-32 w-32 border-4 border-black">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.displayName[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex justify-end p-4">
          <Button
            variant="outline"
            className="border-gray-600 text-white bg-gray-950 rounded-full px-6"
            onClick={() => setShowEditModal(true)}
          >
            Edit profile
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4 mt-12">
        <div className="flex justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {user.displayName}
            </h1>
            <p className="text-gray-400">@{user.username}</p>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-5 w-5 text-gray-400" />
          </Button>
        </div>

        {user.bio && (
          <p className="text-white mb-3">{user.bio}</p>
        )}

        {/* 🔔 Notification Toggle */}
        <div className="mb-4">
          <button
            onClick={async () => {
              console.log("Toggle clicked");

              const permission = await Notification.requestPermission();
              console.log("Permission:", permission);

              if (permission === "granted") {
                alert("Notifications enabled ✅");

                // optional: sync backend so state is correct
                const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/user/notifications`, {
                  enabled: true,
                  soundEnabled: user.soundEnabled,
                });

                setUser(res.data);
              } else {
                alert("Permission not granted ❌");
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Enable keyword notifications
          </button>
        </div>

        <div className="flex gap-4 text-gray-400 text-sm">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {user.location || "Earth"}
          </div>
          <div className="flex items-center gap-1">
            <LinkIcon className="h-4 w-4" />
            {user.website || "example.com"}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Joined{" "}
            {new Date(user.joinedDate).toLocaleDateString("en-us", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 border-b border-gray-800">
          {["posts", "replies", "highlights", "articles", "media"].map(
            (tab) => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            )
          )}
        </TabsList>

        <TabsContent value="posts">
          {loading ? (
            <Card className="bg-black border-none">
              <CardContent className="py-12 text-center text-gray-400">
                Loading...
              </CardContent>
            </Card>
          ) : (
            userTweets.map((tweet: any) => (
              <TweetCard key={tweet._id} tweet={tweet} />
            ))
          )}
        </TabsContent>
      </Tabs>

      <Editprofile
        isopen={showEditModal}
        onclose={() => setShowEditModal(false)}
      />
    </div>
  );
}
