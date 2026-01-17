import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./models/user.js";
import Tweet from "./models/tweet.js";
import userRoutes from "./routes/user.routes.js";
import tweetRoutes from "./routes/tweet.routes.js";

dotenv.config();

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors());
app.use(express.json());

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.send("Twiller backend is running successfully");
});

/* ---------------- ROUTES ---------------- */
app.use("/api/user", userRoutes);
app.use("/api", tweetRoutes);

/* ---------------- Notification APIs ---------------- */
app.get("/api/user/notifications", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      notificationsEnabled: user.notificationsEnabled,
      soundEnabled: user.soundEnabled
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* ---------------- DB CONNECTION ---------------- */
const port = process.env.PORT || 5000;
const url = process.env.MONGODB_URL;

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

app.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(200).json(existingUser);

    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/loggedinuser", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.patch("/userupdate/:email", async (req, res) => {
  try {
    const updated = await User.findOneAndUpdate(
      { email: req.params.email },
      { $set: req.body },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/* =================================================
   TWEET APIs
================================================= */

app.post("/post", async (req, res) => {
  try {
    const tweet = new Tweet(req.body);
    await tweet.save();
    res.status(201).json(tweet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/post", async (req, res) => {
  try {
    const tweets = await Tweet.find()
      .sort({ timestamp: -1 })
      .populate("author");
    res.json(tweets);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/like/:tweetid", async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetid);
    if (!tweet) return res.status(404).json({ error: "Tweet not found" });

    if (!tweet.likedBy.includes(req.body.userId)) {
      tweet.likes++;
      tweet.likedBy.push(req.body.userId);
      await tweet.save();
    }

    res.json(tweet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/retweet/:tweetid", async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetid);
    if (!tweet) return res.status(404).json({ error: "Tweet not found" });

    if (!tweet.retweetedBy.includes(req.body.userId)) {
      tweet.retweets++;
      tweet.retweetedBy.push(req.body.userId);
      await tweet.save();
    }

    res.json(tweet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
