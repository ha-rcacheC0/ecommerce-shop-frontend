import { TCart } from "../../types";
import { API_CONFIG } from "../../utils/config";

const BASE_URL = API_CONFIG.BASE_URL + "/cart";
const PURCHASE_URL = API_CONFIG.BASE_URL + "/purchase";
export const getCartItems = async (cartId: string): Promise<TCart> =>
  await fetch(`${BASE_URL}/${cartId}`, {}).then((response) => response.json());

export const addProductToCart = async ({
  productId,
  cartId,
  isUnit,
  variantId,
}: {
  productId: string;
  cartId: string;
  isUnit: boolean;
  variantId?: string;
}) => {
  return await fetch(`${BASE_URL}/${cartId}/add`, {
    method: "POST",
    body: JSON.stringify({ productId, cartId, isUnit, variantId }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const removeProductFromCart = async ({
  productId,
  cartId,
  variantId,
}: {
  productId: string;
  cartId: string;
  variantId: string;
}) => {
  return await fetch(`${BASE_URL}/${cartId}/remove`, {
    method: "POST",
    body: JSON.stringify({ productId, cartId, variantId }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const updateProductQuantity = async ({
  cartId,
  productId,
  quantity,
  isUnit,
  variantId,
}: {
  productId: string;
  cartId: string;
  quantity: number;
  isUnit: boolean;
  variantId: string;
}) => {
  return await fetch(`${BASE_URL}/${cartId}/updateQuantity`, {
    method: "POST",
    body: JSON.stringify({ productId, cartId, quantity, isUnit, variantId }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const startPaymentProcess = async ({
  cartId,
  amount,
}: {
  cartId: string;
  amount: number;
}) => {
  return await fetch(`${BASE_URL}/${cartId}/purchase`, {
    method: "POST",
    body: JSON.stringify({ amount: amount }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

export const makePurchase = async (
  userId: string,
  shippingAddressId: string,
  amounts: {
    subtotal: number;
    tax: number;
    liftGateFee: number;
    shipping: number;
    grandTotal: number;
  }
) => {
  const response = await fetch(PURCHASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, shippingAddressId, amounts }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  return response.json();
};

export const addShowToCart = async ({
  showId,
  cartId,
}: {
  showId: string;
  cartId: string;
}) => {
  return await fetch(`${BASE_URL}/${cartId}/addShow`, {
    method: "POST",
    body: JSON.stringify({ showId, cartId }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};
