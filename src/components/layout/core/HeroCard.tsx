import React, { memo } from 'react';

interface HeroCardProps {
  readonly image: string;
  readonly url: string;
  readonly title: string;
  readonly description: string;
  readonly isReverse?: boolean;
}

const HeroCardComponent: React.FC<HeroCardProps> = ({ 
  image, 
  url, 
  title, 
  description, 
  isReverse = false 
}) => {
  return (
    <div className='flex-1 cursor-pointer rounded-2xl border border-border bg-card glass-card text-card-foreground shadow-sm transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out will-change-transform group'>
      <a
        className={`flex w-full flex-col p-8 lg:p-12 gap-8 pointer items-center${isReverse ? ' 2xl:flex-col-reverse' : ' 2xl:flex-col'}`}
        href={url}
      >
        <img
          className='flex-1 w-64 lg:w-72 h-64 lg:h-72 rounded-xl transition-transform duration-200 ease-out group-hover:scale-[1.02] will-change-transform object-cover'
          src={image}
          alt={title}
          loading="lazy"
        />
        <div className={`flex w-full flex-col flex-3 items-center 2xl:items-start h-full${isReverse ? ' 2xl:items-end' : ''}`}>
          <h1 className='text-2xl lg:text-3xl mb-4 font-bold tracking-tight'>{title}</h1>
          <p className={`text-base md:text-lg text-center xl:text-start text-[color:var(--white)] break-words hyphens-auto${isReverse ? ' 2xl:text-end' : ''}`}>
            {description}
          </p>
        </div>
      </a>
    </div>
  );
};

const HeroCard = memo(HeroCardComponent);
HeroCard.displayName = 'HeroCard';

export default HeroCard;
export { HeroCard };