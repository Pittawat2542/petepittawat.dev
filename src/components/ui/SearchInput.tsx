import { useId } from 'react';
import { Search } from 'lucide-react';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
};

export default function SearchInput({ value, onChange, placeholder = 'Search…', ariaLabel = 'Search', className = '' }: Props) {
  const id = useId();
  return (
    <label className={`relative w-full md:max-w-md ${className}`} htmlFor={id}>
      <span className="sr-only">{ariaLabel}</span>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70" size={16} aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        id={id}
        aria-label={ariaLabel}
        title={ariaLabel}
        className="w-full pl-9 pr-3 py-2 text-sm bg-transparent rounded-md border border-input text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </label>
  );
}
