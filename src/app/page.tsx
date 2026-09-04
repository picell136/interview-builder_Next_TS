import type { Metadata } from "next";
import InterviewBuilder from "@/components/InterviewBuilder/InterviewBuilder";

export const metadata: Metadata = {
  title: "Конструктор",
};

export default function HomePage() {
  return <InterviewBuilder />;
}
