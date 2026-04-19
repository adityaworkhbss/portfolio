

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Stat {
  value: string;
  label: string;
}

export interface About {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  avatarUrl: string;
  resumeUrl: string;
  email: string;
  location: string;
  socialLinks: SocialLink[];
  skills: SkillCategory[];
  stats?: Stat[];
  availabilityStatus?: 'green' | 'orange' | 'red';
  availabilityText?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  coverImage: string;
  images: string[];
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  order: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  companyLogo?: string;
  techStack: string[];
  order: number;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  published: boolean;
  readingTime: number;
  views?: number;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}
