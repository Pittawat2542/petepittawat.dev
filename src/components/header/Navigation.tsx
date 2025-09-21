import { BookOpenText, FileText, FolderKanban, Mic2, User2 } from 'lucide-react';

import type { FC } from 'react';
import HeaderLink from '@/components/header/HeaderLink';
import { memo } from 'react';

interface NavigationProps {
  readonly currentPath: string;
  readonly className?: string;
}

const NavigationComponent: FC<NavigationProps> = ({ currentPath, className }) => {
  const links = [
    { href: '/blog', label: 'Blog' },
    { href: '/projects', label: 'Projects' },
    { href: '/publications', label: 'Publications' },
    { href: '/talks', label: 'Talks' },
    { href: '/about', label: 'About' },
  ];

  const isActive = (href: string) =>
    currentPath === href || (href !== '/' && currentPath.startsWith(href + '/'));

  const getIcon = (label: string, isActive: boolean) => {
    if (!isActive) return null;
    
    const iconProps = { className: "h-4 w-4 opacity-80 shrink-0", "aria-hidden": true };
    
    switch (label) {
      case 'Blog':
        return <BookOpenText {...iconProps} />;
      case 'Projects':
        return <FolderKanban {...iconProps} />;
      case 'Publications':
        return <FileText {...iconProps} />;
      case 'Talks':
        return <Mic2 {...iconProps} />;
      case 'About':
        return <User2 {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <ul className={`ml-3 sm:ml-4 md:ml-6 hidden md:flex items-center gap-1 ${className || ''}`}>
      {links.map(({ href, label }) => (
        <li key={href}>
          <HeaderLink 
            href={href} 
            isActive={isActive(href)} 
            ariaLabel={label} 
            className="snap-start nav-link"
          >
            <span className="inline-flex items-center gap-1.5">
              {getIcon(label, isActive(href))}
              <span className="inline whitespace-nowrap">{label}</span>
            </span>
          </HeaderLink>
        </li>
      ))}
    </ul>
  );
};

export const Navigation = memo(NavigationComponent);
Navigation.displayName = 'Navigation';
export default Navigation;