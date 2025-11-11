import { useEffect, useState, useRef, useCallback } from "react";
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
  btnDisabled,
  userId,
  shippingAddressId,
  isCartUpdating,
}: {
  cartId: string;
  amounts: {
    subtotal: number;
    tax: number;
    liftGateFee: number;
    shipping: number;
    grandTotal: number;
  };
  btnDisabled: boolean;
  userId: string;
  shippingAddressId: string;
  isCartUpdating?: boolean;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const paymentCleanupRef = useRef<(() => void) | null>(null);

  const { mutateAsync: makePurchase, isPending } = useMakePurchaseMutation(
    () => {
      console.log("Purchase successful!");
      navigate({ to: `/profile/cart/${cartId}/success` });
    },
    (error) => {
      console.error("Purchase failed:", error.message);
    }
  );

  const resetProcessing = useCallback(() => {
    setIsProcessing(false);
    if (paymentCleanupRef.current) {
      paymentCleanupRef.current();
      paymentCleanupRef.current = null;
    }
  }, []);

  // Reset processing state when user returns to tab/window
  useEffect(() => {
    const handleFocus = () => {
      if (isProcessing) {
        // Small delay to allow any pending messages to come through
        setTimeout(() => {
          console.log("Window focused - checking if payment completed");
          resetProcessing();
        }, 1000);
      }
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && isProcessing) {
        setTimeout(() => {
          console.log("Tab visible - resetting payment state");
          resetProcessing();
        }, 1000);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isProcessing, resetProcessing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (paymentCleanupRef.current) {
        paymentCleanupRef.current();
      }
    };
  }, []);

  const handlePayNow = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      // Fetch the checkout token with the current amount
      const { checkoutToken } = await startPaymentProcess({
        cartId,
        amount: amounts.grandTotal,
      });

      if (typeof window.appendHelcimPayIframe === "function") {
        window.appendHelcimPayIframe(checkoutToken);

        // Wait a moment for iframe to be added to DOM, then start monitoring
        setTimeout(() => {
          const initialIframe = document.getElementById("helcimPayIframe");
          console.log("Initial iframe check:", !!initialIframe);

          if (initialIframe) {
            console.log("Iframe found, starting polling...");
          } else {
            console.warn("Iframe not found after creation!");
          }
        }, 100);

        // Set up cleanup function with timeout fallback
        const timeoutId = setTimeout(() => {
          console.log("Payment timeout - resetting state");
          resetProcessing();
        }, 300000); // 5 minutes timeout

        // Poll for iframe existence with detailed logging
        let pollCount = 0;
        const checkIframeInterval = setInterval(() => {
          pollCount++;
          const iframe = document.getElementById("helcimPayIframe");

          console.log(`Poll #${pollCount}: iframe exists:`, !!iframe);

          if (!iframe) {
            console.log("Helcim iframe removed - user backed out");
            clearInterval(checkIframeInterval);
            clearTimeout(timeoutId);
            window.removeEventListener("message", handlePaymentMessage);
            setIsProcessing(false);
            return;
          }

          // Stop polling after 5 minutes to prevent infinite polling
          if (pollCount > 600) {
            // 600 * 500ms = 5 minutes
            console.log("Stopping iframe polling after 5 minutes");
            clearInterval(checkIframeInterval);
          }
        }, 500);

        const handlePaymentMessage = async (event: MessageEvent) => {
          const helcimPayJsIdentifierKey = "helcim-pay-js-" + checkoutToken;

          if (event.data.eventName === helcimPayJsIdentifierKey) {
            clearTimeout(timeoutId);
            clearInterval(checkIframeInterval);
            window.removeEventListener("message", handlePaymentMessage);

            if (event.data.eventStatus === "ABORTED") {
              console.error("Transaction failed!", event.data.eventMessage);
              setIsProcessing(false);
            }

            if (event.data.eventStatus === "SUCCESS") {
              console.log("Transaction success!", event.data.eventMessage);

              try {
                await makePurchase({ userId, shippingAddressId, amounts });
              } catch (error) {
                console.error("Error completing purchase:", error);
              }

              window.removeHelcimPayIframe();
              setIsProcessing(false);
            }
          }
        };

        window.addEventListener("message", handlePaymentMessage);

        // Store cleanup function
        paymentCleanupRef.current = () => {
          clearTimeout(timeoutId);
          clearInterval(checkIframeInterval);
          window.removeEventListener("message", handlePaymentMessage);
          try {
            window.removeHelcimPayIframe();
          } catch (error) {
            // Iframe might not exist
          }
        };
      } else {
        console.error("HelcimPay function not found");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Failed to fetch checkout token", error);
      setIsProcessing(false);
    }
  };

  const resetPayment = () => {
    resetProcessing();
  };

  const getButtonText = () => {
    if (isPending || isProcessing) return "Processing...";
    if (isCartUpdating) return "Updating Cart...";
    return "Checkout";
  };

  return (
    <div className="space-y-2">
      <button
        className="btn btn-primary w-full"
        onClick={handlePayNow}
        disabled={btnDisabled || isPending || isProcessing || isCartUpdating}
      >
        {getButtonText()}
        <FontAwesomeIcon icon={faShoppingCart} />
      </button>

      {isProcessing && (
        <button
          className="btn btn-outline btn-sm w-full"
          onClick={resetPayment}
        >
          Cancel Payment
        </button>
      )}
    </div>
  );
};

export default HelcimPayButton;
