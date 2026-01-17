let audio: HTMLAudioElement | null = null;

export const playSound = async () => {
  try {
    if (typeof window === "undefined") return;

    if (!audio) {
      audio = new Audio("/notification.mp3");
    }

    audio.currentTime = 0;
    await audio.play();
  } catch {
    // Ignore AbortError safely
  }
};
