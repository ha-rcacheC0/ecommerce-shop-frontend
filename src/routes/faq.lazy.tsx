import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/faq")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        Frequently Asked Questions
      </h1>

      <div className="max-w-4xl mx-auto bg-base-100 p-6 rounded-lg shadow-md">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-secondary">
            Common Questions
          </h2>

          <div className="space-y-6">
            <div className="collapse collapse-plus bg-base-200">
              <input type="radio" name="faq-accordion" defaultChecked />
              <div className="collapse-title text-lg font-medium">
                Can I order all year round?
              </div>
              <div className="collapse-content">
                <p>Yes. Order anytime!</p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                Do you ship to my house?
              </div>
              <div className="collapse-content">
                <p>
                  Yes we ship to any residential or commercial address you
                  provide us.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                What is a lift gate?
              </div>
              <div className="collapse-content">
                <p>
                  A lift gate is a shipping accessorial that requires a special
                  type of truck to bring your pallet of fireworks from up on the
                  truck down to the street for you. If you are able to take the
                  pallet of fireworks off the truck yourself without extra
                  assistance then you will not need to purchase a lift gate.
                </p>
                <p className="mt-3">
                  The driver will always wheel the pallet of fireworks to the
                  edge of the truck so you can more-easily take it off yourself.
                  If you've purchased a lift the driver will then lift it down
                  to the street for you.
                </p>
                <p className="mt-3">
                  All show orders under $5k will ship on a single pallet. If you
                  have an order large enough that requires more than one pallet
                  then you'll need to purchase a lift gate or have a forklift
                  handy at the time of delivery. We recommend shipping orders
                  this size to a freight terminal if you don't have the proper
                  accommodations.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                Does every order arrive on a pallet?
              </div>
              <div className="collapse-content">
                <p>Yes. Fireworks are required to ship hazmat on a pallet.</p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-lg font-medium">
                Can I ship my fireworks to a terminal?
              </div>
              <div className="collapse-content">
                <p>
                  Absolutely, this is our recommended method of shipping for
                  both speed and reliability. Please select your desired
                  terminal and you'll be prompted to be in contact with them to
                  make your shipping arrangements.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="divider my-8"></div>

        <div>
          <h2 className="text-2xl font-semibold mb-6 text-secondary">
            More Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/shipping-info"
              className="card bg-base-200 hover:bg-base-300 transition-colors"
            >
              <div className="card-body">
                <h3 className="card-title">Shipping Information</h3>
                <p>
                  Learn more about our shipping policies, rates, and lift gate
                  service.
                </p>
              </div>
            </Link>

            <Link
              to="/fireworks-safety"
              className="card bg-base-200 hover:bg-base-300 transition-colors"
            >
              <div className="card-body">
                <h3 className="card-title">Fireworks Safety</h3>
                <p>
                  Important safety information for handling and using fireworks.
                </p>
              </div>
            </Link>

            <Link
              to="/terms-of-use"
              className="card bg-base-200 hover:bg-base-300 transition-colors"
            >
              <div className="card-body">
                <h3 className="card-title">Terms of Use</h3>
                <p>Our terms and conditions for using crewfireworks.com.</p>
              </div>
            </Link>

            <Link
              to="/contact-us"
              className="card bg-base-200 hover:bg-base-300 transition-colors"
            >
              <div className="card-body">
                <h3 className="card-title">Contact Us</h3>
                <p>
                  Still have questions? Reach out to our team for assistance.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
