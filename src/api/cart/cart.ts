import { TCart } from "../../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL! + "/cart";
const PURCHASE_URL = import.meta.env.VITE_API_BASE_URL! + "/api/purchase";
export const getCartItems = async (cartId: string): Promise<TCart> =>
  await fetch(`${BASE_URL}/${cartId}`, {}).then((response) => response.json());

export const addProductToCart = async ({
  productId,
  cartId,
  isUnit,
}: {
  productId: string;
  cartId: string;
  isUnit: boolean;
}) => {
  return await fetch(`${BASE_URL}/${cartId}/add`, {
    method: "POST",
    body: JSON.stringify({ productId, cartId, isUnit }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const removeProductFromCart = async ({
  productId,
  cartId,
}: {
  productId: string;
  cartId: string;
}) => {
  return await fetch(`${BASE_URL}/${cartId}/remove`, {
    method: "POST",
    body: JSON.stringify({ productId, cartId }),
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
}: {
  productId: string;
  cartId: string;
  quantity: number;
  isUnit: boolean;
}) => {
  return await fetch(`${BASE_URL}/${cartId}/updateQuantity`, {
    method: "POST",
    body: JSON.stringify({ productId, cartId, quantity, isUnit }),
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
  shippingAddressId: string
) => {
  const response = await fetch(PURCHASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, shippingAddressId }),
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
