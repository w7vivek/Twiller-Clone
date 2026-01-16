"use client";

import { useEffect, useState } from "react";
import {
  setNotificationPreference,
  getNotificationPreference,
} from "@/lib/notification";
import { requestNotificationPermission } from "@/lib/notificationService";

export default function ProfilePage() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(getNotificationPreference());
  }, []);

  const toggleNotifications = async () => {
    if (!enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) return;
    }

    setEnabled(!enabled);
    setNotificationPreference(!enabled);
  };

  return (
    <div>
      <h2>Notification Settings</h2>

      <button onClick={toggleNotifications}>
        {enabled ? "Disable Notifications" : "Enable Notifications"}
      </button>
    </div>
  );
}
