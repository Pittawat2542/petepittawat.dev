/**
 * Represents an artifact associated with a publication
 */
export interface Artifact {
  /** Display label for the artifact */
  readonly label: string;
  /** URL to the artifact */
  readonly href: string;
}

/**
 * Represents an academic publication
 */
export interface Publication {
  /** Publication year */
  readonly year: number;
  /** Type of publication */
  readonly type: 'journal' | 'conference' | 'preprint' | (string & {});
  /** Title of the publication */
  readonly title: string;
  /** Authors of the publication */
  readonly authors: string;
  /** Venue where the publication appeared */
  readonly venue: string;
  /** URL to the publication */
  readonly url: string | null;
  /** Associated artifacts (e.g., PDF, code, dataset) */
  readonly artifacts: readonly Artifact[];
  /** Tags for categorization */
  readonly tags: readonly string[];
  /** Abstract of the publication */
  readonly abstract?: string;
}

/**
 * Represents a resource associated with a talk
 */
export interface TalkResource {
  /** Display label for the resource */
  readonly label: string;
  /** URL to the resource */
  readonly href: string;
  /** Whether the resource can be downloaded */
  readonly download?: boolean;
}

/**
 * Represents a talk or presentation
 */
export interface Talk {
  /** Date of the talk in ISO format */
  readonly date: string;
  /** Title of the talk */
  readonly title: string;
  /** Audience for the talk */
  readonly audience: string;
  /** URL to the audience's website */
  readonly audienceUrl: string | null;
  /** Mode of delivery */
  readonly mode: 'online' | 'on-site' | 'hybrid' | (string & {});
  /** Associated resources */
  readonly resources: readonly TalkResource[];
  /** Tags for categorization */
  readonly tags: readonly string[];
}

// Use Astro's built-in CollectionEntry type for consistency
export type BlogPost = import('astro:content').CollectionEntry<'blog'>;

/**
 * Represents a link associated with a project
 */
export interface ProjectLink {
  /** Display label for the link */
  readonly label: string;
  /** URL of the link */
  readonly href: string;
}

/**
 * Represents a project
 */
export interface Project {
  /** Year the project was created or completed */
  readonly year: number;
  /** Title of the project */
  readonly title: string;
  /** Summary description of the project */
  readonly summary: string;
  /** Tags for categorization */
  readonly tags: readonly string[];
  /** Associated links */
  readonly links: readonly ProjectLink[];
  /** Role in the project */
  readonly role?: string;
  /** Collaborators on the project */
  readonly collaborators?: string;
  /** Type of project */
  readonly type?: string;
}
