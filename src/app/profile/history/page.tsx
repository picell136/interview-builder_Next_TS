import type { Metadata } from "next";
import HistoryPage from "@/components/Profile/HistoryPage";

export const metadata: Metadata = {
  title: "История",
};

export default function History() {
  return <HistoryPage />;
}
