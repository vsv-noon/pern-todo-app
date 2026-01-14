import { createPortal } from 'react-dom';

import './Modal.css';
import useEscapeKey from '../../hooks/useEscapeKey';
import useCtrlEnterKey from '../../hooks/useCtrlEnterKey';
import type { ModalProps } from './types';

export function Modal({ isOpen, onClose, onConfirm, children }: ModalProps) {
  const portalRoot = document.getElementById('modal-root');

  useEscapeKey(onClose);
  useCtrlEnterKey(onConfirm);

  if (!isOpen || !portalRoot) {
    return null;
  }

  return createPortal(
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>,
    portalRoot,
  );
}
