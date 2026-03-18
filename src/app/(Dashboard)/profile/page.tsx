import { Metadata } from "next";
import { ProfileView } from "@/components/Profile/ProfileView";

export const metadata: Metadata = {
  title: "Profile Page",
};

export default function ProfilePage() {
  return <ProfileView />;
}
