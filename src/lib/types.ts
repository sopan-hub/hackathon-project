import type { LucideIcon } from "lucide-react";

export type Lesson = {
  id: string;
  title: string;
  description: string;
  content: string; // Markdown content
  imageUrl: string;
  dataAiHint: string;
  ecoPoints: number;
  quiz: Quiz;
};

export type Quiz = {
  questions: Question[];
};

export type Question = {
  question: string;
  options: string[];
  correctAnswerIndex: number;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  ecoPoints: number;
  imageUrl: string;
  dataAiHint: string;
};

export type LeaderboardEntry = {
  rank: number;
  team: string;
  school: string;
  points: number;
  avatarUrl: string;
};

export type CommunityPost = {
  id: string;
  author: string;
  authorAvatarUrl: string;
  title: string;
  content: string;
  timestamp: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
};
