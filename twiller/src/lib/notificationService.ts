export async function requestNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";

  const permission = await Notification.requestPermission();
  return permission;
}