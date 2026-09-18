const TONES = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger: 'bg-red-50 text-red-700 ring-red-200',
  neutral: 'bg-ink-100 text-ink-700 ring-ink-200',
  brand: 'bg-brand-50 text-brand-700 ring-brand-200',
  dark: 'bg-ink-900 text-white ring-ink-900',
};

const Badge = ({ tone = 'neutral', className = '', children }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${TONES[tone] || TONES.neutral} ${className}`}
  >
    {children}
  </span>
);

export default Badge;
