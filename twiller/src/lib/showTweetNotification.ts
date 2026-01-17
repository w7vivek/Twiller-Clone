let audio: HTMLAudioElement | null = null;

export function showTweetNotification(
  content: string,
  user: any
) {
  if (
    typeof window !== "undefined" &&
    Notification.permission === "granted" &&
    user?.notificationsEnabled
  ) {
    new Notification("Important Tweet 🚨", {
      body: content,
    });

    if (user.soundEnabled) {
      try {
        if (!audio) {
          audio = new Audio("/AudioSounds/notification.wav");
        }
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } catch {}
    }
  }
}