import './button.css';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Mail,
  Plus,
  Search,
} from 'lucide-react';
import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { memo } from 'react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children?: ReactNode;
  readonly href?: string;
  readonly variant?: 'primary' | 'secondary' | 'ghost';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly as?: 'button' | 'a';
  readonly icon?:
    | 'external'
    | 'arrow-right'
    | 'chevron-right'
    | 'chevron-left'
    | 'search'
    | 'download'
    | 'plus'
    | 'mail';
  readonly iconPosition?: 'left' | 'right';
  readonly iconOnly?: boolean;
  readonly autoIcon?: boolean;
  readonly target?: string;
  readonly download?: string;
}

const GlassButtonComponent: FC<GlassButtonProps> = ({
  children,
  className,
  href,
  variant = 'primary',
  size = 'md',
  as = href ? 'a' : 'button',
  icon,
  iconPosition = 'right',
  iconOnly = false,
  autoIcon = true,
  target,
  download,
  ...rest
}) => {
  const getVariantClasses = (
    variant: 'primary' | 'secondary' | 'ghost',
    size: 'sm' | 'md' | 'lg'
  ) => {
    return cn(
      'site-button',
      `site-button--${variant}`,
      size === 'sm' && 'site-button--sm',
      size === 'lg' && 'site-button--lg',
      iconOnly && 'site-button--icon'
    );
  };

  const isExternalHref = (u?: string) => !!u && /^(https?:)?\/\//i.test(u);

  const pickAutoIcon = (): GlassButtonProps['icon'] | undefined => {
    if (!autoIcon) return undefined;
    if (as === 'a' && href) {
      if (download || /\.(pdf|zip|dmg|pkg|exe|apk|ipa|csv|xlsx?)$/i.test(href)) return 'download';
      if (target === '_blank' || isExternalHref(href)) return 'external';
    }
    return undefined;
  };

  const finalIcon = icon ?? pickAutoIcon();

  const iconComponents = {
    external: ExternalLink,
    'arrow-right': ArrowRight,
    'chevron-right': ChevronRight,
    'chevron-left': ChevronLeft,
    search: Search,
    download: Download,
    plus: Plus,
    mail: Mail,
  } as const;
  const IconComponent = finalIcon ? iconComponents[finalIcon] : undefined;

  const commonProps = {
    className: cn(getVariantClasses(variant, size), className),
    'data-variant': variant,
  };

  const iconElement = IconComponent && <IconComponent aria-hidden="true" className="h-4 w-4" />;

  const content = (
    <>
      {iconPosition === 'left' && iconElement}
      {!iconOnly && children}
      {iconPosition === 'right' && iconElement}
    </>
  );

  if (as === 'a') {
    return (
      <a href={href} target={target} download={download} {...commonProps}>
        {content}
      </a>
    );
  }

  return (
    <button {...commonProps} {...rest}>
      {content}
    </button>
  );
};

export const GlassButton = memo(GlassButtonComponent);
GlassButton.displayName = 'GlassButton';
export default GlassButton;
