import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./models/user.js";
import Tweet from "./models/tweet.js";

dotenv.config();

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(cors());
app.use(express.json());

// ---------------- HEALTH CHECK ----------------
app.get("/", (req, res) => {
  res.send("Twiller backend is running successfully");
});

// ---------------- DB CONNECTION ----------------
const port = process.env.PORT || 5000;
const url = process.env.MONGODB_URL; // ✅ FIXED TYPO

mongoose
  .connect(url)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

/* =================================================
   USER APIs
================================================= */

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    const newUser = new User(req.body);
    await newUser.save();

    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// GET LOGGED IN USER
app.get("/loggedinuser", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" }); // ✅ FIX
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// UPDATE PROFILE
app.patch("/userupdate/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const updated = await User.findOneAndUpdate(
      { email },
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/* =================================================
   TWEET APIs
================================================= */

// CREATE TWEET
app.post("/post", async (req, res) => {
  try {
    const tweet = new Tweet(req.body);
    await tweet.save();
    return res.status(201).json(tweet);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// GET ALL TWEETS
app.get("/post", async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .sort({ timestamp: -1 })
      .populate("author");

    return res.status(200).json(tweets);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// LIKE TWEET
app.post("/like/:tweetid", async (req, res) => {
  try {
    const { userId } = req.body;
    const tweet = await Tweet.findById(req.params.tweetid);

    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    if (!tweet.likedBy.includes(userId)) {
      tweet.likes += 1;
      tweet.likedBy.push(userId);
      await tweet.save();
    }

    res.json(tweet);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// RETWEET
app.post("/retweet/:tweetid", async (req, res) => {
  try {
    const { userId } = req.body;
    const tweet = await Tweet.findById(req.params.tweetid);

    if (!tweet) {
      return res.status(404).json({ error: "Tweet not found" });
    }

    if (!tweet.retweetedBy.includes(userId)) {
      tweet.retweets += 1;
      tweet.retweetedBy.push(userId);
      await tweet.save();
    }

    res.json(tweet);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
