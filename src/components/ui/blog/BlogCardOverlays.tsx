import type { FC } from 'react';
import { memo } from 'react';

const BlogCardOverlaysComponent: FC = () => {
  return (
    <>
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(155deg,rgba(37,58,109,0.45),rgba(11,18,36,0.55))] opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(130deg,rgba(59,130,246,0.16)_0%,rgba(129,140,248,0.12)_38%,rgba(244,114,182,0.1)_70%,transparent_100%)] opacity-40 transition-opacity duration-500 group-hover:opacity-80" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(120%_120%_at_78%_-10%,rgba(255,255,255,0.18),transparent)] opacity-0 transition-opacity duration-600 group-hover:opacity-80" />
      <div className="pointer-events-none absolute -top-28 -right-24 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.35),transparent_70%)] opacity-60 blur-3xl transition-all duration-500 group-hover:scale-110" />
    </>
  );
};

// Memoize the component (no props to compare)
export const BlogCardOverlays = memo(BlogCardOverlaysComponent);
BlogCardOverlays.displayName = 'BlogCardOverlays';
export default BlogCardOverlays;
