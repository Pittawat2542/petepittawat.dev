import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;
export type Talk = CollectionEntry<'talks'>['data'];
export type Publication = CollectionEntry<'publications'>['data'];
export type Project = CollectionEntry<'projects'>['data'];
export type AboutTimelineItem = CollectionEntry<'about'>['data'];

export type Artifact = Publication['artifacts'][number];
export type TalkResource = Talk['resources'][number];
export type ProjectLink = Project['links'][number];

export async function getBlogPosts() {
  return getCollection('blog');
}

export async function getTalks() {
  const talks = await getCollection('talks');
  return talks.map(entry => entry.data);
}

export async function getPublications() {
  const publications = await getCollection('publications');
  return publications.map(entry => entry.data);
}

export async function getProjects() {
  const projects = await getCollection('projects');
  return projects.map(entry => entry.data);
}

export async function getAboutTimeline() {
  const items = await getCollection('about');
  return items.map(entry => entry.data);
}
