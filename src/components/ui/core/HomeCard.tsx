import React, { memo } from 'react';

interface CardProps {
  readonly href: string;
  readonly ariaLabel: string;
  readonly title: string;
  readonly count: number;
  readonly linkText: string;
  readonly icon: string;
  readonly accentColor: string;
}

const HomeCardComponent: React.FC<CardProps> = ({ 
  href, 
  ariaLabel, 
  title, 
  count, 
  linkText, 
  icon, 
  accentColor 
}) => {
  return (
    <li className='h-full'>
      <a 
        href={href} 
        aria-label={ariaLabel}
        className='group block h-full glass-card rounded-3xl p-5 md:p-6 transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out will-change-transform'
      >
        <figure className='relative'>
          {/* Enhanced glass frame with gradient accents */}
          <div 
            className='rounded-2xl p-3 glass-surface' 
            style={{
              background: `linear-gradient(135deg, var(--${accentColor})/5 0%, transparent 50%)`
            }}
          >
            <div className='aspect-[3/4] w-full overflow-hidden rounded-xl glass-surface-elevated flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-200 ease-out will-change-transform'>
              <div 
                className='h-full w-full flex items-center justify-center relative' 
                dangerouslySetInnerHTML={{ __html: icon }}
              >
                {/* Subtle gradient overlay */}
                <div 
                  className='absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200'
                  style={{
                    background: `linear-gradient(45deg, var(--${accentColor})/10, transparent)`
                  }}
                />
              </div>
            </div>
          </div>
          {/* Enhanced glow effect */}
          <div 
            className='pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100'
            style={{
              background: `radial-gradient(circle at center, var(--${accentColor})/20, transparent 70%)`,
              boxShadow: `0 0 0 1px var(--${accentColor})/30, 0 20px 60px -20px var(--${accentColor})/40`
            }}
          />
        </figure>

        <div className='mt-5 text-center space-y-2'>
          <p 
            className='text-xs tracking-wider uppercase font-semibold'
            style={{
              color: `var(--${accentColor})`,
              opacity: 0.9
            }}
          >
            {title}
          </p>
          <p 
            className={`text-4xl font-bold tracking-tight bg-gradient-to-br from-[color:var(--${accentColor})] via-[color:var(--${accentColor})]/80 to-[color:var(--${accentColor})]/60 bg-clip-text text-transparent group-hover:from-[color:var(--${accentColor})]/90 group-hover:to-[color:var(--${accentColor})]/70 transition-colors duration-150`}
          >
            {count}
          </p>
          <div 
            className='glass-surface rounded-full px-3 py-1.5 mt-3 inline-block'
            style={{
              background: `linear-gradient(135deg, var(--${accentColor})/8 0%, var(--${accentColor})/4 100%)`
            }}
          >
            <span 
              className='text-sm font-medium group-hover:font-semibold transition-[color,font-weight] duration-150'
              style={{
                color: `var(--${accentColor})`
              }}
            >
              {linkText}
            </span>
          </div>
        </div>
      </a>
    </li>
  );
};

const HomeCard = memo(HomeCardComponent);
HomeCard.displayName = 'HomeCard';

export default HomeCard;
export { HomeCard };