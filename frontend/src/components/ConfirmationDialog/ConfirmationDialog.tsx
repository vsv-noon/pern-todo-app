import { Modal } from "../Modal/Modal";
import useCtrlEnterKey from "../../hooks/useCtrlEnterKey";
import "../Modal/Modal.css";
import type { ConfirmationDialogProps } from "./types";

export function ConfirmationDialog({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
}: ConfirmationDialogProps) {
  useCtrlEnterKey(handleConfirm);

  function handleConfirm() {
    onConfirm();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} onConfirm={onConfirm}>
      <div className="modal-header">
        <h3>{title}</h3>
      </div>
      <div className="modal-body">
        <p>{message}</p>
      </div>
      <div className="modal-footer">
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleConfirm}>Confirm</button>
      </div>
    </Modal>
  );
}
