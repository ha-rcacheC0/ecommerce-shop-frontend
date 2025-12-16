// src/api/apparel/apparelQueries.ts
import { queryOptions, useMutation } from "@tanstack/react-query";
import type { ApparelFilter, CreateApparelProductData } from "@/types";
import { queryClient } from "../../main";
import {
	createApparelProduct,
	createApparelType,
	deleteApparelProductAndVariants,
	deleteApparelType,
	getAllApparel,
	getAllApparelTypes,
	getApparelById,
	getApparelByType,
	getSkuPreview,
	updateApparelType,
} from "./apparel";

export const getAllApparelQueryOptions = (filters: ApparelFilter) =>
	queryOptions({
		queryKey: ["apparel", filters],
		queryFn: () => getAllApparel(filters),
	});

export const getApparelByTypeQueryOptions = (typeId: string) =>
	queryOptions({
		queryKey: ["apparel", "type", typeId],
		queryFn: () => getApparelByType(typeId),
	});

export const getApparelByIdQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["apparel", id],
		queryFn: () => getApparelById(id),
	});

export const getAllApparelTypesQueryOptions = () =>
	queryOptions({
		queryKey: ["apparelTypes"],
		queryFn: () => getAllApparelTypes(),
	});

export const getSkuPreviewQueryOptions = () => ({
	queryKey: ["sku-preview", "apparel"],
	queryFn: async () => getSkuPreview(),
	staleTime: 1000 * 60 * 5, // 5 minutes
});

export const useCreateApparelMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: (data: CreateApparelProductData) =>
			createApparelProduct(data, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["apparel"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};

export const useCreateApparelTypeMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: (data: { name: string; description?: string }) =>
			createApparelType(data, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["apparelTypes"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};

export const useUpdateApparelTypeMutation = (
	id: string,
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: (data: { name: string; description?: string }) =>
			updateApparelType(id, data, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["apparelTypes"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};

export const useDeleteApparelTypeMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: (id: string) => deleteApparelType(id, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["apparelTypes"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};

export const useDeleteApparelProductMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: (id: string) => deleteApparelProductAndVariants(id, token),
		onSuccess: () => {
			// Invalidate products list
			queryClient.invalidateQueries({ queryKey: ["apparel"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};
