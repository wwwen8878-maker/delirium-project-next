import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FloatingCardProps {
  variant: 'left' | 'right' | 'standard';
  className?: string;
  children: ReactNode;
}

export function FloatingCard({
  variant,
  className,
  children
}: FloatingCardProps) {
  const baseClasses = "absolute bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-5 md:p-6 transform transition-all duration-500 hover:rotate-0";

  const variantClasses = {
    left: "rotate-2 hover:rotate-0",
    right: "-rotate-1 hover:rotate-0",
    standard: "rotate-1 hover:rotate-0"
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)}>
      {children}
    </div>
  );
}
