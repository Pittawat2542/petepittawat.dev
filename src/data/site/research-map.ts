import { getBlogPostPath } from '../../lib/blog-translations.ts';
import { slugify } from '../../lib/slug.ts';

export type ResearchThemeId =
  | 'behavior-shaping'
  | 'evaluation'
  | 'reasoning-models'
  | 'agentic-systems';

export type ResearchArtifactType = 'blog' | 'project' | 'publication' | 'talk';

export interface ResearchArtifactRef {
  readonly type: ResearchArtifactType;
  readonly slug?: string;
  readonly title?: string;
  readonly year?: number;
  readonly date?: string;
}

export interface ResearchTheme {
  readonly id: ResearchThemeId;
  readonly title: string;
  readonly summary: string;
  readonly representativeTags: readonly string[];
  readonly artifacts: readonly ResearchArtifactRef[];
  readonly startHere?: ResearchArtifactRef;
}

export interface ResolvedResearchArtifact {
  readonly type: ResearchArtifactType;
  readonly title: string;
  readonly href: string;
  readonly description: string;
  readonly meta: string;
  readonly tags: readonly string[];
}

export interface ResolvedResearchTheme {
  readonly id: ResearchThemeId;
  readonly title: string;
  readonly summary: string;
  readonly representativeTags: readonly string[];
  readonly artifacts: readonly ResolvedResearchArtifact[];
  readonly startHere?: ResolvedResearchArtifact;
  readonly unresolved: readonly ResearchArtifactRef[];
}

export interface ResearchContentSources {
  readonly blogPosts: readonly ResearchBlogPost[];
  readonly projects: readonly ResearchProject[];
  readonly publications: readonly ResearchPublication[];
  readonly talks: readonly ResearchTalk[];
}

interface ResearchBlogPost {
  readonly id?: string;
  readonly slug?: string;
  readonly data?: {
    readonly slug?: string | undefined;
    readonly routeSlug?: string | undefined;
    readonly title: string;
    readonly excerpt: string;
    readonly tags: readonly string[];
    readonly pubDate: Date;
    readonly lang?: 'en' | 'th' | undefined;
    readonly externalUrl?: string | undefined;
  };
  readonly title?: string | undefined;
}

interface ResearchProject {
  readonly year: number;
  readonly title: string;
  readonly summary: string;
  readonly tags: readonly string[];
  readonly type?: string | undefined;
}

interface ResearchPublication {
  readonly year: number;
  readonly type: string;
  readonly title: string;
  readonly authors: string;
  readonly venue: string;
  readonly tags: readonly string[];
  readonly abstract?: string | undefined;
}

interface ResearchTalk {
  readonly date: Date | string;
  readonly title: string;
  readonly audience: string;
  readonly mode: string;
  readonly tags: readonly string[];
}

export const RESEARCH_THEMES: readonly ResearchTheme[] = [
  {
    id: 'behavior-shaping',
    title: 'Behavior Shaping',
    summary:
      'How prompts, post-training, feedback, and reward design steer model behavior under real constraints.',
    representativeTags: [
      'Prompt Engineering',
      'Reinforcement Fine-Tuning',
      'Null-Shot Prompting',
      'Hallucination',
    ],
    startHere: {
      type: 'publication',
      title: 'Prior Prompt Engineering for Reinforcement Fine-Tuning',
      year: 2025,
    },
    artifacts: [
      {
        type: 'publication',
        title: 'Prior Prompt Engineering for Reinforcement Fine-Tuning',
        year: 2025,
      },
      {
        type: 'publication',
        title: 'Null-Shot Prompting: Rethinking Prompting Large Language Models With Hallucination',
        year: 2024,
      },
      {
        type: 'talk',
        title: 'Prior Prompt Engineering for Reinforcement Fine-Tuning',
        date: '2025-10-23',
      },
      {
        type: 'project',
        title: 'OpenRLHF (Contributor)',
        year: 2025,
      },
    ],
  },
  {
    id: 'evaluation',
    title: 'Evaluation',
    summary:
      'Benchmarks, failure taxonomies, and practical checks for whether model outputs hold up beyond demos.',
    representativeTags: ['LLM Evaluation', 'Structured Outputs', 'Benchmark', 'Robustness'],
    startHere: {
      type: 'project',
      title: 'BenchING: Structured Output Benchmark for LLMs',
      year: 2025,
    },
    artifacts: [
      {
        type: 'publication',
        title:
          'BenchING: A Benchmark for Evaluating Large Language Models in Following Structured Output Format Instruction in Text-Based Narrative Game Tasks',
        year: 2025,
      },
      {
        type: 'publication',
        title: 'On the Robustness of Answer Formats in Medical Reasoning Models',
        year: 2026,
      },
      {
        type: 'project',
        title: 'Themis',
        year: 2025,
      },
      {
        type: 'project',
        title: 'BenchING: Structured Output Benchmark for LLMs',
        year: 2025,
      },
    ],
  },
  {
    id: 'reasoning-models',
    title: 'Reasoning Models',
    summary:
      'Open reasoning models and analyses for Thai, medical, and domain-specific reasoning settings.',
    representativeTags: ['Reasoning Models', 'Typhoon', 'Thai Language', 'Medical AI'],
    startHere: {
      type: 'blog',
      slug: 'typhoon-t1',
    },
    artifacts: [
      {
        type: 'publication',
        title: 'Typhoon T1: An Open Thai Reasoning Model',
        year: 2025,
      },
      {
        type: 'project',
        title: 'Typhoon T1: Open Thai Reasoning Model',
        year: 2025,
      },
      {
        type: 'project',
        title: 'Typhoon-Si Med-Thinking 4B',
        year: 2026,
      },
      {
        type: 'blog',
        slug: 'reasoning-model-landscape',
      },
      {
        type: 'blog',
        slug: 'typhoon-sidata-plus',
      },
    ],
  },
  {
    id: 'agentic-systems',
    title: 'Agentic Systems',
    summary:
      'Tools, workflows, and applied systems that turn model behavior research into usable practice.',
    representativeTags: ['Agentic Workflow', 'Context Engineering', 'AI Engineering', 'Applied AI'],
    startHere: {
      type: 'blog',
      slug: 'agentic-workflows',
    },
    artifacts: [
      {
        type: 'blog',
        slug: 'agentic-workflows',
      },
      {
        type: 'talk',
        title: 'Open Models, Smarter Agents: Practical Lessons from Modern Agentic Workflows',
        date: '2026-03-09',
      },
      {
        type: 'talk',
        title: 'Agentic AI With Context Engineering',
        date: '2025-07-31',
      },
      {
        type: 'project',
        title: 'Typhoon Application Week',
        year: 2025,
      },
    ],
  },
] as const;

export function resolveResearchThemeArtifacts(
  themes: readonly ResearchTheme[],
  sources: ResearchContentSources
): ResolvedResearchTheme[] {
  return themes.map(theme => {
    const resolvedEntries = theme.artifacts.map(ref => ({
      ref,
      artifact: resolveResearchArtifact(ref, sources),
    }));
    const artifacts = resolvedEntries
      .map(entry => entry.artifact)
      .filter((artifact): artifact is ResolvedResearchArtifact => Boolean(artifact));
    const unresolved = resolvedEntries.filter(entry => !entry.artifact).map(entry => entry.ref);
    const startHere = theme.startHere
      ? (resolveResearchArtifact(theme.startHere, sources) ?? artifacts[0])
      : artifacts[0];

    return {
      id: theme.id,
      title: theme.title,
      summary: theme.summary,
      representativeTags: theme.representativeTags,
      artifacts,
      unresolved,
      ...(startHere ? { startHere } : {}),
    };
  });
}

export function assertResearchThemesResolved(themes: readonly ResolvedResearchTheme[]) {
  const unresolved = themes.flatMap(theme =>
    theme.unresolved.map(ref => `${theme.id}: ${formatResearchArtifactRef(ref)}`)
  );

  if (unresolved.length > 0) {
    throw new Error(`Unresolved research map references:\n${unresolved.join('\n')}`);
  }
}

function resolveResearchArtifact(
  ref: ResearchArtifactRef,
  sources: ResearchContentSources
): ResolvedResearchArtifact | undefined {
  switch (ref.type) {
    case 'blog':
      return resolveBlogArtifact(ref, sources.blogPosts);
    case 'project':
      return resolveProjectArtifact(ref, sources.projects);
    case 'publication':
      return resolvePublicationArtifact(ref, sources.publications);
    case 'talk':
      return resolveTalkArtifact(ref, sources.talks);
  }
}

function resolveBlogArtifact(
  ref: ResearchArtifactRef,
  posts: readonly ResearchBlogPost[]
): ResolvedResearchArtifact | undefined {
  const post = posts.find(candidate => getBlogSlug(candidate) === ref.slug);
  if (!post) return undefined;

  if (post.data) {
    return {
      type: 'blog',
      title: post.data.title,
      href: getBlogPostPath(post as Parameters<typeof getBlogPostPath>[0]),
      description: post.data.excerpt,
      meta: 'Blog post',
      tags: post.data.tags,
    };
  }

  return {
    type: 'blog',
    title: post.title ?? ref.slug ?? 'Blog post',
    href: `/blog/${ref.slug}`,
    description: 'Blog post',
    meta: 'Blog post',
    tags: [],
  };
}

function resolveProjectArtifact(
  ref: ResearchArtifactRef,
  projects: readonly ResearchProject[]
): ResolvedResearchArtifact | undefined {
  const project = projects.find(
    candidate => candidate.title === ref.title && candidate.year === ref.year
  );
  if (!project) return undefined;

  return {
    type: 'project',
    title: project.title,
    href: `/projects#project-${slugify(project.title)}-${project.year}`,
    description: project.summary,
    meta: `${project.year}${project.type ? ` · ${project.type}` : ''}`,
    tags: project.tags,
  };
}

function resolvePublicationArtifact(
  ref: ResearchArtifactRef,
  publications: readonly ResearchPublication[]
): ResolvedResearchArtifact | undefined {
  const publication = publications.find(
    candidate => candidate.title === ref.title && candidate.year === ref.year
  );
  if (!publication) return undefined;

  return {
    type: 'publication',
    title: publication.title,
    href: `/publications#pub-${slugify(publication.title)}-${publication.year}`,
    description: publication.abstract ?? publication.venue,
    meta: `${publication.year} · ${publication.type} · ${publication.venue}`,
    tags: publication.tags,
  };
}

function resolveTalkArtifact(
  ref: ResearchArtifactRef,
  talks: readonly ResearchTalk[]
): ResolvedResearchArtifact | undefined {
  const talk = talks.find(
    candidate => candidate.title === ref.title && formatDateKey(candidate.date) === ref.date
  );
  if (!talk) return undefined;
  const year = formatDateKey(talk.date).slice(0, 4);

  return {
    type: 'talk',
    title: talk.title,
    href: `/talks#talk-${slugify(talk.title)}-${year}`,
    description: `${talk.audience} · ${talk.mode}`,
    meta: formatDateKey(talk.date),
    tags: talk.tags,
  };
}

function getBlogSlug(post: ResearchBlogPost) {
  return post.data?.routeSlug ?? post.data?.slug?.replace(/-(en|th)$/, '') ?? post.slug ?? post.id;
}

function formatDateKey(value: Date | string) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return value.slice(0, 10);
}

function formatResearchArtifactRef(ref: ResearchArtifactRef) {
  return [ref.type, ref.slug, ref.title, ref.year, ref.date].filter(Boolean).join(' / ');
}
