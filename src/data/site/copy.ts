export type SiteLocale = 'en' | 'th';

export type SiteNavLinkKey = 'home' | 'blog' | 'projects' | 'publications' | 'talks' | 'about';
export type HeroCtaIcon = 'rocket' | 'book-open' | 'mic';
export type HeroCtaVariant = 'primary' | 'secondary' | 'ghost';
export type HomeStatIcon = 'book-text' | 'scroll-text' | 'mic';
export type ResearchThemeIcon = 'activity' | 'layers' | 'shield-check' | 'globe';
export type HomeHighlightIcon = 'book-open' | 'graduation-cap' | 'cpu';

export interface SiteNavLink {
  readonly key: SiteNavLinkKey;
  readonly href: string;
  readonly label: string;
}

export interface SiteCopy {
  readonly meta: {
    readonly siteTitle: string;
    readonly description: string;
  };
  readonly nav: {
    readonly links: readonly SiteNavLink[];
  };
  readonly footer: {
    readonly title: string;
    readonly summary: string;
    readonly webringLabel: string;
  };
  readonly home: {
    readonly hero: {
      readonly kicker: string;
      readonly title: string;
      readonly intro: string;
      readonly summary: string;
      readonly focusLabel: string;
      readonly focusBody: string;
      readonly primaryCtas: readonly {
        readonly href: string;
        readonly title: string;
        readonly description: string;
        readonly ctaLabel: string;
        readonly variant: HeroCtaVariant;
        readonly icon: HeroCtaIcon;
      }[];
    };
    readonly aboutSection: {
      readonly eyebrow: string;
      readonly title: string;
      readonly lead: string;
      readonly body: string;
      readonly ctaLabel: string;
      readonly researchFocusTitle: string;
      readonly researchFocusDescription: string;
      readonly themes: readonly {
        readonly title: string;
        readonly description: string;
        readonly icon: ResearchThemeIcon;
      }[];
      readonly highlightsTitle: string;
      readonly highlightsDescription: string;
      readonly highlights: readonly {
        readonly title: string;
        readonly description: string;
        readonly icon: HomeHighlightIcon;
      }[];
    };
    readonly statsSection: {
      readonly eyebrow: string;
      readonly title: string;
      readonly description: string;
      readonly cards: readonly {
        readonly key: 'posts' | 'publications' | 'talks';
        readonly href: string;
        readonly ariaLabel: string;
        readonly title: string;
        readonly linkText: string;
        readonly accentBgColor: string;
        readonly description: string;
        readonly icon: HomeStatIcon;
      }[];
    };
    readonly blogSection: {
      readonly eyebrow: string;
      readonly title: string;
      readonly description: string;
      readonly browseLabel: string;
      readonly emptyLabel: string;
    };
  };
  readonly about: {
    readonly hero: {
      readonly title: string;
      readonly subtitle: string;
    };
    readonly profile: {
      readonly location: string;
      readonly role: string;
      readonly heading: string;
      readonly intro: string;
    };
    readonly now: {
      readonly title: string;
      readonly items: readonly string[];
    };
    readonly snapshot: {
      readonly title: string;
      readonly items: readonly {
        readonly label: string;
        readonly value: string;
        readonly hint: string;
      }[];
    };
    readonly themes: {
      readonly title: string;
      readonly description: string;
      readonly items: SiteCopy['home']['aboutSection']['themes'];
    };
    readonly background: {
      readonly title: string;
      readonly description: string;
      readonly notes: readonly string[];
    };
    readonly journey: {
      readonly title: string;
      readonly description: string;
      readonly spotlightTitle: string;
      readonly educationTitle: string;
      readonly collaborationsTitle: string;
      readonly serviceTitle: string;
      readonly extendedTimelineLabel: string;
      readonly educationEntries: readonly {
        readonly title: string;
        readonly period: string;
        readonly summary: string;
      }[];
      readonly communityHighlights: readonly {
        readonly title: string;
        readonly description: string;
        readonly bullets: readonly string[];
      }[];
      readonly serviceHighlights: readonly string[];
      readonly learningHighlights: readonly string[];
    };
  };
  readonly listingPages: {
    readonly home: {
      readonly path: string;
      readonly title: string;
      readonly searchDescription: string;
    };
    readonly about: {
      readonly path: string;
      readonly title: string;
      readonly heroTitle: string;
      readonly heroSubtitle: string;
      readonly metaDescription: string;
      readonly searchDescription: string;
    };
    readonly blog: {
      readonly path: string;
      readonly title: string;
      readonly searchDescription: string;
    };
    readonly projects: {
      readonly path: string;
      readonly title: string;
      readonly heroSubtitle: string;
      readonly metaDescription: string;
      readonly searchDescription: string;
    };
    readonly publications: {
      readonly path: string;
      readonly title: string;
      readonly heroSubtitle: string;
      readonly metaDescription: string;
      readonly searchDescription: string;
      readonly academicServicesTitle: string;
      readonly academicServicesDescription: string;
    };
    readonly talks: {
      readonly path: string;
      readonly title: string;
      readonly heroSubtitle: string;
      readonly metaDescription: string;
      readonly searchDescription: string;
    };
  };
}

const researchThemes: SiteCopy['home']['aboutSection']['themes'] = [
  {
    title: 'Behavior shaping',
    description:
      'Studying how model behavior changes under context engineering, prompting, supervised fine-tuning, and reinforcement fine-tuning.',
    icon: 'activity',
  },
  {
    title: 'Reasoning models',
    description:
      'Building and analyzing open reasoning models, including Thai and medical settings where reliability matters.',
    icon: 'layers',
  },
  {
    title: 'Evaluation and reliability',
    description:
      'Designing evaluations for structured outputs, failure analysis, robustness, and practical deployment risk.',
    icon: 'shield-check',
  },
  {
    title: 'Applied systems',
    description:
      'Turning research into usable tools, experiments, and prototypes for real teams and domain experts.',
    icon: 'globe',
  },
] as const;

const siteCopyEn: SiteCopy = {
  meta: {
    siteTitle: 'PETEPITTAWAT.DEV',
    description:
      'Researcher-builder working on language models, reasoning, evaluation, and AI systems. Writing, projects, publications, and talks by Pittawat Taveekitworachai.',
  },
  nav: {
    links: [
      { key: 'home', href: '/', label: 'Home' },
      { key: 'blog', href: '/blog', label: 'Blog' },
      { key: 'projects', href: '/projects', label: 'Projects' },
      { key: 'publications', href: '/publications', label: 'Publications' },
      { key: 'talks', href: '/talks', label: 'Talks' },
      { key: 'about', href: '/about', label: 'About' },
    ],
  },
  footer: {
    title: 'Research, engineering, and clear notes from the field.',
    summary:
      'I work across language models, evaluation, and systems-building, then publish the tools, talks, and technical writing that make the work easier to reuse.',
    webringLabel: 'Thai Webring',
  },
  home: {
    hero: {
      kicker: 'Research x Engineering x Design',
      title: "Hi, I'm Pete",
      intro:
        'I study how language models behave in practice, from prompting and context engineering to post-training and evaluation.',
      summary:
        'My recent work spans open reasoning models, medical reasoning systems, evaluation tooling, and the engineering patterns that make model behavior easier to inspect and improve.',
      focusLabel: 'Current focus',
      focusBody:
        'Reasoning models, post-training, evaluation, and inference-time strategies for systems that need to be useful beyond demos.',
      primaryCtas: [
        {
          href: '/projects',
          title: 'Research systems',
          description:
            'Selected projects across reasoning models, evaluation tooling, healthcare, and developer-facing prototypes.',
          ctaLabel: 'Explore projects',
          variant: 'primary',
          icon: 'rocket',
        },
        {
          href: '/blog',
          title: 'Working notes',
          description:
            'Essays and technical notes on prompting, agentic workflows, model behavior, and software practice.',
          ctaLabel: 'Read the blog',
          variant: 'secondary',
          icon: 'book-open',
        },
        {
          href: '/talks',
          title: 'Talks and workshops',
          description:
            'Conference talks, invited sessions, and practical walkthroughs on reasoning models and AI engineering.',
          ctaLabel: 'Browse talks',
          variant: 'ghost',
          icon: 'mic',
        },
      ],
    },
    aboutSection: {
      eyebrow: 'Research in practice',
      title: 'A researcher-builder working across models and systems',
      lead: 'I am Pittawat Taveekitworachai, a research scientist focused on making language models more reliable, steerable, and useful in real settings.',
      body: 'My work sits between research and implementation: building reasoning models, designing evaluations, studying post-training behavior, and turning findings into tools, prototypes, and public explanations.',
      ctaLabel: 'Learn more about my background',
      researchFocusTitle: 'Current research themes',
      researchFocusDescription:
        'The threads connecting my publications, open models, evaluation work, and collaborations.',
      themes: researchThemes,
      highlightsTitle: 'Recent ways this work shows up',
      highlightsDescription:
        'A mix of papers, public communication, open models, and tooling informed by current projects and collaborations.',
      highlights: [
        {
          title: 'Publications and writing',
          description:
            'Publishing on prompting, reasoning, and evaluation, while writing essays that connect research questions to practical engineering decisions.',
          icon: 'book-open',
        },
        {
          title: 'Talks and workshops',
          description:
            'Sharing lessons from reasoning models, context engineering, and applied AI systems through conferences, meetups, and research events.',
          icon: 'graduation-cap',
        },
        {
          title: 'Open models and tooling',
          description:
            'Contributing to open reasoning models, benchmarks, and evaluation tools that other teams can study, test, and extend.',
          icon: 'cpu',
        },
      ],
    },
    statsSection: {
      eyebrow: 'Selected output',
      title: 'What I publish, ship, and share',
      description:
        'Writing, research, and talks that document how model behavior changes under real constraints.',
      cards: [
        {
          key: 'posts',
          href: '/blog',
          ariaLabel: 'Read the blog',
          title: 'Blog posts',
          linkText: 'Read the blog',
          accentBgColor: 'var(--accent-blog)',
          description:
            'Essays, technical notes, and field observations on language models, agent workflows, and software practice.',
          icon: 'book-text',
        },
        {
          key: 'publications',
          href: '/publications',
          ariaLabel: 'View publications',
          title: 'Publications',
          linkText: 'View publications',
          accentBgColor: 'var(--accent-publications)',
          description:
            'Papers on prompting, reasoning, evaluation, game-related LLM work, and applied AI systems.',
          icon: 'scroll-text',
        },
        {
          key: 'talks',
          href: '/talks',
          ariaLabel: 'See talks',
          title: 'Talks',
          linkText: 'See talks',
          accentBgColor: 'var(--accent-talks)',
          description:
            'Conference talks, invited lectures, and workshops on reasoning models, evaluation, and AI engineering.',
          icon: 'mic',
        },
      ],
    },
    blogSection: {
      eyebrow: 'Latest writing',
      title: 'Recent notes from the research and engineering loop',
      description:
        'New essays on model behavior, evaluation, agentic workflows, and the practical details that show up while building.',
      browseLabel: 'Browse all articles',
      emptyLabel: 'No posts yet. New writing will appear here.',
    },
  },
  about: {
    hero: {
      title: 'About Pete',
      subtitle:
        'I work across language models, evaluation, systems-building, and technical communication.',
    },
    profile: {
      location: 'Bangkok',
      role: 'Research Scientist @ Typhoon',
      heading: "Hi, I'm Pittawat (Pete).",
      intro:
        'I work on making language models more reliable in practice, especially through behavior shaping, reasoning, evaluation, and the engineering work needed to turn research into usable systems.',
    },
    now: {
      title: 'Right now',
      items: [
        'Studying post-training and reasoning behavior in open language models.',
        'Investigating inference-time strategies, context engineering, and agentic workflows.',
        'Working on medical reasoning and robustness in collaboration with domain partners.',
        'Turning current research into talks, notes, and tooling that other teams can reuse.',
      ],
    },
    snapshot: {
      title: 'Snapshot',
      items: [
        {
          label: 'Current role',
          value: 'Research Scientist @ Typhoon',
          hint: 'Reasoning models, post-training, evaluation, and applied research collaborations.',
        },
        {
          label: 'Working style',
          value: 'Research to systems',
          hint: 'I like moving between ideas, experiments, implementation, and communication.',
        },
        {
          label: 'Base',
          value: 'Bangkok',
          hint: 'Working with regional and international collaborators.',
        },
      ],
    },
    themes: {
      title: 'What drives my work',
      description: 'The main themes connecting the papers, models, tools, and talks.',
      items: researchThemes,
    },
    background: {
      title: 'Background',
      description: 'How I got here and how the current work took shape.',
      notes: [
        'I am interested in how model behavior changes under human preferences, task constraints, domain requirements, and cultural context.',
        'My recent work concentrates on prompting, context engineering, reasoning, and post-training, especially when these techniques need to hold up outside controlled demos.',
        'Before focusing full-time on research, I spent years building software across mobile, web, data, and developer tooling. That background still shapes how I evaluate ideas: I care about whether they can be implemented, tested, and explained clearly.',
      ],
    },
    journey: {
      title: 'Timeline and milestones',
      description:
        'Education, collaborations, and the experiences that shaped how I approach research and engineering.',
      spotlightTitle: 'Spotlight milestones',
      educationTitle: 'Education',
      collaborationsTitle: 'Collaborations and community',
      serviceTitle: 'Service and learning habits',
      extendedTimelineLabel: 'Read the extended timeline',
      educationEntries: [
        {
          title: 'M.Eng., Intelligent Computer Entertainment Lab, Ritsumeikan University',
          period: '2022 — 2024',
          summary:
            'Valedictorian (4.93/5.00). Thesis: Null-Shot Prompting: Rethinking Prompting Large Language Models With Hallucination.',
        },
        {
          title: 'B.Sc. Computer Science, KMUTT',
          period: '2018 — 2022',
          summary:
            'First-class honours (3.99/4.00). Senior project: COEUS, automatic English mind map generation from text.',
        },
      ],
      communityHighlights: [
        {
          title: 'Research collaborations',
          description:
            'Working with academic, clinical, and industry partners on reasoning, prompting, and domain-specific applications.',
          bullets: [
            'Collaborations spanning Thai open models, medical reasoning, and applied evaluation.',
            'Projects that connect research questions to deployable prototypes, datasets, and benchmarks.',
          ],
        },
        {
          title: 'Technical communication',
          description:
            'I treat public explanation as part of the work, not as an afterthought once the work is done.',
          bullets: [
            'Sharing ideas through conference talks, meetups, blog posts, and internal research sessions.',
            'Mentoring collaborators and translating experiments into reusable notes, talks, and tooling.',
          ],
        },
      ],
      serviceHighlights: [
        'Previously led software projects and community efforts in healthcare, education, and student developer organizations.',
        'Regularly support research dissemination through talks, reviews, and technical collaboration.',
      ],
      learningHighlights: [
        'I like writing while I learn. It helps me test whether an idea is clear enough to teach and robust enough to reuse.',
        'I also value building small systems and tools around research because implementation often exposes the most important questions.',
      ],
    },
  },
  listingPages: {
    home: {
      path: '/',
      title: 'Home',
      searchDescription: 'Homepage overview, recent writing, and current research directions.',
    },
    about: {
      path: '/about',
      title: 'About',
      heroTitle: 'About Pete',
      heroSubtitle:
        'I work across language models, evaluation, systems-building, and technical communication.',
      metaDescription:
        'Background, research themes, education, and collaborations of Pittawat Taveekitworachai.',
      searchDescription:
        'Background, research themes, milestones, collaborations, and longer biographical context.',
    },
    blog: {
      path: '/blog',
      title: 'Blog',
      searchDescription: 'Articles, essays, and technical notes.',
    },
    projects: {
      path: '/projects',
      title: 'Projects',
      heroSubtitle:
        'Selected research systems, evaluation tooling, and prototypes across reasoning, healthcare, language technology, and developer workflows.',
      metaDescription:
        'Selected projects by Pittawat Taveekitworachai across language models, reasoning, evaluation, and applied systems.',
      searchDescription: 'Selected research systems, tooling, and prototypes.',
    },
    publications: {
      path: '/publications',
      title: 'Publications',
      heroSubtitle:
        'Papers on prompting, reasoning, evaluation, generative systems, and applied AI across research and domain collaborations.',
      metaDescription:
        'Publications by Pittawat Taveekitworachai on language models, prompting, reasoning, evaluation, and applied AI.',
      searchDescription: 'Research papers, proceedings, and other academic work.',
      academicServicesTitle: 'Academic service',
      academicServicesDescription: 'Reviewer and service roles across conferences and journals.',
    },
    talks: {
      path: '/talks',
      title: 'Talks',
      heroSubtitle:
        'Conference talks, invited lectures, and workshops on language models, reasoning, prompting, and AI engineering.',
      metaDescription:
        'Talks and workshops by Pittawat Taveekitworachai on language models, reasoning, and AI engineering.',
      searchDescription: 'Presentations, lectures, workshops, and invited sessions.',
    },
  },
};

const siteCopyByLocale: Partial<Record<SiteLocale, SiteCopy>> = {
  en: siteCopyEn,
};

export function getSiteCopy(locale: SiteLocale): SiteCopy {
  return siteCopyByLocale[locale] ?? siteCopyEn;
}

export { siteCopyEn };
