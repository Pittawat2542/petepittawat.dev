import { memo, type FC } from 'react';
import { cn } from '@/lib/utils';

interface HeroCardProps {
  readonly image: string;
  readonly url: string;
  readonly title: string;
  readonly description: string;
  readonly isReverse?: boolean;
}

const HeroCardComponent: FC<HeroCardProps> = ({
  image,
  url,
  title,
  description,
  isReverse = false,
}) => {
  return (
    <div className="border-border bg-card glass-card text-card-foreground group flex-1 cursor-pointer rounded-2xl border shadow-sm transition-[transform,box-shadow,border-color,background-color] duration-200 ease-out will-change-transform">
      <a
        className={cn(
          'pointer flex w-full flex-col items-center gap-8 p-8 lg:p-12',
          isReverse ? '2xl:flex-col-reverse' : '2xl:flex-col'
        )}
        href={url}
      >
        <img
          className="h-64 w-64 flex-1 rounded-xl object-cover transition-transform duration-200 ease-out will-change-transform group-hover:scale-[1.02] lg:h-72 lg:w-72"
          src={image}
          alt={title}
          loading="lazy"
        />
        <div
          className={cn(
            'flex h-full w-full flex-3 flex-col items-center 2xl:items-start',
            isReverse && '2xl:items-end'
          )}
        >
          <h1 className="mb-4 text-2xl font-bold tracking-tight lg:text-3xl">{title}</h1>
          <p
            className={cn(
              'text-center text-base break-words hyphens-auto text-[color:var(--white)] md:text-lg xl:text-start',
              isReverse && '2xl:text-end'
            )}
          >
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
