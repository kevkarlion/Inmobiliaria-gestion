export function BlogPostCardSkeleton() {
  return (
    <div className="rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[16/10] bg-neutral-200 dark:bg-neutral-800" />

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Category + reading time */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 rounded-full bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3 w-12 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-5 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>

        {/* Excerpt */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-3.5 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>

        {/* Date */}
        <div className="h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-800 mt-1" />
      </div>
    </div>
  );
}
