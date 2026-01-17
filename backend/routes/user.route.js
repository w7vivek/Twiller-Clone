import express from "express";
import Tweet from "../models/tweet.js";
import User from "../models/user.js";

const router = express.Router();

/* CREATE TWEET */
router.post("/post", async (req, res) => {
  try {
    const tweet = new Tweet(req.body);
    await tweet.save();

    const keywords = ["cricket", "science"];
    const containsKeyword = keywords.some(word =>
      tweet.content.toLowerCase().includes(word)
    );

    const author = await User.findById(tweet.author);

    let triggerNotification = false;

    if (
      containsKeyword &&
      author &&
      author.notificationsEnabled
    ) {
      triggerNotification = true;
    }

    res.json({
      tweet,
      triggerNotification,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Tweet creation failed" });
  }
});

export default router;
