let audio: HTMLAudioElement | undefined;

export const playSound = async () => {
  try {
    if (!audio) {
      audio = new Audio("/lib/AudioSounds/notification.wav");
    }
    audio.currentTime = 0;
    await audio.play();
  } catch {}
};