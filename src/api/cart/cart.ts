import { TCart } from "../../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL! + "/cart";

export const getCartItems = async (cartId: string): Promise<TCart> =>
  await fetch(`${BASE_URL}/${cartId}`, {}).then((response) => response.json());

export const addProductToCart = async ({
  productId,
  cartId,
}: {
  productId: number;
  cartId: string;
}) => {
  return await fetch(`${BASE_URL}/${cartId}/add`, {
    method: "POST",
    body: JSON.stringify({ productId, cartId }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};

export const removeProductFromCart = async ({
  productId,
  cartId,
}: {
  productId: number;
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
}: {
  productId: number;
  cartId: string;
  quantity: number;
}) => {
  return await fetch(`${BASE_URL}/${cartId}/updateQuantity`, {
    method: "POST",
    body: JSON.stringify({ productId, cartId, quantity }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};
