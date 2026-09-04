import type { Metadata } from "next";
import InterviewSession from "@/components/InterviewSession/InterviewSession";

export const metadata: Metadata = {
  title: "Интервью",
};

export default function InterviewPage() {
  return <InterviewSession />;
}
