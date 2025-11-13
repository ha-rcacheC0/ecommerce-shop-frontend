import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "@tanstack/react-router";
import { startPaymentProcess } from "../../api/cart/cart";
import { useMakePurchaseMutation } from "../../api/cart/cartQueries";
import { logger } from "../../utils/logger";

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
      logger.info({ cartId }, "Purchase successful");
      navigate({ to: `/profile/cart/${cartId}/success` });
    },
    (error) => {
      console.error("Purchase failed:", error.message);
    }
  );

  useEffect(() => {
    // Only fetch checkout token when all calculations are complete
    if (isUpdatingValues) {
      logger.debug(
        { isUpdatingValues },
        "HelcimPay: Skipping checkout token fetch - values still updating"
      );
      return;
    }

    const fetchCheckoutToken = async () => {
      try {
        logger.debug(
          { cartId, amount: amounts.grandTotal },
          "HelcimPay: Fetching checkout token"
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
            logger.info(
              { eventMessage: event.data.eventMessage },
              "HelcimPay: Transaction success"
            );
            // Wait for makePurchase to resolve
            try {
              await makePurchase({ userId, shippingAddressId, amounts });
              logger.info({ userId, cartId }, "HelcimPay: Purchase record created successfully");
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
