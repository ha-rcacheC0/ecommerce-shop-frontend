import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/shipping")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        Shipping Information
      </h1>

      <div className="max-w-4xl mx-auto bg-base-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-secondary">
          Shipping Policy
        </h2>

        <p className="mb-6">
          All shows ship free. Please see the shows section of our website.
        </p>

        <p className="mb-6">
          If you do not wish to purchase a show you may add products to your
          cart and watch the price fall until your order is free.
        </p>

        <p className="mb-6">
          Retail shipping is the cheapest because that's the lightest. Combo of
          both cases and units is often times heavier making it more expensive
          than retail, and finally we have our wholesale shipping that is the
          heaviest so it's also the most expensive.
        </p>

        <p className="mb-6">
          At crewfireworks.com we do our absolute best to guarantee you the best
          shipping prices available. As soon as you put your order in we go to
          work to get the best prices available across multiple carriers. When
          you checkout you'll be charged a flat shipping rate by us if it's not
          already free and that's when we have to then calculate today's
          shipping rate. Almost every order on crewfireworks.com will seamlessly
          deliver to you without interruptions based on the initial flat rate
          and/or being free.
        </p>

        <p className="mb-6">
          However, in an imperfect world if your purchase requires additional
          charges based on weight and/or distance we reserve the right to charge
          the card any additional fees from the shipping carriers first with
          your permission and/or consent before we send out your product. This
          is why we need your correct email and phone number on file with us so
          we can contact you when it's necessary, as your order will be on hold
          until the additional shipping payments are made and you can opt out of
          marketing at your convenience. See our{" "}
          <Link to="/privacy-policy" className="text-primary hover:underline">
            privacy policy
          </Link>
          .
        </p>

        <p className="mb-6">
          After 30 days if we are unable to contact you and you haven't made
          additional shipping payments in the case it's too expensive your order
          will expire and be restocked. We will check the new rate daily in
          those 30 days and if the rate gets cheap enough we'll ship your order
          out immediately so we don't have to restock.
        </p>

        <p className="mb-8">
          Feel free to ask us if your shipping location or show's budget
          qualifies you as eligible for free shipping even if our site says you
          may not be yet as we're always open to providing you with the best
          deals. This is our best effort to give everyone the best Fourth of
          July by providing every customer the most product for the cheapest
          price we can offer. Thanks again and a special thanks to everyone
          who's bought fireworks from us in the past and helped us get here.
        </p>

        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="text-xl font-semibold mb-3">
            Important Shipping Information
          </h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              All fireworks are shipped on pallets via hazmat-certified
              carriers.
            </li>
            <li>
              We can ship to residential addresses, commercial addresses, or
              freight terminals.
            </li>
            <li>Show packages ship free to qualifying locations.</li>
            <li>
              Delivery typically takes 5-7 business days after order processing.
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-secondary">
          Lift Gate Service
        </h2>

        <p className="mb-4">
          A lift gate is a shipping accessorial that requires a special type of
          truck to bring your pallet of fireworks from up on the truck down to
          the street for you. If you are able to take the pallet of fireworks
          off the truck yourself without extra assistance then you will not need
          to purchase a lift gate.
        </p>

        <p className="mb-4">
          The driver will always wheel the pallet of fireworks to the edge of
          the truck so you can more-easily take it off yourself. If you've
          purchased a lift the driver will then lift it down to the street for
          you.
        </p>

        <p className="mb-4">
          All show orders under $5k will ship on a single pallet. If you have an
          order large enough that requires more than one pallet then you'll need
          to purchase a lift gate or have a forklift handy at the time of
          delivery. We recommend shipping orders this size to a freight terminal
          if you don't have the proper accommodations.
        </p>

        <div className="mt-8 text-center">
          <Link to="/contact-us" className="btn btn-primary">
            Contact Us With Shipping Questions
          </Link>
        </div>
      </div>
    </div>
  );
}
