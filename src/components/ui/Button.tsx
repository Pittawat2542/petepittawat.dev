import React from 'react';

type Variant = 'pill' | 'ghost' | 'primary';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const styles: Record<Variant, string> = {
  primary:
    'rounded-lg px-4 py-2 bg-[color:var(--accent)] text-black hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[color:var(--accent)]',
  ghost:
    'rounded-lg px-3 py-2 bg-transparent text-[color:var(--white)] hover:bg-[color:var(--white)]/5 ring-1 ring-[color:var(--white)]/10',
  pill:
    'rounded-full px-3 py-1.5 text-sm bg-[color:var(--black-nav)]/80 text-[color:var(--white)] ring-1 ring-[color:var(--white)]/10 hover:ring-[color:var(--accent)] hover:text-[color:var(--accent)]',
};

export default function Button({ variant = 'primary', className = '', ...props }: Props) {
  return (
    <button
      className={[styles[variant], 'transition-colors duration-200 ease-in-out', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  );
}
