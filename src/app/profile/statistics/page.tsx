import type { Metadata } from "next";
import StatisticsPage from "@/components/Profile/StatisticsPage";

export const metadata: Metadata = {
  title: "Статистика",
};

export default function Statistics() {
  return <StatisticsPage />;
}
