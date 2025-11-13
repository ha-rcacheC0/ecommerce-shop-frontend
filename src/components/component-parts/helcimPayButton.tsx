import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "@tanstack/react-router";
import { startPaymentProcess } from "../../api/cart/cart";
import { useMakePurchaseMutation } from "../../api/cart/cartQueries";

declare global {
  interface Window {
    appendHelcimPayIframe: (checkoutToken: string) => void;
    removeHelcimPayIframe: () => void;
  }
}

const HelcimPayButton = ({
  cartId,
  amounts,
  isUpdatingValues,
  btnDisabled,
  userId,
  shippingAddressId,
}: {
  cartId: string;
  amounts: {
    subtotal: number;
    tax: number;
    liftGateFee: number;
    shipping: number;
    grandTotal: number;
  };
  isUpdatingValues: boolean;
  btnDisabled: boolean;
  userId: string;
  shippingAddressId: string;
}) => {
  const [checkoutToken, setCheckoutToken] = useState<string | null>(null);
  const navigate = useNavigate();

  const { mutateAsync: makePurchase, isPending } = useMakePurchaseMutation(
    () => {
      console.log("Purchase successful!");
      navigate({ to: `/profile/cart/${cartId}/success` });
    },
    (error) => {
      console.error("Purchase failed:", error.message);
    }
  );

  useEffect(() => {
    // Only fetch checkout token when all calculations are complete
    if (isUpdatingValues) {
      console.log(
        "[HelcimPay] Skipping checkout token fetch - values still updating"
      );
      return;
    }

    const fetchCheckoutToken = async () => {
      try {
        console.log(
          "[HelcimPay] Fetching checkout token with amount:",
          amounts.grandTotal
        );
        const { checkoutToken } = await startPaymentProcess({
          cartId,
          amount: amounts.grandTotal,
        });
        setCheckoutToken(checkoutToken);
      } catch (error) {
        console.error("[HelcimPay] Failed to fetch checkout token", error);
      }
    };
    fetchCheckoutToken();
  }, [cartId, amounts, isUpdatingValues]);

  const handlePayNow = () => {
    if (checkoutToken && typeof window.appendHelcimPayIframe === "function") {
      window.appendHelcimPayIframe(checkoutToken);
      window.addEventListener("message", async (event) => {
        const helcimPayJsIdentifierKey = `helcim-pay-js-${checkoutToken}`;

        if (event.data.eventName === helcimPayJsIdentifierKey) {
          if (event.data.eventStatus === "ABORTED") {
            console.error(
              "[HelcimPay] Transaction failed!",
              event.data.eventMessage
            );
          }

          if (event.data.eventStatus === "SUCCESS") {
            console.log(
              "[HelcimPay] Transaction success!",
              event.data.eventMessage
            );
            // Wait for makePurchase to resolve
            try {
              await makePurchase({ userId, shippingAddressId, amounts });
              console.log("[HelcimPay] Purchase record created successfully");
            } catch (error) {
              console.error("[HelcimPay] Error completing purchase:", error);
            }

            // Remove the iframe after makePurchase is resolved
            window.removeHelcimPayIframe();
          }
        }
      });
    } else {
      console.error(
        "[HelcimPay] HelcimPay function not found or checkout token is missing"
      );
    }
  };

  return (
    <button
      type="submit"
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
