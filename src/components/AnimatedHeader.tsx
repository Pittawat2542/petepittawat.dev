import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpenText, FolderKanban, FileText, Mic2, User2, Search, Menu, X } from 'lucide-react';
import HeaderLink from './HeaderLink';
import { SITE_TITLE } from '../consts';
import { openSearch } from '../scripts/openSearch';

const links = [
  { href: '/blog', label: 'Blog', icon: BookOpenText },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/publications', label: 'Publications', icon: FileText },
  { href: '/talks', label: 'Talks', icon: Mic2 },
  { href: '/about', label: 'About', icon: User2 },
];

export default function AnimatedHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePath, setActivePath] = useState('/');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const normalizePath = useCallback((path: string) => {
    return path
      .replace(/\/index\.html$/, '/')
      .replace(/\.html$/, '')
      .replace(/\/+$/, '') || '/';
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setActivePath(normalizePath(window.location.pathname));
  }, [normalizePath]);

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
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(handleMediaChange);
      detachMedia = () => mq.removeListener(handleMediaChange);
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

  return (
    <motion.header 
      className="fixed inset-x-0 top-4 z-50 px-4 md:px-6 lg:px-8" 
      style={{ viewTransitionName: 'site-header' }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
    >
      <div 
        id="site-nav-wrapper"
        className={`mx-auto max-w-6xl rounded-3xl border transition-all duration-300 ease-out ${
          scrolled 
            ? 'border-white/8 bg-black/50 backdrop-blur-lg shadow-[0_20px_40px_-30px_rgba(10,20,30,0.8)]' 
            : 'border-transparent'
        }`}
        data-scrolled={scrolled}
      >
        {/* Animated background that expands from center */}
        <motion.div
          className="absolute inset-0 rounded-3xl bg-transparent"
          initial={{ scaleX: 0, originX: 0.5 }}
          animate={{ scaleX: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
        />
        
        <nav id="site-nav" className="relative flex items-center gap-6 px-4 sm:px-6 py-3 sm:py-4">
          {/* Brand */}
          <a href="/" aria-label="Go to homepage"
             className="relative flex items-center gap-3 rounded-full px-2 py-1 text-white transition-colors hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent,#6AC1FF)]/60">
            <span data-brand className="relative flex h-9 w-9 items-center justify-center">
              <span className="brand-shape absolute inset-0 rounded-full"></span>
              <span className="brand-glow absolute inset-0 rounded-full"></span>
              <span className="brand-glyph relative flex h-full w-full items-center justify-center">
                <svg className="h-[18px] w-[18px] text-white" viewBox="0 0 512 512" fill="none" aria-hidden="true">
                  <path fill="currentColor" d="M114 188h150v110c0 24-6 42-18 55s-28 19-48 19c-20 0-35-6-48-19-12-13-18-31-18-55v-57h-18v-53Zm64 53v57c0 10 2 18 6 22 4 5 9 7 16 7h12c7 0 12-2 16-7s6-12 6-22v-57h-56Zm123-53h152v110c0 24-6 42-18 55-12 13-28 19-48 19s-36-6-48-19c-12-13-18-31-18-55v-57h-18v-53Zm64 53v57c0 10 2 18 6 22s9 7 16 7h12c7 0 12-2 16-7 4-4 6-12 6-22v-57h-56Z"/>
                </svg>
              </span>
            </span>
            <span className="hidden text-base font-medium tracking-tight text-white sm:block">{SITE_TITLE}</span>
          </a>

          {/* Navigation links */}
          <div className="relative hidden flex-1 items-center justify-center md:flex">
            <ul id="nav-list" className="relative flex items-center gap-1 text-sm font-medium text-white/70">
              {links.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <HeaderLink href={href} isActive={isActive(href)} ariaLabel={label} className="nav-pill">
                    <span className="flex items-center gap-2 transition-colors rounded-full">
                      <Icon className="h-4 w-4 opacity-80" aria-hidden="true" />
                      <span>{label}</span>
                    </span>
                  </HeaderLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Search button */}
          <div className="relative ml-auto flex items-center gap-2 md:ml-0 md:flex md:flex-1 md:justify-end">
            <button 
              id="search-button" 
              onClick={openSearch}
              className="relative flex items-center gap-3 rounded-full px-2 py-1 text-white transition-colors hover:text-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent,#6AC1FF)]/60"
            >
              <Search className="h-5 w-5 opacity-80" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white/80 transition-all hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent,#6AC1FF)]/60 md:hidden"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-controls="mobile-nav-panel"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              className="md:hidden fixed inset-0 z-40 bg-[color:var(--black-nav,#020617)]/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              id="mobile-nav-panel"
              role="dialog"
              aria-modal="false"
              className="md:hidden fixed inset-x-4 top-[calc(env(safe-area-inset-top)+4.5rem)] z-50"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <div className="rounded-3xl border border-white/12 bg-black/80 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <ul className="flex flex-col gap-2">
                  {links.map(({ href, label, icon: Icon }) => (
                    <li key={href}>
                      <HeaderLink
                        href={href}
                        isActive={isActive(href)}
                        ariaLabel={label}
                        className="w-full justify-start px-5 py-3 text-base"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Icon className="h-5 w-5 opacity-80" aria-hidden="true" />
                        <span>{label}</span>
                      </HeaderLink>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
