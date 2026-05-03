import type { SimpleIcon } from 'simple-icons';
import { siGithub, siGooglescholar, siInstagram, siOrcid } from 'simple-icons';

export interface FooterSocialLink {
  href: string;
  label: string;
  brandIcon?: SimpleIcon;
  customIcon?: 'linkedin';
}

export const socialLinks: FooterSocialLink[] = [
  { href: 'https://github.com/Pittawat2542', label: 'GitHub', brandIcon: siGithub },
  { href: 'https://www.linkedin.com/in/pittawat-tav/', label: 'LinkedIn', customIcon: 'linkedin' },
  { href: 'https://www.instagram.com/pete.pittawat/', label: 'Instagram', brandIcon: siInstagram },
  {
    href: 'https://scholar.google.co.jp/citations?user=2CFoP9cAAAAJ&hl=en',
    label: 'Google Scholar',
    brandIcon: siGooglescholar,
  },
  { href: 'https://orcid.org/0000-0002-6824-2634', label: 'ORCID', brandIcon: siOrcid },
];
