import { cn } from "@/lib/utils";

interface AvatarProps {
  fallback: string;
  className?: string;
}

export function Avatar({ fallback, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex size-10 items-center justify-center rounded-full bg-blue text-sm font-semibold text-white",
        className,
      )}
    >
      {fallback}
    </div>
  );
}
