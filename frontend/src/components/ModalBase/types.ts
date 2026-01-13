import type React from "react";

export type ModalBaseProps = {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  onSubmit?: () => void;
  children: React.ReactNode;
};
