import { useEffect, useState } from "react";
import { startPaymentProcess } from "../../api/cart/cart";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "@tanstack/react-router";
import { useMakePurchaseMutation } from "../../api/cart/cartQueries";

declare global {
  interface Window {
    appendHelcimPayIframe: (checkoutToken: string) => void;
    removeHelcimPayIframe: () => void;
  }
}

const HelcimPayButton = ({
  cartId,
  amount,
  btnDisabled,
  userId,
  shippingAddressId,
}: {
  cartId: string;
  amount: number;
  btnDisabled: boolean;
  userId: string;
  shippingAddressId: string;
}) => {
  const [checkoutToken, setCheckoutToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const { mutate: makePurchase, isPending } = useMakePurchaseMutation(
    () => {
      console.log("Purchase successful!");
      navigate({
        to: "/profile/cart/$cartId/success",
        params: { cartId },
      });
    },
    (error) => {
      console.error("Purchase failed:", error.message);
    }
  );

  useEffect(() => {
    const fetchCheckoutToken = async () => {
      try {
        const { checkoutToken } = await startPaymentProcess({ cartId, amount });
        setCheckoutToken(checkoutToken);
      } catch (error) {
        console.error("Failed to fetch checkout token", error);
      }
    };

    fetchCheckoutToken();
  }, [cartId, amount]);

  const handlePayNow = () => {
    if (checkoutToken && typeof window.appendHelcimPayIframe === "function") {
      window.appendHelcimPayIframe(checkoutToken);
      window.addEventListener("message", (event) => {
        const helcimPayJsIdentifierKey = "helcim-pay-js-" + checkoutToken;

        if (event.data.eventName === helcimPayJsIdentifierKey) {
          if (event.data.eventStatus === "ABORTED") {
            console.error("Transaction failed!", event.data.eventMessage);
          }

          if (event.data.eventStatus === "SUCCESS") {
            console.log("Transaction success!", event.data.eventMessage);

            // This is where we need to update the cart info and create the payment record
            makePurchase({ userId, shippingAddressId });

            // Remove the iframe
            window.removeHelcimPayIframe();
          }
        }
      });
    } else {
      console.error(
        "HelcimPay function not found or checkout token is missing"
      );
    }
  };

  return (
    <button
      className="btn btn-primary"
      onClick={handlePayNow}
      disabled={btnDisabled || isPending}
    >
      {isPending ? "Processing..." : "Checkout"}
      <FontAwesomeIcon icon={faShoppingCart} />
    </button>
  );
};

export default HelcimPayButton;
