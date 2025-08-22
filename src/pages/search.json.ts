import type { APIContext } from 'astro';
export const prerender = true;
import { getCollection } from 'astro:content';
import projects from '../content/projects/projects.json';
import publications from '../content/publications/publications.json';
import talks from '../content/talks/talks.json';

type SearchItem = {
  id: string;
  type: 'blog' | 'project' | 'publication' | 'talk' | 'page';
  title: string;
  description?: string;
  url: string;
  tags?: string[];
  date?: string | number;
  extra?: Record<string, string | number | null>;
};

export async function GET(_context: APIContext) {
  const items: SearchItem[] = [];

  const slugify = (s: string) => s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  // Blog posts
  const blog = await getCollection('blog');
  for (const entry of blog) {
    items.push({
      id: `blog:${entry.slug}`,
      type: 'blog',
      title: entry.data.title,
      description: entry.data.excerpt,
      url: `/blog/${entry.slug}`,
      tags: entry.data.tags,
      date: entry.data.pubDate.toISOString(),
    });
  }

  // Projects (single page list)
  for (const p of projects) {
    const anchor = `project-${slugify(p.title)}-${p.year}`;
    items.push({
      id: `project:${p.title}-${p.year}`,
      type: 'project',
      title: p.title,
      description: p.summary,
      url: `/projects#${anchor}`,
      tags: p.tags,
      date: p.year,
      extra: {},
    });
  }

  // Publications (single page list)
  for (const pub of publications) {
    const anchor = `pub-${slugify(pub.title)}-${pub.year}`;
    items.push({
      id: `publication:${pub.title}-${pub.year}`,
      type: 'publication',
      title: pub.title,
      description: `${pub.authors} — ${pub.venue}`,
      url: `/publications#${anchor}`,
      tags: pub.tags,
      date: pub.year,
      extra: { venue: pub.venue, type: pub.type },
    });
  }

  // Talks (single page list)
  for (const t of talks) {
    const year = new Date(t.date).getFullYear();
    const anchor = `talk-${slugify(t.title)}-${year}`;
    items.push({
      id: `talk:${t.title}-${t.date}`,
      type: 'talk',
      title: t.title,
      description: `${t.audience} — ${t.mode}`,
      url: `/talks#${anchor}`,
      tags: t.tags,
      date: t.date,
    });
  }

  // Top-level pages
  const pages: SearchItem[] = [
    { id: 'page:home', type: 'page', title: 'Home', url: '/', description: 'Welcome and highlights' },
    { id: 'page:blog', type: 'page', title: 'Blog', url: '/blog', description: 'Articles and notes' },
    { id: 'page:projects', type: 'page', title: 'Projects', url: '/projects', description: 'Selected work and systems' },
    { id: 'page:publications', type: 'page', title: 'Publications', url: '/publications', description: 'Research papers and works' },
    { id: 'page:talks', type: 'page', title: 'Talks', url: '/talks', description: 'Talks and workshops' },
    { id: 'page:about', type: 'page', title: 'About', url: '/about', description: 'Bio and timeline' },
  ];
  items.push(...pages);

  return new Response(JSON.stringify({ items }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
  });
}
