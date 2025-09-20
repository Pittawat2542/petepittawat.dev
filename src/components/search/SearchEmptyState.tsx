interface Suggestion {
  id: string;
  title: string;
  url: string;
}

interface SearchEmptyStateProps {
  suggestions: Suggestion[];
}

export function SearchEmptyState({ suggestions }: Readonly<SearchEmptyStateProps>) {
  return (
    <div className="px-3 py-4 text-sm text-muted-foreground">
      <p className="mb-2">No results. Try a different query or explore:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <a
            key={suggestion.id}
            href={suggestion.url}
            className="rounded-full px-3 py-1 border border-white/10 hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            {suggestion.title}
          </a>
        ))}
      </div>
    </div>
  );
}