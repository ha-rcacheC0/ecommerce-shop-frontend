import React from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 p-6 rounded-lg w-full max-w-md">
        <button
          className="btn btn-sm btn-circle absolute top-2 right-2"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
