import { queryOptions, useMutation } from "@tanstack/react-query";
import { addProductToCart, getCartItems } from "./cart";
import { queryClient } from "../../main";

export const cartItemsQueryOptions = (cartId: string) =>
  queryOptions({
    queryKey: ["cart", cartId],
    queryFn: () => getCartItems(cartId),
  });

export const useAddItemToCartMutation = (
  cartId: string,
  onSuccessCallback: () => void,
  onErrorCallback: (error: Error) => void
) => {
  return useMutation({
    mutationKey: ["addItemToCart"],
    mutationFn: ({
      productId,
      cartId,
    }: {
      productId: number;
      cartId: string;
    }) => addProductToCart({ productId, cartId }),
    onSuccess: (data) => {
      console.log("Success", data);
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
      onSuccessCallback();
    },
    onError: (e: Error) => {
      onErrorCallback(e);
    },
  });
};
