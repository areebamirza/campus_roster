import Modal from './Modal.jsx';

export default function ConfirmDialog({ message, busy, onCancel, onConfirm }) {
  return (
    <Modal title="Confirm delete" onClose={onCancel}>
      <p>{message}</p>
      <div className="form-actions">
        <button className="btn ghost" onClick={onCancel} disabled={busy}>Cancel</button>
        <button className="btn danger" onClick={onConfirm} disabled={busy}>{busy ? 'Deleting...' : 'Delete'}</button>
      </div>
    </Modal>
  );
}
