// src/api/products/productsQueries.ts
import {
	keepPreviousData,
	queryOptions,
	useMutation,
} from "@tanstack/react-query";
import { queryClient } from "@/main";
import type {
	CreateProductData,
	ProductFilters,
	UpdateProductData,
} from "@/types";
import {
	createProductQuery,
	deleteProductQuery,
	getAllProductsQuery,
	getOneProductQuery,
	updateProductQuery,
} from "./products";

export const getAllProductsQueryOptions = (filters: ProductFilters) =>
	queryOptions({
		queryKey: ["products", filters],
		queryFn: () => getAllProductsQuery(filters),
		placeholderData: keepPreviousData,
	});

export const getOneProductQueryOptions = ({ id }: { id: string }) =>
	queryOptions({
		queryKey: ["product", id],
		queryFn: () => getOneProductQuery({ id }),
	});

export const useCreateProductMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: (productData: CreateProductData) =>
			createProductQuery(productData, token),
		onSuccess: () => {
			// Invalidate products queries
			queryClient.invalidateQueries({ queryKey: ["products"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};

export const useUpdateProductMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateProductData }) =>
			updateProductQuery(id, data, token),
		onSuccess: (_, variables) => {
			// Invalidate specific product and products list
			queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
			queryClient.invalidateQueries({ queryKey: ["products"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};

export const useDeleteProductMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: (id: string) => deleteProductQuery(id, token),
		onSuccess: () => {
			// Invalidate products list
			queryClient.invalidateQueries({ queryKey: ["products"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};
