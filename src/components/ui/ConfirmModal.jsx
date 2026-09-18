import Button from './Button';

const ConfirmModal = ({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Yes, continue',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-card-hover">
        <h3 className="font-display text-lg font-bold text-ink-900">{title}</h3>
        {message && <p className="mt-2 text-sm text-ink-600">{message}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" size="md" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} size="md" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
