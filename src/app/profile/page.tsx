import type { Metadata } from "next";
import ProfilePage from "@/components/Profile/ProfilePage";

export const metadata: Metadata = {
  title: "Личный кабинет",
};

export default function Profile() {
  return <ProfilePage />;
}
