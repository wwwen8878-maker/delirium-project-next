import { cn } from "@/lib/utils";

interface DecorationSphereProps {
  variant: 'large' | 'medium' | 'small' | 'center';
  gradient: 'blue-purple' | 'green-blue' | 'purple-blue' | 'pink-purple';
  delay?: number;
  className?: string;
}

export function DecorationSphere({
  variant,
  gradient,
  delay = 0,
  className
}: DecorationSphereProps) {
  const sizeClasses = {
    large: 'w-96 h-96',
    medium: 'w-80 h-80',
    small: 'w-72 h-72',
    center: 'w-[36rem] sm:w-[31.25rem] h-[36rem] sm:h-[31.25rem] blur-3xl'
  };

  const gradientClasses = {
    'blue-purple': 'bg-gradient-to-br from-blue-100/40 to-purple-100/40',
    'green-blue': 'bg-gradient-to-br from-green-100/40 to-blue-100/40',
    'purple-blue': 'bg-gradient-to-br from-purple-100/40 to-blue-100/40',
    'pink-purple': 'bg-gradient-to-br from-pink-100/40 to-purple-100/40'
  };

  const pulseStyle = delay > 0 ? { animationDelay: `${delay}s` } : undefined;

  return (
    <div
      className={cn(
        'decoration-sphere',
        'absolute rounded-full opacity-100',
        sizeClasses[variant],
        gradientClasses[gradient],
        className
      )}
      style={pulseStyle}
    />
  );
}
