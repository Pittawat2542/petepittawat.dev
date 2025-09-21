import type { FC } from 'react';
import { memo } from 'react';

const BlogCardOverlaysComponent: FC = () => {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(160deg,rgba(69,105,255,0.12),rgba(16,24,40,0.65))] opacity-0 transition-opacity duration-500 group-hover:opacity-80" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[linear-gradient(135deg,rgba(59,130,246,0.14)_0%,rgba(139,92,246,0.08)_40%,transparent_100%)]" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(120%_120%_at_80%_-10%,rgba(255,255,255,0.16),transparent)] opacity-0 transition-opacity duration-700 group-hover:opacity-90" />
      <div className="pointer-events-none absolute -top-24 -right-20 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(106,193,255,0.36),transparent_62%)] blur-3xl opacity-70 transition-all duration-500 group-hover:scale-110" />
    </>
  );
};

// Memoize the component (no props to compare)
export const BlogCardOverlays = memo(BlogCardOverlaysComponent);
BlogCardOverlays.displayName = 'BlogCardOverlays';
export default BlogCardOverlays;