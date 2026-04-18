import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-white/[0.04] border border-white/[0.03]",
        className,
      )}
    />
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0c0d0f] overflow-hidden">
      <Skeleton className="aspect-[16/10] w-full rounded-none border-0" />
      <div className="p-6 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-24 mt-3" />
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0c0d0f] overflow-hidden">
      <Skeleton className="aspect-[16/10] w-full rounded-none border-0" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14" />
        </div>
      </div>
    </div>
  );
}

export function ExperienceSkeleton() {
  return (
    <div className="space-y-3 py-8 border-t border-white/[0.06]">
      <div className="flex items-center gap-3">
        <Skeleton className="h-3 w-32" />
      </div>
      <Skeleton className="h-7 w-2/3" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
