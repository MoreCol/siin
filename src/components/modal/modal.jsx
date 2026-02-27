import { createPortal } from 'react-dom';

export default function Modal({ open, title, children, onClose, closeOnOverlay = true }) {
  if (!open) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={e => {
        if (!closeOnOverlay) return;
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-content" role="dialog" aria-modal="true">
        <div className="modal-header">{title ? <h2>{title}</h2> : <div />}</div>

        {children}
      </div>
    </div>,
    document.body
  );
}
