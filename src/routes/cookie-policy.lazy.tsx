import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/cookie-policy")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        Cookie Policy
      </h1>

      <div className="max-w-4xl mx-auto bg-base-100 p-6 rounded-lg shadow-md">
        <p className="mb-6 text-lg">
          When you visit our sites, services, or tools, we or our authorized
          service providers may use cookies to store information to help provide
          you with a better, faster, and safer browsing experience and for
          marketing purposes.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-secondary">
          What Are Cookies?
        </h2>

        <p className="mb-6">
          Cookies are small text files that are stored on your device when you
          visit a website. They are widely used to make websites work more
          efficiently and provide information to the website owners. Cookies can
          be "persistent" or "session" cookies, depending on how long they
          remain on your device.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-secondary">
          How We Use Cookies
        </h2>

        <p className="mb-4">We use cookies for several purposes, including:</p>

        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <strong>Essential Cookies:</strong> These cookies are necessary for
            the website to function properly and cannot be turned off in our
            systems. They are usually only set in response to actions made by
            you which amount to a request for services, such as setting your
            privacy preferences, logging in, or filling in forms.
          </li>
          <li>
            <strong>Analytical/Performance Cookies:</strong> These cookies allow
            us to count visits and traffic sources so we can measure and improve
            the performance of our site. They help us to know which pages are
            the most and least popular and see how visitors move around the
            site.
          </li>
          <li>
            <strong>Functionality Cookies:</strong> These cookies enable the
            website to provide enhanced functionality and personalization. They
            may be set by us or by third-party providers whose services we have
            added to our pages.
          </li>
          <li>
            <strong>Targeting Cookies:</strong> These cookies may be set through
            our site by our advertising partners. They may be used by those
            companies to build a profile of your interests and show you relevant
            advertisements on other sites.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4 text-secondary">
          Managing Cookies
        </h2>

        <p className="mb-6">
          Most web browsers allow you to manage your cookie preferences by
          adjusting the settings. You can:
        </p>

        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Delete cookies from your browser</li>
          <li>
            Block cookies by activating the setting on your browser that allows
            you to refuse all or some cookies
          </li>
          <li>Set your browser to notify you when you receive a cookie</li>
        </ul>

        <p className="mb-6">
          Please note that if you choose to block all cookies (including
          essential cookies), you may not be able to access all or parts of our
          site, and your user experience may be severely limited.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-secondary">
          Third-Party Cookies
        </h2>

        <p className="mb-6">
          We may also use third-party services that use cookies to help analyze
          how users use the site, personalize your experience, and deliver
          advertisements based on your browsing activities and interests. These
          third parties may collect information about your online activities
          over time and across different websites.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-secondary">
          Updates to This Policy
        </h2>

        <p className="mb-6">
          We may update this Cookie Policy from time to time to reflect changes
          in technology, regulation, or our business practices. Any changes will
          become effective when we post the revised policy on our website. We
          encourage you to periodically review this page for the latest
          information on our cookie practices.
        </p>

        <h2 className="text-2xl font-semibold mb-4 text-secondary">
          Contact Us
        </h2>

        <p className="mb-6">
          If you have any questions about our use of cookies, please contact us
          at{" "}
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
            <div className="text-sm">
              By continuing to use our website, you are agreeing to our use of
              cookies as described in this Cookie Policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
