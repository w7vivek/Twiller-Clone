export function playNotificationSound() {
  const audio = new Audio("/sounds/notification.mp3");
  audio.volume = 0.5;

  audio.play().catch(() => {
    // autoplay blocked — ignore safely
  });
}