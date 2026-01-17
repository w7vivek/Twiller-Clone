export function playNotificationSound() {
  const audio = new Audio("../../public/sounds/notification.mp3");
  audio.volume = 0.5;
  audio.play().catch(() => {});
}