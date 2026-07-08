import { cn } from '@/lib/utils';

interface BadgeProps {
  text: string;
  color?: string;
  bg?: string;
  className?: string;
}

export function StatusBadge({ text, color, bg, className }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium', className)}
      style={{ color: color || '#5C6B7A', backgroundColor: bg || '#F1F3F5' }}
    >
      <span
        className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color || '#5C6B7A' }}
      />
      {text}
    </span>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  color?: string;
  icon?: React.ReactNode;
}

export function MetricCard({ label, value, sublabel, color, icon }: MetricCardProps) {
  return (
    <div className="bg-white rounded-[12px] border border-[#E3E7ED] px-4 py-3 flex flex-col gap-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-[#5C6B7A] uppercase tracking-wide truncate">{label}</span>
        {icon && <span className="text-[#5C6B7A] opacity-60 flex-shrink-0">{icon}</span>}
      </div>
      <span
        className="text-2xl font-semibold font-[family-name:var(--font-display)] leading-none"
        style={{ color: color || '#122B4D' }}
      >
        {value}
      </span>
      {sublabel && <span className="text-[11px] text-[#5C6B7A]">{sublabel}</span>}
    </div>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-[7px] transition-all duration-[120ms] cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-[#2457D6] text-white hover:bg-[#1D49B5] border border-transparent',
    secondary: 'bg-white text-[#5C6B7A] border border-[#E3E7ED] hover:bg-[#F8F9FB]',
    danger: 'bg-[#D64545] text-white hover:bg-[#B73535] border border-transparent',
    ghost: 'bg-transparent text-[#5C6B7A] border border-transparent hover:bg-[#F1F3F5]',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function Avatar({ initials, size = 'md', color = '#2457D6' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };
  return (
    <div
      className={cn('rounded-full flex items-center justify-center font-semibold text-white font-[family-name:var(--font-display)] flex-shrink-0', sizeClasses[size])}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-[12px] border border-[#E3E7ED]', className)}>
      {children}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <hr className={cn('border-t border-[#E3E7ED]', className)} />;
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}
export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 opacity-30 text-[#5C6B7A]">{icon}</div>}
      <p className="font-semibold text-[#122B4D] font-[family-name:var(--font-display)]">{title}</p>
      {description && <p className="text-sm text-[#5C6B7A] mt-1 max-w-xs">{description}</p>}
    </div>
  );
}
