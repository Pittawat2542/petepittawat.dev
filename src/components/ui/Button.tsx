import React from 'react';

type Variant = 'pill';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const styles: Record<Variant, string> = {
  pill:
    'rounded-full px-3 py-1.5 text-sm bg-[color:var(--black-nav)]/80 text-[color:var(--white)] ring-1 ring-[color:var(--white)]/10 hover:ring-[color:var(--accent)] hover:text-[color:var(--accent)]',
};

export default function Button({ variant = 'pill', className = '', ...props }: Props) {
  return (
    <button
      className={[styles[variant], 'transition-colors duration-200 ease-in-out', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
