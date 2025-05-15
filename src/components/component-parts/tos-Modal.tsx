import { Link } from "@tanstack/react-router";

interface TosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TosModal = ({ isOpen, onClose, onAccept }: TosModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-base-100 rounded-lg shadow-xl max-w-md w-full mx-auto">
        <div className="p-6">
          <h3 className="font-bold text-lg mb-4">Terms of Service</h3>
          <p className="mb-4">
            Before proceeding with your order, you must accept our Terms of
            Service.
          </p>
          <p className="mb-6">
            Please review our{" "}
            <Link
              to="/terms-of-use"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary-focus"
            >
              Terms of Service
            </Link>{" "}
            before continuing.
          </p>
          <div className="flex justify-end gap-3">
            <button className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={onAccept}>
              I Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TosModal;
