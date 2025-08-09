export type Artifact = { 
  label: string; 
  href: string;
};

export type Publication = {
  year: number;
  type: 'journal' | 'conference' | 'preprint' | string;
  title: string;
  authors: string;
  venue: string;
  url: string | null;
  artifacts: Artifact[];
  tags: string[];
  abstract?: string;
};

export type TalkResource = { 
  label: string; 
  href: string; 
  download?: boolean 
};

export type Talk = {
  date: string; // ISO date
  title: string;
  audience: string;
  audienceUrl: string | null;
  mode: 'online' | 'on-site' | 'hybrid' | string;
  resources: TalkResource[];
  tags: string[];
};

export type BlogPost = {
  id: string;
  body: string;
  slug: string;
  collection: string;
  data: {
    title: string;
    excerpt: string;
    tags: string[];
    pubDate: Date;
    coverImage?: {
      src: string;
      width: number;
      height: number;
      format: string;
    };
  };
};