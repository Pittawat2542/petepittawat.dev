export type SiteLocale = 'en' | 'th';

export type SiteNavLinkKey = 'home' | 'blog' | 'projects' | 'publications' | 'talks' | 'about';
export type HeroCtaIcon = 'rocket' | 'book-open' | 'book-text' | 'scroll-text' | 'mic';
export type HeroCtaVariant = 'primary' | 'secondary' | 'ghost';
export type HeroTopicIcon = 'brain' | 'activity' | 'bar-chart-3' | 'network';
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
    readonly webringLabel: string;
  };
  readonly home: {
    readonly hero: {
      readonly kicker: string;
      readonly title: string;
      readonly intro: string;
      readonly summary: string;
      readonly ctaHeading: string;
      readonly topics: readonly {
        readonly label: string;
        readonly icon: HeroTopicIcon;
      }[];
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
    readonly intro: {
      readonly eyebrow: string;
      readonly title: string;
      readonly subtitle: string;
      readonly role: string;
      readonly location: string;
      readonly summary: string;
    };
    readonly proofPoints: {
      readonly title: string;
      readonly items: readonly {
        readonly label: string;
        readonly value: string;
        readonly hint: string;
      }[];
    };
    readonly focusAreas: {
      readonly title: string;
      readonly description: string;
      readonly items: SiteCopy['home']['aboutSection']['themes'];
    };
    readonly currentWork: {
      readonly title: string;
      readonly description: string;
      readonly items: readonly string[];
      readonly collaborationTitle: string;
      readonly collaborationPoints: readonly string[];
      readonly communicationTitle: string;
      readonly communicationPoints: readonly string[];
    };
    readonly milestones: {
      readonly title: string;
      readonly description: string;
      readonly spotlightTitle: string;
      readonly educationTitle: string;
      readonly extendedTimelineLabel: string;
      readonly educationEntries: readonly {
        readonly title: string;
        readonly period: string;
        readonly summary: string;
      }[];
    };
    readonly background: {
      readonly title: string;
      readonly description: string;
      readonly paragraphs: readonly string[];
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

const researchThemesTh: SiteCopy['home']['aboutSection']['themes'] = [
  {
    title: 'การกำหนดพฤติกรรมโมเดล',
    description:
      'ศึกษาว่าพฤติกรรมของโมเดลเปลี่ยนไปอย่างไรภายใต้ context engineering การพรอมป์ต supervised fine-tuning และ reinforcement fine-tuning',
    icon: 'activity',
  },
  {
    title: 'โมเดลให้เหตุผล',
    description:
      'สร้างและวิเคราะห์โมเดลให้เหตุผลแบบเปิด ทั้งในบริบทภาษาไทยและงานทางการแพทย์ที่ความน่าเชื่อถือมีความสำคัญสูง',
    icon: 'layers',
  },
  {
    title: 'การประเมินผลและความน่าเชื่อถือ',
    description:
      'ออกแบบการประเมินผลสำหรับ structured output การวิเคราะห์ความล้มเหลว ความทนทาน และความเสี่ยงในการนำไปใช้งานจริง',
    icon: 'shield-check',
  },
  {
    title: 'ระบบประยุกต์',
    description:
      'เปลี่ยนงานวิจัยให้กลายเป็นเครื่องมือ การทดลอง และต้นแบบที่ทีมงานและผู้เชี่ยวชาญโดเมนสามารถนำไปใช้ต่อได้',
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
    webringLabel: 'Thai Webring',
  },
  home: {
    hero: {
      kicker: 'Research x Engineering x Design',
      title: "Hi, I'm Pete",
      intro: 'I study how language models acquire and express behavior.',
      summary: 'Focused on reasoning models, post-training, evaluation, and agentic systems.',
      ctaHeading: 'Explore my work',
      topics: [
        { label: 'Reasoning Models', icon: 'brain' },
        { label: 'Post-Training', icon: 'activity' },
        { label: 'Evaluation', icon: 'bar-chart-3' },
        { label: 'Agentic Systems', icon: 'network' },
      ],
      primaryCtas: [
        {
          href: '/publications',
          title: 'Publications',
          description: 'Peer-reviewed papers, preprints, and research outputs.',
          ctaLabel: 'View publications',
          variant: 'primary',
          icon: 'scroll-text',
        },
        {
          href: '/blog',
          title: 'Blog',
          description: 'Posts and technical essays on ideas, experiments, and lessons.',
          ctaLabel: 'Read blog',
          variant: 'secondary',
          icon: 'book-text',
        },
        {
          href: '/talks',
          title: 'Talks & Workshops',
          description: 'Conference talks, invited sessions, and workshop materials.',
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
    intro: {
      eyebrow: 'Researcher, builder, communicator',
      title: 'About Pete',
      subtitle:
        'I work across language models, evaluation, systems-building, and technical communication.',
      role: 'Research Scientist @ Typhoon',
      location: 'Bangkok',
      summary:
        'I work on making language models more reliable in practice, especially through behavior shaping, reasoning, evaluation, and the engineering work needed to turn research into usable systems.',
    },
    proofPoints: {
      title: 'At a glance',
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
    focusAreas: {
      title: 'What drives my work',
      description: 'The main themes connecting the papers, models, tools, and talks.',
      items: researchThemes,
    },
    currentWork: {
      title: 'What I am working on now',
      description:
        'The current work mixes language-model research with the engineering and communication needed to make that work useful to other people.',
      items: [
        'Studying post-training and reasoning behavior in open language models.',
        'Investigating inference-time strategies, context engineering, and agentic workflows.',
        'Working on medical reasoning and robustness in collaboration with domain partners.',
        'Turning current research into talks, notes, and tooling that other teams can reuse.',
      ],
      collaborationTitle: 'How I tend to collaborate',
      collaborationPoints: [
        'I work with academic, clinical, and industry partners on reasoning, prompting, and domain-specific applications.',
        'I like projects that connect research questions to deployable prototypes, datasets, and evaluation workflows.',
        'My default mode is moving between ideas, experiments, implementation, and communication instead of treating them as separate jobs.',
      ],
      communicationTitle: 'How I communicate the work',
      communicationPoints: [
        'I treat public explanation as part of the work, not as an afterthought once the work is done.',
        'I regularly turn experiments into talks, blog posts, internal research sessions, and reusable notes.',
        'I like writing while I learn because it tests whether an idea is clear enough to teach and robust enough to reuse.',
      ],
    },
    milestones: {
      title: 'Selected milestones',
      description:
        'A short view of the education, work, and research moments that shaped how I approach language models and systems-building.',
      spotlightTitle: 'Spotlight milestones',
      educationTitle: 'Education',
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
    },
    background: {
      title: 'Background',
      description: 'The longer arc behind the current research and engineering work.',
      paragraphs: [
        'I am interested in how model behavior changes under human preferences, task constraints, domain requirements, and cultural context.',
        'My recent work concentrates on prompting, context engineering, reasoning, and post-training, especially when these techniques need to hold up outside controlled demos.',
        'Before focusing full-time on research, I spent years building software across mobile, web, data, and developer tooling. That background still shapes how I evaluate ideas: I care about whether they can be implemented, tested, and explained clearly.',
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

const siteCopyTh: SiteCopy = {
  meta: {
    siteTitle: 'PETEPITTAWAT.DEV',
    description:
      'นักวิจัยและนักพัฒนาที่ทำงานด้านโมเดลภาษา การให้เหตุผล การประเมินผล และระบบ AI รวมงานเขียน โปรเจกต์ ผลงานตีพิมพ์ และงานบรรยายของ Pittawat Taveekitworachai',
  },
  nav: {
    links: [
      { key: 'home', href: '/', label: 'หน้าแรก' },
      { key: 'blog', href: '/blog', label: 'บล็อก' },
      { key: 'projects', href: '/projects', label: 'โปรเจกต์' },
      { key: 'publications', href: '/publications', label: 'ผลงานตีพิมพ์' },
      { key: 'talks', href: '/talks', label: 'งานบรรยาย' },
      { key: 'about', href: '/about', label: 'เกี่ยวกับ' },
    ],
  },
  footer: {
    title: 'งานวิจัย วิศวกรรม และบันทึกจากภาคสนามที่เล่าให้ชัด',
    webringLabel: 'วงแหวนเว็บไทย',
  },
  home: {
    hero: {
      kicker: 'วิจัย x วิศวกรรม x ออกแบบ',
      title: 'สวัสดีครับ ผมพีท',
      intro: 'ผมศึกษาว่าโมเดลภาษาเรียนรู้และแสดงพฤติกรรมออกมาอย่างไร',
      summary: 'โฟกัสที่โมเดลให้เหตุผล post-training การประเมินผล และระบบ agentic',
      ctaHeading: 'สำรวจผลงาน',
      topics: [
        { label: 'Reasoning Models', icon: 'brain' },
        { label: 'Post-Training', icon: 'activity' },
        { label: 'Evaluation', icon: 'bar-chart-3' },
        { label: 'Agentic Systems', icon: 'network' },
      ],
      primaryCtas: [
        {
          href: '/publications',
          title: 'ผลงานตีพิมพ์',
          description: 'บทความวิชาการ พรีพรินต์ และผลงานวิจัย',
          ctaLabel: 'ดูผลงานตีพิมพ์',
          variant: 'primary',
          icon: 'scroll-text',
        },
        {
          href: '/blog',
          title: 'บล็อก',
          description: 'บทความและบันทึกเชิงเทคนิคเกี่ยวกับไอเดีย การทดลอง และบทเรียน',
          ctaLabel: 'อ่านบล็อก',
          variant: 'secondary',
          icon: 'book-text',
        },
        {
          href: '/talks',
          title: 'งานบรรยายและเวิร์กช็อป',
          description: 'งานบรรยาย เซสชันรับเชิญ และสื่อเวิร์กช็อป',
          ctaLabel: 'ดูงานบรรยาย',
          variant: 'ghost',
          icon: 'mic',
        },
      ],
    },
    aboutSection: {
      eyebrow: 'งานวิจัยในภาคปฏิบัติ',
      title: 'นักวิจัยและนักพัฒนาที่ทำงานคร่อมระหว่างโมเดลกับระบบ',
      lead: 'ผมคือ Pittawat Taveekitworachai นักวิจัยที่สนใจทำให้โมเดลภาษามีความน่าเชื่อถือ ควบคุมทิศทางได้ และใช้งานได้จริงมากขึ้น',
      body: 'งานของผมอยู่กึ่งกลางระหว่างงานวิจัยและการลงมือทำ ตั้งแต่การสร้างโมเดลให้เหตุผล ออกแบบการประเมินผล ศึกษาพฤติกรรมหลัง post-training ไปจนถึงแปลงผลลัพธ์ให้เป็นเครื่องมือ ต้นแบบ และคำอธิบายสาธารณะที่นำไปใช้ต่อได้',
      ctaLabel: 'ดูประวัติและแนวทางการทำงานเพิ่มเติม',
      researchFocusTitle: 'ธีมวิจัยในปัจจุบัน',
      researchFocusDescription:
        'เส้นเรื่องหลักที่เชื่อมงานตีพิมพ์ โมเดลแบบเปิด งานประเมินผล และความร่วมมือต่าง ๆ เข้าด้วยกัน',
      themes: researchThemesTh,
      highlightsTitle: 'งานเหล่านี้แสดงออกมาอย่างไรในช่วงหลัง',
      highlightsDescription:
        'ส่วนผสมของงานตีพิมพ์ การสื่อสารสาธารณะ โมเดลแบบเปิด และเครื่องมือที่เติบโตมาจากโปรเจกต์และความร่วมมือปัจจุบัน',
      highlights: [
        {
          title: 'ผลงานตีพิมพ์และงานเขียน',
          description:
            'ตีพิมพ์งานด้าน prompting reasoning และ evaluation ควบคู่กับการเขียนบทความที่เชื่อมคำถามวิจัยเข้ากับการตัดสินใจเชิงวิศวกรรม',
          icon: 'book-open',
        },
        {
          title: 'งานบรรยายและเวิร์กช็อป',
          description:
            'ถ่ายทอดบทเรียนจากโมเดลให้เหตุผล context engineering และระบบ AI ประยุกต์ผ่านงานประชุม มีตอัป และกิจกรรมวิจัย',
          icon: 'graduation-cap',
        },
        {
          title: 'โมเดลแบบเปิดและเครื่องมือ',
          description:
            'มีส่วนร่วมกับโมเดลให้เหตุผลแบบเปิด benchmark และเครื่องมือประเมินผลที่ทีมอื่นสามารถศึกษา ทดสอบ และต่อยอดได้',
          icon: 'cpu',
        },
      ],
    },
    statsSection: {
      eyebrow: 'ผลงานที่เผยแพร่',
      title: 'สิ่งที่ผมเผยแพร่ สร้าง และแบ่งปัน',
      description:
        'งานเขียน งานวิจัย และงานบรรยายที่บันทึกว่า พฤติกรรมของโมเดลเปลี่ยนไปอย่างไรเมื่อเจอข้อจำกัดจริง',
      cards: [
        {
          key: 'posts',
          href: '/blog',
          ariaLabel: 'อ่านบล็อก',
          title: 'บทความบล็อก',
          linkText: 'อ่านบล็อก',
          accentBgColor: 'var(--accent-blog)',
          description:
            'บทความ ความเห็นเชิงเทคนิค และบันทึกภาคสนามเกี่ยวกับโมเดลภาษา agent workflow และการพัฒนาซอฟต์แวร์',
          icon: 'book-text',
        },
        {
          key: 'publications',
          href: '/publications',
          ariaLabel: 'ดูผลงานตีพิมพ์',
          title: 'ผลงานตีพิมพ์',
          linkText: 'ดูผลงานตีพิมพ์',
          accentBgColor: 'var(--accent-publications)',
          description:
            'งานตีพิมพ์ด้าน prompting reasoning evaluation งาน LLM ที่เกี่ยวกับเกม และระบบ AI ประยุกต์',
          icon: 'scroll-text',
        },
        {
          key: 'talks',
          href: '/talks',
          ariaLabel: 'ดูงานบรรยาย',
          title: 'งานบรรยาย',
          linkText: 'ดูงานบรรยาย',
          accentBgColor: 'var(--accent-talks)',
          description:
            'งานบรรยายในงานประชุม บรรยายรับเชิญ และเวิร์กช็อปด้านโมเดลให้เหตุผล การประเมินผล และ AI engineering',
          icon: 'mic',
        },
      ],
    },
    blogSection: {
      eyebrow: 'งานเขียนล่าสุด',
      title: 'บันทึกล่าสุดจากวงจรวิจัยและวิศวกรรม',
      description:
        'บทความใหม่เกี่ยวกับพฤติกรรมของโมเดล การประเมินผล agentic workflow และรายละเอียดเชิงปฏิบัติที่เจอระหว่างการลงมือสร้างจริง',
      browseLabel: 'ดูบทความทั้งหมด',
      emptyLabel: 'ยังไม่มีบทความใหม่ในตอนนี้ งานเขียนถัดไปจะปรากฏที่นี่',
    },
  },
  about: {
    intro: {
      eyebrow: 'นักวิจัย นักสร้างระบบ และผู้สื่อสารเชิงเทคนิค',
      title: 'เกี่ยวกับพีท',
      subtitle: 'ผมทำงานคร่อมระหว่างโมเดลภาษา การประเมินผล การสร้างระบบ และการสื่อสารเชิงเทคนิค',
      role: 'Research Scientist @ Typhoon',
      location: 'กรุงเทพฯ',
      summary:
        'ผมทำงานเพื่อให้โมเดลภาษามีความน่าเชื่อถือมากขึ้นในการใช้งานจริง โดยเฉพาะผ่านการกำหนดพฤติกรรมของโมเดล งานด้าน reasoning การประเมินผล และงานวิศวกรรมที่จำเป็นต่อการแปลงงานวิจัยให้กลายเป็นระบบที่ใช้งานได้',
    },
    proofPoints: {
      title: 'ภาพรวมแบบสั้น',
      items: [
        {
          label: 'บทบาทปัจจุบัน',
          value: 'Research Scientist @ Typhoon',
          hint: 'ทำงานด้านโมเดลให้เหตุผล post-training การประเมินผล และความร่วมมือวิจัยเชิงประยุกต์',
        },
        {
          label: 'สไตล์การทำงาน',
          value: 'จากงานวิจัยสู่ระบบ',
          hint: 'ผมชอบขยับไปมาระหว่างไอเดีย การทดลอง การลงมือทำ และการอธิบายให้ชัด',
        },
        {
          label: 'ฐานการทำงาน',
          value: 'กรุงเทพฯ',
          hint: 'ทำงานร่วมกับพาร์ตเนอร์ทั้งในภูมิภาคและต่างประเทศ',
        },
      ],
    },
    focusAreas: {
      title: 'อะไรคือแรงขับของงานผม',
      description: 'ธีมหลักที่เชื่อมงานตีพิมพ์ โมเดล เครื่องมือ และงานบรรยายเข้าด้วยกัน',
      items: researchThemesTh,
    },
    currentWork: {
      title: 'ตอนนี้กำลังทำอะไรอยู่',
      description:
        'งานปัจจุบันของผมผสมทั้งการวิจัยด้าน language model เข้ากับงานวิศวกรรมและการสื่อสารที่ทำให้งานเหล่านั้นมีคุณค่าต่อคนอื่นจริง',
      items: [
        'ศึกษาพฤติกรรมหลัง post-training และการให้เหตุผลในโมเดลภาษาแบบเปิด',
        'สำรวจกลยุทธ์ช่วง inference, context engineering และ agentic workflow',
        'ทำงานด้าน medical reasoning และความทนทานของโมเดลร่วมกับพาร์ตเนอร์ในโดเมน',
        'เปลี่ยนงานวิจัยปัจจุบันให้กลายเป็นงานบรรยาย บันทึก และเครื่องมือที่ทีมอื่นนำไปใช้ต่อได้',
      ],
      collaborationTitle: 'รูปแบบการทำงานร่วมกับผู้อื่น',
      collaborationPoints: [
        'ผมทำงานร่วมกับพาร์ตเนอร์จากภาควิชาการ คลินิก และอุตสาหกรรมในประเด็นด้าน reasoning, prompting และงานประยุกต์เฉพาะโดเมน',
        'ผมชอบโปรเจกต์ที่เชื่อมคำถามวิจัยเข้ากับต้นแบบ ชุดข้อมูล และ workflow การประเมินผลที่ใช้งานต่อได้จริง',
        'วิธีทำงานตามธรรมชาติของผมคือขยับไปมาระหว่างไอเดีย การทดลอง การลงมือทำ และการสื่อสาร มากกว่ามองสิ่งเหล่านี้เป็นงานแยกส่วน',
      ],
      communicationTitle: 'วิธีที่ผมสื่อสารงาน',
      communicationPoints: [
        'สำหรับผม การอธิบายงานสู่สาธารณะเป็นส่วนหนึ่งของงาน ไม่ใช่สิ่งที่ค่อยทำทีหลังเมื่อทุกอย่างเสร็จแล้ว',
        'ผมมักแปลงผลการทดลองให้กลายเป็นงานบรรยาย บล็อกโพสต์ เซสชันวิจัยภายใน และบันทึกที่ผู้อื่นนำไปใช้ต่อได้',
        'ผมชอบเขียนไปพร้อมกับการเรียนรู้ เพราะมันช่วยทดสอบว่าไอเดียนั้นชัดพอจะสอนได้หรือยัง และแข็งแรงพอจะนำไปใช้ต่อได้หรือไม่',
      ],
    },
    milestones: {
      title: 'หมุดหมายสำคัญ',
      description:
        'มุมมองแบบย่อของช่วงการศึกษา งาน และจุดเปลี่ยนที่หล่อหลอมวิธีคิดของผมต่อภาษาโมเดลและการสร้างระบบ',
      spotlightTitle: 'หมุดหมายสำคัญ',
      educationTitle: 'การศึกษา',
      extendedTimelineLabel: 'ดูไทม์ไลน์แบบเต็ม',
      educationEntries: [
        {
          title: 'M.Eng., Intelligent Computer Entertainment Lab, Ritsumeikan University',
          period: '2022 — 2024',
          summary:
            'จบอันดับหนึ่งของรุ่น (4.93/5.00) วิทยานิพนธ์: Null-Shot Prompting: Rethinking Prompting Large Language Models With Hallucination',
        },
        {
          title: 'B.Sc. Computer Science, KMUTT',
          period: '2018 — 2022',
          summary:
            'จบเกียรตินิยมอันดับหนึ่ง (3.99/4.00) โปรเจกต์จบ: COEUS ระบบสร้าง mind map ภาษาอังกฤษจากข้อความโดยอัตโนมัติ',
        },
      ],
    },
    background: {
      title: 'ภูมิหลัง',
      description: 'ภาพรวมระยะยาวที่อยู่เบื้องหลังงานวิจัยและงานวิศวกรรมที่ผมทำในปัจจุบัน',
      paragraphs: [
        'ผมสนใจว่าพฤติกรรมของโมเดลเปลี่ยนไปอย่างไรภายใต้ความต้องการของมนุษย์ ข้อจำกัดของงาน ข้อกำหนดเฉพาะโดเมน และบริบททางวัฒนธรรม',
        'งานช่วงหลังของผมเน้นไปที่ prompting, context engineering, reasoning และ post-training โดยเฉพาะเมื่อเทคนิคเหล่านี้ต้องใช้งานได้จริงนอกเหนือจากเดโมที่ควบคุมสภาพแวดล้อมไว้',
        'ก่อนจะมาทำงานวิจัยเต็มตัว ผมใช้เวลาหลายปีสร้างซอฟต์แวร์ทั้งฝั่ง mobile, web, data และ developer tooling พื้นฐานเหล่านี้ยังมีอิทธิพลต่อวิธีคิดของผมเสมอ เพราะผมสนใจว่างานหนึ่ง ๆ จะถูกนำไปสร้าง ทดสอบ และอธิบายต่อได้ดีแค่ไหน',
      ],
    },
  },
  listingPages: {
    home: {
      path: '/',
      title: 'หน้าแรก',
      searchDescription: 'ภาพรวมหน้าแรก งานเขียนล่าสุด และทิศทางการวิจัยในปัจจุบัน',
    },
    about: {
      path: '/about',
      title: 'เกี่ยวกับ',
      heroTitle: 'เกี่ยวกับพีท',
      heroSubtitle:
        'ผมทำงานคร่อมระหว่างโมเดลภาษา การประเมินผล การสร้างระบบ และการสื่อสารเชิงเทคนิค',
      metaDescription: 'ภูมิหลัง ธีมวิจัย การศึกษา และความร่วมมือของ Pittawat Taveekitworachai',
      searchDescription:
        'ภูมิหลัง ธีมวิจัย หมุดหมายสำคัญ ความร่วมมือ และบริบทเชิงชีวประวัติที่ละเอียดขึ้น',
    },
    blog: {
      path: '/blog',
      title: 'บล็อก',
      searchDescription: 'บทความ ข้อเขียน และบันทึกเชิงเทคนิค',
    },
    projects: {
      path: '/projects',
      title: 'โปรเจกต์',
      heroSubtitle:
        'คัดเลือกโปรเจกต์ด้านระบบวิจัย เครื่องมือประเมินผล และต้นแบบที่ครอบคลุม reasoning เฮลท์แคร์ language technology และ workflow สำหรับนักพัฒนา',
      metaDescription:
        'คัดเลือกโปรเจกต์ของ Pittawat Taveekitworachai ด้านโมเดลภาษา reasoning การประเมินผล และระบบ AI ประยุกต์',
      searchDescription: 'โปรเจกต์ระบบวิจัย เครื่องมือ และต้นแบบที่คัดเลือกมา',
    },
    publications: {
      path: '/publications',
      title: 'ผลงานตีพิมพ์',
      heroSubtitle:
        'งานตีพิมพ์ด้าน prompting reasoning evaluation ระบบเชิงกำเนิด และ AI ประยุกต์ที่เกิดจากทั้งงานวิจัยและความร่วมมือเฉพาะโดเมน',
      metaDescription:
        'ผลงานตีพิมพ์ของ Pittawat Taveekitworachai ด้านโมเดลภาษา prompting reasoning evaluation และ AI ประยุกต์',
      searchDescription: 'งานวิจัย บทความประชุมวิชาการ และผลงานทางวิชาการอื่น ๆ',
      academicServicesTitle: 'งานรับใช้วิชาการ',
      academicServicesDescription: 'บทบาทผู้รีวิวและงานรับใช้วิชาชีพในงานประชุมและวารสาร',
    },
    talks: {
      path: '/talks',
      title: 'งานบรรยาย',
      heroSubtitle:
        'งานบรรยายในงานประชุม บรรยายรับเชิญ และเวิร์กช็อปด้านโมเดลภาษา reasoning prompting และ AI engineering',
      metaDescription:
        'งานบรรยายและเวิร์กช็อปของ Pittawat Taveekitworachai ด้านโมเดลภาษา reasoning และ AI engineering',
      searchDescription: 'การบรรยาย เวิร์กช็อป และเซสชันรับเชิญต่าง ๆ',
    },
  },
};

const siteCopyByLocale: Partial<Record<SiteLocale, SiteCopy>> = {
  en: siteCopyEn,
  th: siteCopyTh,
};

export function getSiteCopy(locale: SiteLocale): SiteCopy {
  return siteCopyByLocale[locale] ?? siteCopyEn;
}

export { siteCopyEn };
