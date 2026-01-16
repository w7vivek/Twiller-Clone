export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    alert("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") return true;

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

export function setNotificationPreference(value: boolean) {
  localStorage.setItem("tweetNotifications", JSON.stringify(value));
}

export function getNotificationPreference(): boolean {
  return JSON.parse(localStorage.getItem("tweetNotifications") || "false");
}

