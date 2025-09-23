import { BookOpenText, FileText, FolderKanban, Mic2, User2 } from 'lucide-react';
import type { FC } from 'react';
import { memo } from 'react';

import HeaderLink from '@/components/header/HeaderLink';

interface NavigationProps {
  readonly currentPath: string;
  readonly className?: string;
}

const NavigationComponent: FC<NavigationProps> = ({ currentPath, className }) => {
  const links = [
    { href: '/blog', label: 'Blog', Icon: BookOpenText },
    { href: '/projects', label: 'Projects', Icon: FolderKanban },
    { href: '/publications', label: 'Publications', Icon: FileText },
    { href: '/talks', label: 'Talks', Icon: Mic2 },
    { href: '/about', label: 'About', Icon: User2 },
  ];

  const isActive = (href: string) =>
    currentPath === href || (href !== '/' && currentPath.startsWith(href + '/'));

  return (
    <ul className={`ml-3 hidden items-center gap-1 sm:ml-4 md:ml-6 md:flex ${className || ''}`}>
      {links.map(({ href, label, Icon }) => {
        const active = isActive(href);
        const iconClasses = [
          'nav-link__icon h-5 w-5 rounded-full border border-[color:var(--white)]/8 bg-[color:var(--white)]/5 text-[color:var(--white)]/70',
          'transition-all duration-300 ease-out',
          'group-hover/nav:border-[color:var(--white)]/18 group-hover/nav:bg-[color:var(--white)]/12 group-hover/nav:text-[color:var(--white)]/92',
          active
            ? 'text-[color:var(--accent,#6bc1ff)] border-[color:var(--accent,#6bc1ff)]/45 bg-[color:var(--accent,#6bc1ff)]/18 shadow-[0_0_12px_rgba(106,193,255,0.35)]'
            : '',
        ].join(' ');

        return (
          <li key={href}>
            <HeaderLink
              href={href}
              isActive={active}
              ariaLabel={`Navigate to ${label}`}
              className="snap-start"
            >
              <span className="nav-link__content inline-flex items-center gap-2 whitespace-nowrap">
                <span className={iconClasses} aria-hidden="true">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span className="nav-link__label">
                  <span className="leading-tight tracking-[0.01em]">{label}</span>
                  <span className="nav-link__pulse" aria-hidden="true" />
                </span>
              </span>
            </HeaderLink>
          </li>
        );
      })}
    </ul>
  );
};

export const Navigation = memo(NavigationComponent);
Navigation.displayName = 'Navigation';
export default Navigation;
