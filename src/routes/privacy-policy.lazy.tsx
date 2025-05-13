import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/privacy-policy")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        Privacy Policy
      </h1>

      <div className="max-w-4xl mx-auto bg-base-100 p-6 rounded-lg shadow-md">
        <p className="mb-6 text-lg">
          At Crew Fireworks, we take your privacy seriously. This Privacy Policy
          outlines how we collect, use, and protect your personal information
          when you visit our website or place an order with us.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-secondary">
          Information We Collect
        </h2>

        <p className="mb-4">
          When you use our website or place an order, we may collect the
          following information:
        </p>

        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Personal information (name, address, email, phone number)</li>
          <li>Billing and shipping information</li>
          <li>Order history and preferences</li>
          <li>Device information and browsing data</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4 text-secondary">
          How We Use Your Information
        </h2>

        <p className="mb-4">
          We use the information we collect for the following purposes:
        </p>

        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Processing and fulfilling your orders</li>
          <li>
            Communicating with you about your order status and shipping updates
          </li>
          <li>
            Contacting you regarding additional shipping charges if applicable
          </li>
          <li>Improving our website and customer experience</li>
          <li>
            Marketing and promotional communications (which you can opt out of)
          </li>
        </ul>

        <p className="mb-6">
          We need your correct email and phone number on file so we can contact
          you when necessary, as your order may be on hold until additional
          shipping payments are made. You can opt out of marketing
          communications at your convenience.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-secondary">
          Cookies and Tracking
        </h2>

        <p className="mb-6">
          When you visit our sites, services, or tools, we or our authorized
          service providers may use cookies to store information to help provide
          you with a better, faster, and safer browsing experience and for
          marketing purposes.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-secondary">
          Information Sharing
        </h2>

        <p className="mb-4">We may share your information with:</p>

        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Shipping and logistics partners to fulfill orders</li>
          <li>Payment processors to complete transactions</li>
          <li>Service providers who assist with our business operations</li>
        </ul>

        <p className="mb-6">
          We do not sell your personal information to third parties.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-secondary">
          Data Security
        </h2>

        <p className="mb-6">
          We implement appropriate security measures to protect your personal
          information from unauthorized access, alteration, disclosure, or
          destruction. However, no method of transmission over the Internet or
          electronic storage is 100% secure, and we cannot guarantee absolute
          security.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-secondary">
          Your Rights
        </h2>

        <p className="mb-4">
          Depending on your location, you may have certain rights regarding your
          personal information, including:
        </p>

        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Access to your personal information</li>
          <li>Correction of inaccurate information</li>
          <li>Deletion of your personal information</li>
          <li>Withdrawal of consent for processing</li>
        </ul>

        <p className="mb-6">
          To exercise these rights, please contact us using the information
          provided below.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-secondary">
          Contact Us
        </h2>

        <p className="mb-6">
          If you have any questions or concerns about our Privacy Policy, please
          contact us at{" "}
          <a
            href="mailto:lucas@crewfireworks.com"
            className="text-primary hover:underline"
          >
            lucas@crewfireworks.com
          </a>
          .
        </p>

        <div className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div>
            <h3 className="font-bold">Policy Updates</h3>
            <div className="text-sm">
              We may update this Privacy Policy from time to time. The updated
              version will be indicated by an updated "Last Updated" date and
              the updated version will be effective as soon as it is accessible.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
