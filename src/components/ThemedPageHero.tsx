import React, { type ReactNode, memo } from 'react';

interface ThemedPageHeroProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly page: string;
  readonly children?: ReactNode;
}

const ThemedPageHeroComponent: React.FC<ThemedPageHeroProps> = ({ 
  title, 
  subtitle, 
  page, 
  children 
}) => {
  return (
    <>
      <div 
        className="relative overflow-hidden rounded-3xl p-6 md:p-10 mb-6 max-w-6xl mx-auto"
        style={{ 
          borderColor: `color-mix(in oklab, var(--accent-${page}) 20%, transparent)` 
        }}
      >
        {/* Enhanced abstract swirling background with more layers */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {/* Swirling gradient layers */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{ 
              background: `radial-gradient(ellipse at center, color-mix(in oklab, var(--accent-${page}) 20%, transparent) 0%, transparent 70%)` 
            }}
          />
          
          {/* Animated blobs */}
          <div 
            className="blob-swirl-1 absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-20"
            style={{ 
              background: `conic-gradient(from 0deg at 50% 50%, color-mix(in oklab, var(--accent-${page}) 60%, transparent), color-mix(in oklab, var(--white) 30%, transparent), color-mix(in oklab, var(--accent-${page}) 60%, transparent))`,
              animation: 'swirl 25s linear infinite'
            }}
          />
          
          <div 
            className="blob-swirl-2 absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-15"
            style={{ 
              background: `conic-gradient(from 120deg at 50% 50%, color-mix(in oklab, var(--white) 40%, transparent), color-mix(in oklab, var(--accent-${page}) 30%, transparent), color-mix(in oklab, var(--white) 40%, transparent))`,
              animation: 'swirl-reverse 30s linear infinite'
            }}
          />
          
          <div 
            className="blob-swirl-3 absolute -top-1/2 -left-1/2 w-[200%] h-[200%] opacity-25"
            style={{ 
              background: `conic-gradient(from 240deg at 50% 50%, color-mix(in oklab, var(--accent-${page}) 40%, transparent), color-mix(in oklab, var(--white) 20%, transparent), color-mix(in oklab, var(--accent-${page}) 40%, transparent))`,
              animation: 'swirl 35s linear infinite'
            }}
          />
          
          {/* Center glow */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-30"
            style={{ 
              background: `radial-gradient(circle, color-mix(in oklab, var(--accent-${page}) 70%, transparent), transparent 70%)` 
            }}
          />
        </div>

        <div className="relative text-center py-4 md:py-6">
          <h1 
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight"
            style={{ 
              background: `linear-gradient(to right, var(--accent-${page}), var(--white), var(--accent-${page}))`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-base md:text-lg lg:text-xl text-[color:var(--white)]/90 max-w-2xl mx-auto font-medium leading-relaxed">
              {subtitle}
            </p>
          )}
          {children && (
            <div className="mt-5 md:mt-6 flex items-center justify-center gap-3">
              {children}
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes swirl {
            0% { transform: rotate(0deg) scale(1); }
            100% { transform: rotate(360deg) scale(1); }
          }
          
          @keyframes swirl-reverse {
            0% { transform: rotate(0deg) scale(1); }
            100% { transform: rotate(-360deg) scale(1); }
          }
          
          @keyframes pulse-slow {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
          }
          
          .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
          }
          
          @media (prefers-reduced-motion: reduce) {
            .blob-swirl-1, .blob-swirl-2, .blob-swirl-3 {
              animation: none !important;
            }
            .animate-pulse-slow {
              animation: none !important;
            }
          }
        `
      }} />
    </>
  );
};

const ThemedPageHero = memo(ThemedPageHeroComponent);
ThemedPageHero.displayName = 'ThemedPageHero';

export default ThemedPageHero;
export { ThemedPageHero };