import { queryOptions, useMutation } from "@tanstack/react-query";
import { queryClient } from "../../main";
import {
	addProductToCart,
	addShowToCart,
	getCartItems,
	makePurchase,
	removeProductFromCart,
	updateProductQuantity,
} from "./cart";

export const cartItemsQueryOptions = (
	cartId: string,
	enabled: boolean = true,
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
	onErrorCallback: (error: Error) => void,
) => {
	return useMutation({
		mutationKey: ["addItemToCart"],
		mutationFn: ({
			productId,
			cartId,
			isUnit,
			variantId,
		}: {
			productId: string;
			cartId: string;
			isUnit: boolean;
			variantId?: string;
		}) => addProductToCart({ productId, cartId, isUnit, variantId }),
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
	onErrorCallback: (error: Error) => void,
) => {
	return useMutation({
		mutationKey: ["removeItemFromCart"],
		mutationFn: ({
			productId,
			cartId,
			variantId,
		}: {
			productId: string;
			cartId: string;
			variantId: string;
		}) => removeProductFromCart({ productId, cartId, variantId }),
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
	onErrorCallback: (error: Error) => void,
) => {
	return useMutation({
		mutationKey: ["updateItemQuantity"],
		mutationFn: ({
			productId,
			cartId,
			quantity,
			isUnit,
			variantId,
		}: {
			productId: string;
			cartId: string;
			quantity: number;
			isUnit: boolean;
			variantId: string;
		}) =>
			updateProductQuantity({ productId, cartId, quantity, isUnit, variantId }),
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
	onErrorCallback: (error: Error) => void,
) => {
	return useMutation({
		mutationKey: ["makePurchase"],
		mutationFn: ({
			userId,
			shippingAddressId,
			amounts,
		}: {
			userId: string;
			shippingAddressId: string;
			amounts: {
				subtotal: number;
				tax: number;
				liftGateFee: number;
				shipping: number;
				grandTotal: number;
			};
		}) => makePurchase(userId, shippingAddressId, amounts),
		onSuccess: async () => {
			onSuccessCallback();
			queryClient.invalidateQueries({ queryKey: ["cart"] });
		},
		onError: (e: Error) => {
			onErrorCallback(e);
		},
	});
};
export const useAddShowToCartMutation = (
	cartId: string,
	onSuccessCallback: () => void,
	onErrorCallback: (error: Error) => void,
) => {
	return useMutation({
		mutationKey: ["addShowToCart"],
		mutationFn: ({ showId, cartId }: { showId: string; cartId: string }) =>
			addShowToCart({ showId, cartId }),
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
