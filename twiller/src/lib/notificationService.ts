// src/utils/notificationService.ts
import { getNotificationPreference } from "../lib/notification";

export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;

  if (Notification.permission === "granted") return true;

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function showTweetNotification(tweetText: string) {
  if (!getNotificationPreference()) return;
  if (Notification.permission !== "granted") return;

  new Notification("Important Tweet 🚨", {
    body: tweetText,
    icon: "/favicon.ico",
  });
}
