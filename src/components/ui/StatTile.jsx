import { Link } from 'react-router-dom';

const StatTile = ({ icon: Icon, label, value, to, loading }) => {
  const content = (
    <>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        {Icon && <Icon size={18} />}
      </div>
      <div className="mt-4">
        <p className="font-display text-2xl font-bold text-ink-900">
          {loading ? '—' : value ?? 0}
        </p>
        <p className="mt-0.5 text-sm text-ink-500">{label}</p>
      </div>
    </>
  );

  const className =
    'block rounded-2xl border border-ink-100 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover';

  return to ? (
    <Link to={to} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
};

export default StatTile;
