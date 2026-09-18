const VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-200',
  accent: 'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-200',
  secondary: 'bg-ink-900 text-white hover:bg-ink-800 focus:ring-ink-300',
  outline: 'border border-ink-200 bg-white text-ink-700 hover:bg-ink-50 focus:ring-ink-200',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-200',
  ghost: 'bg-transparent text-ink-600 hover:bg-ink-100 focus:ring-ink-200',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  className = '',
  as: Tag = 'button',
  ...rest
}) => (
  <Tag
    className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold shadow-soft transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
    {...rest}
  />
);

export default Button;
