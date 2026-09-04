import type { Metadata } from "next";
import InterviewResult from "@/components/InterviewResult/InterviewResult";

export const metadata: Metadata = {
  title: "Результат",
};

export default function ResultPage() {
  return <InterviewResult />;
}
