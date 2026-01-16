import Landing from "@/components/Landing";
import Mainlayout from "@/components/layout/Mainlayout";
// import { useAuth } from "@/context/AuthContext";
import {
  setNotificationPreference,
  getNotificationPreference,
} from "@/lib/notification";

export default function Home() {

  return (
    <Mainlayout>
      <Landing />
    </Mainlayout>
  );
}
