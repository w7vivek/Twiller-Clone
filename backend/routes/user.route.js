import express from "express";
import User from "../models/user.js";

const router = express.Router();

/* ================================
   GET notification settings
   GET /api/user/notifications
================================ */
router.get("/notifications", async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      notificationsEnabled: user.notificationsEnabled,
      soundEnabled: user.soundEnabled,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   UPDATE notification settings
   PUT /api/user/notifications
================================ */
router.put("/notifications", async (req, res) => {
  try {
    const { email, enabled, soundEnabled } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        notificationsEnabled: enabled,
        soundEnabled: soundEnabled,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
