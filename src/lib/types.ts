
import type { LucideIcon } from "lucide-react";

export type Lesson = {
  id: string;
  title: string;
  description: string;
  ecoPoints: number;
  chapters: Chapter[];
};

export type Chapter = {
  id: string;
  title: string;
  content: string; // Markdown content
  quiz: Quiz;
}

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
  likes?: number;
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

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface UserProfile {
    id: string;
    full_name: string;
    avatar_url: string;
    eco_points: number;
    completed_lessons: string[];
    badges: Badge[];
    email?: string;
}

export type Reward = {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: LucideIcon;
}

export type EcoVillageScenario = {
  title: string;
  description: string;
  choices: {
    text: string;
    consequence: string;
    effects: {
      environment: number;
      community: number;
      economy: number;
    }
  }[];
}
