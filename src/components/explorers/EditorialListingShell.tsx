import type { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import FilterPanel from '@/components/ui/filter/FilterPanel';
import PageControls from '@/components/ui/navigation/PageControls';

interface PaginationConfig {
  readonly total: number;
  readonly visible: number;
  readonly perPage: number;
  readonly onPerPageChange: (value: number) => void;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
}

interface EditorialListingShellProps {
  readonly searchValue: string;
  readonly onSearchChange: (value: string) => void;
  readonly searchPlaceholder: string;
  readonly filters: Record<string, string>;
  readonly onFiltersChange: (
    updater: (prev: Record<string, string>) => Record<string, string>
  ) => void;
  readonly filterOptions: Record<string, readonly string[]>;
  readonly sortOptions: ReadonlyArray<{ readonly value: string; readonly label: string }>;
  readonly sortValue?: string | undefined;
  readonly onSortChange?: ((value: string) => void) | undefined;
  readonly filteredResults: number;
  readonly totalResults: number;
  readonly availableTags?: readonly string[] | undefined;
  readonly selectedTags?: Set<string> | undefined;
  readonly onTagsChange?: ((updater: (prev: Set<string>) => Set<string>) => void) | undefined;
  readonly tagCounts?: Record<string, number> | undefined;
  readonly toolbarAccessory?: ReactNode;
  readonly children: ReactNode;
  readonly footer?: ReactNode;
  readonly emptyState?: ReactNode;
  readonly pagination?: PaginationConfig | undefined;
  readonly itemsWrapperElement?: 'div' | 'ul' | 'section' | undefined;
  readonly itemsWrapperClassName?: string | undefined;
  readonly className?: string | undefined;
}

export const EditorialListingShell: FC<EditorialListingShellProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters,
  onFiltersChange,
  filterOptions,
  sortOptions,
  sortValue,
  onSortChange,
  filteredResults,
  totalResults,
  availableTags,
  selectedTags,
  onTagsChange,
  tagCounts,
  toolbarAccessory,
  children,
  footer,
  emptyState,
  pagination,
  itemsWrapperElement = 'div',
  itemsWrapperClassName,
  className,
}) => {
  const ItemsWrapper = itemsWrapperElement;

  return (
    <section className={cn('flex w-full flex-col', className)}>
      <FilterPanel
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        onFiltersChange={onFiltersChange}
        filterOptions={filterOptions}
        availableTags={availableTags}
        selectedTags={selectedTags}
        onTagsChange={onTagsChange}
        tagCounts={tagCounts}
        sortOptions={sortOptions}
        sortValue={sortValue}
        onSortChange={onSortChange}
        filteredResults={filteredResults}
        totalResults={totalResults}
        compact
        tone="editorial"
        toolbarAccessory={toolbarAccessory}
      />

      <ItemsWrapper
        className={cn(
          'mt-6 grid w-full grid-cols-1 gap-5 py-2 md:grid-cols-2 md:gap-7 md:py-3 2xl:grid-cols-3',
          itemsWrapperClassName
        )}
      >
        {children}
      </ItemsWrapper>

      {filteredResults === 0 ? emptyState : null}
      {footer}

      {pagination && pagination.totalPages > 1 ? (
        <PageControls
          total={pagination.total}
          visible={pagination.visible}
          perPage={pagination.perPage}
          onPerPageChange={pagination.onPerPageChange}
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      ) : null}
    </section>
  );
};

EditorialListingShell.displayName = 'EditorialListingShell';

export default EditorialListingShell;
