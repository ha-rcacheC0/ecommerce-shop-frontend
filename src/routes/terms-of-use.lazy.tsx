import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/terms-of-use")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-secondary">
        Terms of Use
      </h1>

      <div className="max-w-4xl mx-auto bg-base-100 p-6 rounded-lg shadow-md">
        <div className="alert alert-info mb-6">
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
          <span>
            By placing an order through crewfireworks.com you are agreeing you
            have done your due diligence to comply with everything inside these
            terms & conditions.
          </span>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-secondary">
          Agreement
        </h2>

        <p className="mb-4">
          Crewfireworks.com is online sales only. Absolutely no cash or offline
          sales will go through crewfireworks.com. If you wish to make a
          purchase over the phone we will first need to verify you and your
          account on file with us where the order will end up being placed
          online from your end. You are responsible for all information provided
          on your behalf to crewfireworks.com including but not limited to your
          name, mailing/billing address for delivery on account, email address,
          phone number and all other information we might ask for.
        </p>

        <p className="mb-4">
          If for any reason the information you provided is not accurate the
          responsibility falls directly back on the consumer of the website.
          Please do your due diligence as a customer and double check to ensure
          all information you provided is correct as this will ensure the most
          seamless purchasing experience for all of us.
        </p>

        <p className="mb-4">
          All sales at crewfireworks.com are final and there will be no full or
          partial refunds issued. Once your order is placed your order gets
          processed and pulled immediately by the distributor to ensure
          inventory reliability by all parties. If for some reason an item you
          selected is not available from your order we will replace that item
          with something of equal or better quality every time for you for your
          convenience.
        </p>

        <p className="mb-4">
          We will do our very best to keep data as accurate as possible with
          what's in stock so you know what you're getting every time but in the
          case we don't we reserve the right to substitute your item with equal
          or better value. In the rare occurrence we don't have an item to
          replace yours we will then make case by case arrangements for a
          partial refund for the unavailable items.
        </p>

        <p className="mb-4">
          This site was built by a huge fireworks fan only as a tool to get
          everyday people the most fireworks they can every year by simply
          ordering from their phone or computer. With this experience as soon as
          your order is submitted the sale is final and the transaction goes
          through third parties immediately to process and ship your order so
          every customer in line gets their order as soon as possible. The
          ability for us to make necessary substitutions helps us help you and
          we will always do our very best to ensure our customers receive the
          best deal. All sales final.
        </p>

        <h2 className="text-2xl font-semibold my-6 text-secondary">Terms</h2>

        <div className="alert alert-warning mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>All Sales Final.</span>
        </div>

        <p className="mb-4">
          We have a strict no refund and all sales are final policy. Before
          placing an order it is your responsibility to confirm all of the
          information you have given is correct, you've done research to comply
          with your local laws, and you've read all the necessary steps listed
          on crewfireworks.com before placing your order.
        </p>

        <p className="mb-4">
          Please read carefully before making your purchase. When you complete
          the checkout process on crewfireworks.com, you agree to our policies.
          If you do not agree with the policy terms in this document, do not
          place an order on our crewfireworks.com. Orders may be cancelled prior
          to being shipped, and will incur a cost recovery fee as described
          below. All sales are final upon being shipped.
        </p>

        <p className="mb-4">
          Due to processing costs, shipping costs, and regulations,
          crewfireworks.com does not accept returns or exchanges. Orders cannot
          be cancelled once the shipment has left our facility. We ship all
          fireworks orders via common carrier hazardous materials freight. This
          means that once we give your order to the freight company, the
          ownership of the freight now belongs to you. Therefore, we cannot
          cancel your order.
        </p>

        <p className="mb-4">
          Orders for non-fireworks items will normally ship via common carrier
          and cannot be cancelled once they have left our facility. If you place
          an order and then contact us for cancellation before your order has
          left our warehouse, you will be charged for our unrecoverable costs
          associated with your order. This can be as little as 3% or up to 50%
          of your order total, including the amount you paid for shipping.
        </p>

        <p className="mb-6">
          If your order is undeliverable for any reason, including your refusal
          to take delivery, you will be charged for round-trip freight costs
          even if your order was originally eligible for free shipping &
          freight. In addition, there will be a 20% restocking fee. This can
          take up to 4-5 weeks to complete and process the refund depending on
          the time of year. We will communicate with you regarding the return
          shipment and any refunds via the email address you provided in your
          original order.
        </p>

        <h3 className="text-xl font-semibold mb-4">Check your local laws.</h3>

        <p className="mb-6">
          Once your order is placed, you own it. Make sure you as a customer of
          crewfireworks.com do everything to comply with your local laws and
          ordinances. We as an online seller will not be held liable in a
          circumstance if you as the customer have additional fines & fees when
          it comes to laws, ordinances, shipping, handling, distribution, or
          delivery of your product. We have strategic plans in place to assure
          you we'll do everything we legally can to get your products to you as
          safely and as quickly as possible but please be aware when there are
          procedures outside of our immediate control placed by authorities,
          agencies, companies or industries that we both must comply to. Any and
          all liabilities, fees, fines, invoices, payments will be paid by the
          customer of crewfireworks.com and not the owners, operators or
          affiliates of crewfireworks.com under any circumstance. We as an
          online reseller are not responsible for any liability.
        </p>

        <h3 className="text-xl font-semibold mb-4">Right to deny services.</h3>

        <p className="mb-6">
          We reserve the right to deny service to anyone and we can refuse to
          deny sales to any customer for any reason we see fit, including
          flagrant, belligerent or rude behavior, and/or negligence of safety
          when intending to use the products on our site. None of these denials
          of service will be because of age, race, sex, social status, religion
          etc. However if we feel or have any other reason to believe the
          customers intentions are to use the products for malicious purposes or
          in a negligent fashion that one that could ultimately lead to harming
          themselves or others we have reserved the right to deny those
          customers service as well as the privilege of ordering products from
          crewfireworks.com. We want to sell all our products to everyone's crew
          and for everyone's crew to have a safe and exciting show or event
          every time. But in any occurrence any member of crewfireworks.com
          suspects malicious or foul play from any current, past or potential
          customer we will remove their account immediately and deny service to
          them. This is an attempt to ensure everyday people can keep safely
          coming back and enjoying the products sold on this site for years to
          come as they're intended to be used when used properly and attempts to
          not let a few individuals ruin the greatest events of the year for
          everybody else. If your intentions are to not use the products found
          on crewfireworks.com in a safe and purposeful manner as they're
          intended to be used then please do not agree to the terms and
          conditions. Thank you for helping us help others.
        </p>

        <div className="mt-8 text-center">
          <Link to="/contact-us" className="btn btn-primary">
            Contact Us With Questions
          </Link>
        </div>
      </div>
    </div>
  );
}
