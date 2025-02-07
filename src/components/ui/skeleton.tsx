import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "card" | "text" | "avatar" | "button";
}

export function Skeleton({
  className,
  variant = "text",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50",
        {
          "h-4 w-full": variant === "text",
          "h-10 w-10 rounded-full": variant === "avatar",
          "h-10 w-28": variant === "button",
          "h-48 w-full": variant === "card",
        },
        className
      )}
      {...props}
    />
  )
}
