import { memo, type FC } from 'react';
import { cn } from '@/lib/utils';
import type { BlogTranslationLocale } from '@/lib/blog-translations';
import '@/styles/components/editorial-language-switcher.css';

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
  readonly tone?: 'default' | 'editorial' | undefined;
}

const TRACK_BY_VARIANT = {
  toolbar: 'language-switcher__track language-switcher__track--toolbar sm:min-w-fit',
  rail: 'language-switcher__track language-switcher__track--rail',
} as const;

const OPTION_BY_VARIANT = {
  toolbar: 'language-switcher__option language-switcher__option--toolbar',
  rail: 'language-switcher__option language-switcher__option--rail',
} as const;

const BlogLanguageSwitcherComponent: FC<BlogLanguageSwitcherProps> = ({
  options,
  ariaLabel,
  label,
  helperText,
  onSelect,
  className,
  variant = 'toolbar',
  tone = 'default',
}) => {
  const isEditorial = tone === 'editorial';

  const renderOption = (option: BlogLanguageSwitcherOption) => {
    const shortOptionLabel = option.shortLabel ?? option.label;
    const screenReaderLabel = option.screenReaderLabel ?? option.label;
    const optionClassName = cn(
      OPTION_BY_VARIANT[variant],
      option.isActive &&
        (isEditorial
          ? 'language-switcher__option--active-editorial'
          : 'border border-[color:var(--page-accent,var(--accent))]/35 bg-[linear-gradient(135deg,rgba(232,243,255,0.98),rgba(206,229,255,0.9))] text-slate-950 shadow-[0_16px_28px_-22px_rgba(170,214,255,0.95)]'),
      !option.isActive &&
        option.available &&
        (isEditorial
          ? 'language-switcher__option--available-editorial'
          : 'text-white/72 hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/8 hover:text-white'),
      !option.available &&
        (isEditorial
          ? 'language-switcher__option--disabled-editorial'
          : 'cursor-not-allowed text-white/30 opacity-55')
    );

    const content = (
      <>
        <span aria-hidden="true" className="language-switcher__short-label">
          {shortOptionLabel}
        </span>
        <span aria-hidden="true" className="language-switcher__full-label">
          {option.label}
        </span>
        <span className="sr-only">{screenReaderLabel}</span>
      </>
    );

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
          aria-current={option.isActive ? 'true' : undefined}
          className={optionClassName}
          aria-label={screenReaderLabel}
          data-locale={option.locale}
        >
          {content}
        </button>
      );
    }

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
        variant === 'toolbar' ? 'w-full sm:w-auto sm:min-w-fit' : 'w-full',
        isEditorial && 'language-switcher--editorial',
        className
      )}
    >
      {label ? (
        <span className="type-caption pl-1 font-semibold tracking-[0.28em] text-white/52 uppercase">
          {label}
        </span>
      ) : null}

      <div
        className={cn(
          TRACK_BY_VARIANT[variant],
          isEditorial && 'language-switcher__track--editorial'
        )}
      >
        {options.map(renderOption)}
      </div>

      {helperText ? (
        <p
          className={cn(
            'language-switcher__helper max-w-[24rem] text-sm leading-6',
            isEditorial ? 'editorial-results-info' : 'text-white/60'
          )}
        >
          {helperText}
        </p>
      ) : null}
    </nav>
  );
};

export const BlogLanguageSwitcher = memo(BlogLanguageSwitcherComponent);
BlogLanguageSwitcher.displayName = 'BlogLanguageSwitcher';

export default BlogLanguageSwitcher;
