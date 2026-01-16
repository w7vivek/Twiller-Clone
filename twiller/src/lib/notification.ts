export function setNotificationPreference(enabled: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem("notificationsEnabled", JSON.stringify(enabled));
}

export function getNotificationPreference(): boolean {
  if (typeof window === "undefined") return false;
  return JSON.parse(
    localStorage.getItem("notificationsEnabled") || "false"
  );
}