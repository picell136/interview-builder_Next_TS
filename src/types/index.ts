export type Role = "frontend" | "backend" | "qa" | "devops";

export type Level = "junior" | "middle" | "senior";

export type Technology =
  | "react"
  | "typescript"
  | "javascript"
  | "nextjs"
  | "nodejs"
  | "python"
  | "docker"
  | "kubernetes"
  | "postgresql"
  | "testing"
  | "ci-cd";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  category: string;
  role: Role;
  level: Level;
  technologies: Technology[];
  explanation: string;
}

export interface InterviewConfig {
  role: Role;
  level: Level;
  technologies: Technology[];
  categories: string[];
  questionCount: number;
}

export interface InterviewAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  category: string;
  timeSpentSeconds: number;
}

export interface InterviewAttempt {
  id: string;
  userId: string;
  config: InterviewConfig;
  answers: InterviewAnswer[];
  score: number;
  totalQuestions: number;
  durationSeconds: number;
  completedAt: string;
}

export interface CategoryStat {
  category: string;
  total: number;
  correct: number;
  percentage: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends AuthCredentials {
  name: string;
}
