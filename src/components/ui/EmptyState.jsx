import { FaInbox } from 'react-icons/fa';

const EmptyState = ({ title = 'Nothing here yet', subtitle, icon: Icon = FaInbox }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white/60 px-6 py-16 text-center">
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-500">
      <Icon size={20} />
    </div>
    <p className="font-display text-base font-semibold text-ink-800">{title}</p>
    {subtitle && <p className="mt-1 max-w-sm text-sm text-ink-500">{subtitle}</p>}
  </div>
);

export default EmptyState;
