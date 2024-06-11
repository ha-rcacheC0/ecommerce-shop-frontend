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
  return await fetch(`${BASE_URL}/${cartId}`, {
    method: "POST",
    body: JSON.stringify({ productId, cartId }),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};
