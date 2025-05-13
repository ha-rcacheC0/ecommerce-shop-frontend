import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/customer-service")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        Customer Service
      </h1>

      <div className="max-w-4xl mx-auto bg-base-100 p-6 rounded-lg shadow-md">
        <p className="mb-6 text-lg">
          Crew Fireworks is as American as apple pie. One bite and you'll keep
          coming back for more. As true as a metal site and as timeless as a
          pair of blue jeans with a white tee shirt. It's never going out of
          style as it was and is always reliably there for you no matter what
          the times had going on.
        </p>

        <p className="mb-6 text-lg">
          We've forged to victory overcoming all obstacles to deliver the
          customer the best bang for their buck every single time both the good
          times and bad. Added convenience, supercharged sales, high speed order
          taking, your personal information being protected as a consumer. These
          are all the things we've done for you when shopping at Crew Fireworks
          and when you shop with CrewFireworks.com the prize is no different it
          just keeps getting better with age.
        </p>

        <p className="mb-8 text-lg">
          That's the customer service our family has continued to cater to in
          every circumstance and on every occasion. Here at crewfireworks.com
          we've tailored our site's experience to increase the customer's bottom
          line so our costs are covered, our profits are consistent and what
          keeps going up is customer satisfaction and the amount of items we can
          add to your cart to put on the best possible shows for you and your
          crew!
        </p>

        <div className="bg-base-200 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 text-secondary">
            Our Commitment to You
          </h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <span className="inline-block bg-success text-white rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              </div>
              <div className="ml-3">
                <p className="text-base">
                  Yes, we've been told our prices are too cheap and what others
                  sell this across the street for double or triple the price.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <span className="inline-block bg-success text-white rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              </div>
              <div className="ml-3">
                <p className="text-base">
                  Yes, we understand that you're getting 50% off when you're
                  buying fireworks from our site year round at your convenience
                  compared to what it'll cost going in on the day of the Fourth
                  of July at brick and mortar.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <span className="inline-block bg-success text-white rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
              </div>
              <div className="ml-3">
                <p className="text-base">
                  Finally, yes we understand that's how you have the best Fourth
                  of July you can have every single year and we'll go to work
                  year round to ensure you as a customer can do it again next
                  year.
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-secondary">
          Contact Our Customer Service Team
        </h2>

        <p className="mb-6">
          Have questions about your order, our products, or shipping options?
          Our customer service team is here to help!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-base-200 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Email Us</h3>
            <p>
              For general inquiries:{" "}
              <a
                href="mailto:lucas@crewfireworks.com"
                className="text-primary hover:underline"
              >
                lucas@crewfireworks.com
              </a>
            </p>
          </div>

          <div className="bg-base-200 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Call Us</h3>
            <p>
              Customer Service:{" "}
              <a
                href="tel:+17012696703"
                className="text-primary hover:underline"
              >
                +1 (701) 269-6703
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/contact-us" className="btn btn-primary">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
