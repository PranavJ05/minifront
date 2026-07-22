import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  textClassName?: string;
  shortTextOnMobile?: boolean;
}

export default function Logo({
  href = "/",
  className,
  size = "md",
  showText = true,
  textClassName,
  shortTextOnMobile = false,
}: LogoProps) {
  const iconBoxSize =
    size === "sm"
      ? "p-1.5 rounded-lg shrink-0"
      : size === "lg"
        ? "p-2.5 rounded-xl shrink-0"
        : "p-2 rounded-lg shrink-0";

  const iconSize =
    size === "sm"
      ? "h-4 w-4"
      : size === "lg"
        ? "h-6 w-6"
        : "h-5 w-5";

  const textSize =
    size === "sm"
      ? "text-sm font-bold tracking-tight"
      : size === "lg"
        ? "text-xl font-bold tracking-tight"
        : "text-base font-bold tracking-tight";

  const content = (
    <div className={cn("flex items-center gap-2.5 group cursor-pointer", className)}>
      <div
        className={cn(
          "bg-primary text-primary-foreground shadow-xs transition-all group-hover:bg-primary/90 flex items-center justify-center",
          iconBoxSize
        )}
      >
        <GraduationCap className={iconSize} />
      </div>
      {showText && (
        <span className={cn("leading-tight", textClassName)}>
          {shortTextOnMobile ? (
            <>
              <span className="sm:hidden font-bold text-foreground" style={{ fontSize: size === "sm" ? "0.875rem" : size === "lg" ? "1.25rem" : "1rem" }}>ARC</span>
              <span className="hidden sm:flex flex-col">
                <span className={cn("font-bold tracking-tight text-foreground whitespace-nowrap", textSize)}>Alumni Relations Cell</span>
                <span className="text-[9px] font-semibold tracking-widest text-muted-foreground/60 uppercase leading-none mt-0.5">MEC Thrikkakara</span>
              </span>
            </>
          ) : (
            <span className="flex flex-col">
              <span className={cn("font-bold tracking-tight text-foreground whitespace-nowrap", textSize)}>Alumni Relations Cell</span>
              <span className="text-[9px] font-semibold tracking-widest text-muted-foreground/60 uppercase leading-none mt-0.5">MEC Thrikkakara</span>
            </span>
          )}
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
