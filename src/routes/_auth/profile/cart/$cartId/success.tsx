import { createFileRoute } from "@tanstack/react-router";

const SuccessPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md px-8 py-6 mx-auto bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center">
          <div className="mb-4 text-green-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            Payment Successful!
          </h2>
          <p className="mb-6 text-gray-600">
            Thank you for your purchase. Your transaction was successful.
          </p>
          <a
            href="/"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_auth/profile/cart/$cartId/success")({
  component: () => <SuccessPage />,
});
