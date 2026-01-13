import { createPortal } from "react-dom";
import type { ModalBaseProps } from "./types";
import { styles } from "./style";
import { useEffect } from "react";

export function ModalBase({
  isOpen,
  title,
  onClose,
  onSubmit,
  children,
}: ModalBaseProps) {
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }

      if (onSubmit && (e.ctrlKey || e.metaKey) && e.key === "Enter") {
        onSubmit();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose, onSubmit]);

  if (!isOpen) return null;
  
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={styles.backdrop}
      onClick={onClose}
      data-testid="modal-backdrop"
    >
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {title && <h2>{title}</h2>}
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}
