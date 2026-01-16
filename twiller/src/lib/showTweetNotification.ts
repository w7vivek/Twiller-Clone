import { playNotificationSound } from "./sounds";

export function showTweetNotification(
  content: string,
  user: any
) {
  if (
    Notification.permission === "granted" &&
    user?.notificationsEnabled
  ) {
    new Notification("Important Tweet 🚨", {
      body: content,
    });

    if (user.soundEnabled) {
      playNotificationSound();
    }
  }
}
