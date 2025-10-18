import { BookOpenText, FileText, FolderKanban, Mic2, User2 } from 'lucide-react';
import { SITE_TITLE } from '@/lib/constants';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import type { FC } from 'react';
import { HeaderActions } from '@/components/ui/header/HeaderActions';
import { MobileMenu } from '@/components/ui/header/MobileMenu';
import { NavigationLinks } from '@/components/ui/header/NavigationLinks';
import { cn } from '@/lib/utils';

interface NavLink {
  readonly href: string;
  readonly label: string;
  readonly icon: typeof BookOpenText;
}

const NAVIGATION_LINKS: readonly NavLink[] = [
  { href: '/blog', label: 'Blog', icon: BookOpenText },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/publications', label: 'Publications', icon: FileText },
  { href: '/talks', label: 'Talks', icon: Mic2 },
  { href: '/about', label: 'About', icon: User2 },
] as const;

const AnimatedHeaderComponent: FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePath, setActivePath] = useState('/');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const normalizePath = useCallback((path: string) => {
    return (
      path
        .replace(/\/index\.html$/, '/')
        .replace(/\.html$/, '')
        .replace(/\/+$/, '') || '/'
    );
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setActivePath(normalizePath(window.location.pathname));
  }, [normalizePath]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    };

    const mq = window.matchMedia('(min-width: 768px)');
    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMobileOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    let detachMedia: (() => void) | undefined;
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handleMediaChange);
      detachMedia = () => mq.removeEventListener('change', handleMediaChange);
    }

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      detachMedia?.();
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const isActive = useCallback(
    (href: string) => activePath === href || (href !== '/' && activePath.startsWith(`${href}/`)),
    [activePath]
  );

  const handleToggleMobile = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  const handleCloseMobile = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const headerClasses = useMemo(
    () =>
      cn(
        'fixed inset-x-0 top-4 z-50 px-4 md:px-6 lg:px-8 transition-[opacity,transform] duration-500 ease-[var(--motion-ease-decelerate, ease-out)]',
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
      ),
    [mounted]
  );

  return (
    <header
      className={headerClasses}
      style={{ viewTransitionName: 'site-header' }}
      data-mounted={mounted || undefined}
    >
      <div
        id="site-nav-wrapper"
        className="shape-squircle mx-auto max-w-6xl rounded-3xl border border-transparent transition-[border-color,box-shadow,backdrop-filter,transform] duration-[var(--motion-duration-normal)] ease-[var(--motion-ease-decelerate)]"
        data-scrolled={scrolled ? 'true' : undefined}
      >
        {/* Animated background that expands from center */}
        <div
          className="shape-squircle absolute inset-0 rounded-3xl bg-transparent transition-transform duration-700 ease-[var(--motion-ease-decelerate)]"
          style={{
            transform: mounted ? 'scaleX(1)' : 'scaleX(0.6)',
            transformOrigin: '50% 50%',
          }}
          aria-hidden="true"
        />

        <nav
          id="site-nav"
          className="relative flex items-center gap-6 px-4 py-3 sm:px-6 sm:py-4 md:gap-4 md:px-5 lg:gap-6"
          data-scrolled={scrolled ? 'true' : undefined}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Brand */}
          <a
            href="/"
            aria-label="Go to homepage"
            className="shape-squircle-sm relative flex items-center gap-3 rounded-[1.2rem] px-2 py-1 text-white transition-colors hover:text-white/90 focus-visible:ring-2 focus-visible:ring-[color:var(--accent,#6AC1FF)]/60 focus-visible:outline-none"
          >
            <span data-brand className="relative flex h-9 w-9 items-center justify-center">
              <span className="brand-shape absolute inset-0 rounded-full" aria-hidden="true" />
              <span className="brand-glow absolute inset-0 rounded-full" aria-hidden="true" />
              <span className="brand-glyph relative flex h-full w-full items-center justify-center">
                <svg
                  className="h-[18px] w-[18px] text-white"
                  viewBox="0 0 512 512"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M114 188h150v110c0 24-6 42-18 55s-28 19-48 19c-20 0-35-6-48-19-12-13-18-31-18-55v-57h-18v-53Zm64 53v57c0 10 2 18 6 22 4 5 9 7 16 7h12c7 0 12-2 16-7s6-12 6-22v-57h-56Zm123-53h152v110c0 24-6 42-18 55-12 13-28 19-48 19s-36-6-48-19c-12-13-18-31-18-55v-57h-18v-53Zm64 53v57c0 10 2 18 6 22s9 7 16 7h12c7 0 12-2 16-7 4-4 6-12 6-22v-57h-56Z"
                  />
                </svg>
              </span>
            </span>
            <span className="hidden text-sm font-medium tracking-tight text-white lg:block lg:text-base">
              {SITE_TITLE}
            </span>
          </a>

          {/* Navigation links */}
          <NavigationLinks links={NAVIGATION_LINKS} isActive={isActive} />

          {/* Search button and mobile menu toggle */}
          <HeaderActions mobileOpen={mobileOpen} onToggleMobile={handleToggleMobile} />
        </nav>
      </div>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={handleCloseMobile}
        links={NAVIGATION_LINKS}
        isActive={isActive}
      />
    </header>
  );
};

// Memoized component for performance optimization
export const AnimatedHeader = memo(AnimatedHeaderComponent);
AnimatedHeader.displayName = 'AnimatedHeader';

// Default export for backward compatibility
export default AnimatedHeader;
