import { queryOptions, useMutation } from "@tanstack/react-query";
import {
  addProductToCart,
  getCartItems,
  removeProductFromCart,
  updateProductQuantity,
} from "./cart";
import { queryClient } from "../../main";

export const cartItemsQueryOptions = (
  cartId: string,
  enabled: boolean = true
) => {
  return queryOptions({
    queryKey: ["cart", cartId],
    queryFn: () => getCartItems(cartId),
    enabled: enabled,
  });
};

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
    onSuccess: async () => {
      onSuccessCallback();
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: ["cart", cartId],
      });
    },
    onError: (e: Error) => {
      onErrorCallback(e);
    },
  });
};
export const useRemoveProductFromCartMutation = (
  cartId: string,
  onSuccessCallback: () => void,
  onErrorCallback: (error: Error) => void
) => {
  return useMutation({
    mutationKey: ["removeItemFromCart"],
    mutationFn: ({
      productId,
      cartId,
    }: {
      productId: number;
      cartId: string;
    }) => removeProductFromCart({ productId, cartId }),
    onSuccess: async () => {
      onSuccessCallback();
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: ["cart", cartId],
      });
    },
    onError: (e: Error) => {
      onErrorCallback(e);
    },
  });
};

// Change mutation key to know what product is being updated
export const useUpdateProductQuantityMutation = (
  cartId: string,
  onSuccessCallback: () => void,
  onErrorCallback: (error: Error) => void
) => {
  return useMutation({
    mutationKey: ["updateItemQuantity"],
    mutationFn: ({
      productId,
      cartId,
      quantity,
    }: {
      productId: number;
      cartId: string;
      quantity: number;
    }) => updateProductQuantity({ productId, cartId, quantity }),
    onSuccess: async () => {
      onSuccessCallback();
    },
    onSettled: async () => {
      queryClient.invalidateQueries({
        queryKey: ["cart", cartId],
      });
    },
    onError: (e: Error) => {
      onErrorCallback(e);
    },
  });
};
