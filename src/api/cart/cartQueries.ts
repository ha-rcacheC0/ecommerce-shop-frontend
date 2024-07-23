import { queryOptions, useMutation } from "@tanstack/react-query";
import {
  addProductToCart,
  getCartItems,
  makePurchase,
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
      isUnit,
    }: {
      productId: string;
      cartId: string;
      isUnit: boolean;
    }) => addProductToCart({ productId, cartId, isUnit }),
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
      productId: string;
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
      isUnit,
    }: {
      productId: string;
      cartId: string;
      quantity: number;
      isUnit: boolean;
    }) => updateProductQuantity({ productId, cartId, quantity, isUnit }),
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
export const useMakePurchaseMutation = (
  onSuccessCallback: () => void,
  onErrorCallback: (error: Error) => void
) => {
  return useMutation({
    mutationKey: ["makePurchase"],
    mutationFn: ({
      userId,
      shippingAddressId,
    }: {
      userId: string;
      shippingAddressId: string;
    }) => makePurchase(userId, shippingAddressId),
    onSuccess: async () => {
      onSuccessCallback();
      // Invalidate the cart query to ensure it is refetched
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (e: Error) => {
      onErrorCallback(e);
    },
  });
};
