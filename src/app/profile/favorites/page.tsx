import type { Metadata } from "next";
import FavoritesPage from "@/components/Profile/FavoritesPage";

export const metadata: Metadata = {
  title: "Избранное",
};

export default function Favorites() {
  return <FavoritesPage />;
}
