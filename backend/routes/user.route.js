import express from "express";
import User from "../models/User.js";

const router = express.Router();

/* UPDATE NOTIFICATION SETTINGS */
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
