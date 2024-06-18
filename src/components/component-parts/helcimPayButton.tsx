import { useEffect, useState } from "react";
import { tryHelcim } from "../../api/cart/cart";

declare global {
  interface Window {
    appendHelcimPayIframe: (checkoutToken: string) => void;
  }
}

const HelcimPayButton = ({
  cartId,
  amount,
}: {
  cartId: string;
  amount: number;
}) => {
  const [checkoutToken, setCheckoutToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchCheckoutToken = async () => {
      try {
        const { checkoutToken } = await tryHelcim({ cartId, amount });
        setCheckoutToken(checkoutToken);
      } catch (error) {
        console.error("Failed to fetch checkout token", error);
      }
    };

    fetchCheckoutToken();
  }, [cartId]);

  const handlePayNow = () => {
    if (checkoutToken && typeof window.appendHelcimPayIframe === "function") {
      window.appendHelcimPayIframe(checkoutToken);
    } else {
      console.error(
        "HelcimPay function not found or checkout token is missing"
      );
    }
  };

  return <button onClick={handlePayNow}>Pay Now</button>;
};

export default HelcimPayButton;
