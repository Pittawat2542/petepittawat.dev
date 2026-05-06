import { memo, type FC } from 'react';
import { cn } from '@/lib/utils';
import type { BlogTranslationLocale } from '@/lib/blog-translations';

export interface BlogLanguageSwitcherOption {
  readonly locale: BlogTranslationLocale;
  readonly label: string;
  readonly shortLabel?: string | undefined;
  readonly href?: string | undefined;
  readonly available: boolean;
  readonly isActive: boolean;
  readonly screenReaderLabel?: string | undefined;
}

interface BlogLanguageSwitcherProps {
  readonly options: readonly BlogLanguageSwitcherOption[];
  readonly ariaLabel: string;
  readonly label?: string | undefined;
  readonly helperText?: string | undefined;
  readonly onSelect?: ((locale: BlogTranslationLocale) => void) | undefined;
  readonly className?: string | undefined;
  readonly variant?: 'toolbar' | 'rail';
}

const TRACK_BY_VARIANT = {
  toolbar:
    'inline-flex min-w-fit items-center gap-1 rounded-[1.25rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-1 shadow-[0_14px_34px_-22px_rgba(4,10,24,0.82)] backdrop-blur-xl',
  rail: 'grid grid-cols-2 gap-1 rounded-[1.35rem] border border-white/10 bg-[linear-gradient(145deg,rgba(10,18,34,0.9),rgba(8,14,28,0.7))] p-1 shadow-[0_22px_48px_-32px_rgba(4,10,24,0.92)] backdrop-blur-xl',
} as const;

const OPTION_BY_VARIANT = {
  toolbar: 'min-w-[4.5rem] px-3 py-2 text-xs sm:min-w-[5.4rem]',
  rail: 'min-w-0 px-3 py-2.5 text-sm',
} as const;

const BlogLanguageSwitcherComponent: FC<BlogLanguageSwitcherProps> = ({
  options,
  ariaLabel,
  label,
  helperText,
  onSelect,
  className,
  variant = 'toolbar',
}) => {
  const renderOption = (option: BlogLanguageSwitcherOption) => {
    const optionLabel = option.shortLabel ?? option.label;
    const screenReaderLabel = option.screenReaderLabel ?? option.label;
    const optionClassName = cn(
      'group/blog-language relative inline-flex items-center justify-center rounded-[1rem] font-semibold tracking-[0.16em] uppercase transition-[transform,color,background-color,border-color,box-shadow,opacity] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--page-accent,var(--accent))]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(4,8,16,0.92)]',
      OPTION_BY_VARIANT[variant],
      option.isActive &&
        'border border-[color:var(--page-accent,var(--accent))]/35 bg-[linear-gradient(135deg,rgba(232,243,255,0.98),rgba(206,229,255,0.9))] text-slate-950 shadow-[0_16px_28px_-22px_rgba(170,214,255,0.95)]',
      !option.isActive &&
        option.available &&
        'border border-transparent text-white/72 hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/8 hover:text-white',
      !option.available && 'cursor-not-allowed text-white/30 opacity-55'
    );

    const content = (
      <>
        <span aria-hidden="true" className="sm:hidden">
          {option.shortLabel ?? optionLabel}
        </span>
        <span className="hidden sm:inline">{optionLabel}</span>
        <span className="sr-only">{screenReaderLabel}</span>
      </>
    );

    if (option.isActive) {
      return (
        <span
          key={option.locale}
          aria-current="true"
          className={optionClassName}
          data-locale={option.locale}
        >
          {content}
        </span>
      );
    }

    if (!option.available) {
      return (
        <span
          key={option.locale}
          aria-disabled="true"
          className={optionClassName}
          data-locale={option.locale}
        >
          {content}
        </span>
      );
    }

    if (onSelect) {
      return (
        <button
          key={option.locale}
          type="button"
          onClick={() => {
            onSelect(option.locale);
          }}
          className={optionClassName}
          aria-label={screenReaderLabel}
          data-locale={option.locale}
        >
          {content}
        </button>
      );
    }

    return (
      <a
        key={option.locale}
        href={option.href}
        className={optionClassName}
        aria-label={screenReaderLabel}
        data-locale={option.locale}
      >
        {content}
      </a>
    );
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        'flex flex-col gap-2',
        variant === 'toolbar' ? 'min-w-fit' : 'w-full',
        className
      )}
    >
      {label ? (
        <span className="pl-1 text-[0.68rem] font-semibold tracking-[0.28em] text-white/52 uppercase">
          {label}
        </span>
      ) : null}

      <div className={TRACK_BY_VARIANT[variant]}>{options.map(renderOption)}</div>

      {helperText ? (
        <p className="max-w-[24rem] text-sm leading-6 text-white/60">{helperText}</p>
      ) : null}
    </nav>
  );
};

export const BlogLanguageSwitcher = memo(BlogLanguageSwitcherComponent);
BlogLanguageSwitcher.displayName = 'BlogLanguageSwitcher';

export default BlogLanguageSwitcher;
