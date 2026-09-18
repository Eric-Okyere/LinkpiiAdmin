const PageHeader = ({ title, subtitle, total, totalLabel = 'Total', actions }) => (
  <div className="mb-6 flex flex-col gap-4 border-b border-ink-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="font-display text-xl font-bold text-ink-900 sm:text-2xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
    </div>
    <div className="flex flex-wrap items-center gap-3">
      {typeof total !== 'undefined' && total !== null && (
        <span className="rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white shadow-soft">
          {totalLabel}: {total}
        </span>
      )}
      {actions}
    </div>
  </div>
);

export default PageHeader;
