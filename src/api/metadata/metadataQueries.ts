// src/api/metadata/metadataQueries.ts - React Query hooks for metadata with pagination

import { queryOptions, useMutation } from "@tanstack/react-query";
import { queryClient } from "../../main";
import {
	createBrand,
	createCategory,
	createColor,
	createEffect,
	deleteBrand,
	deleteCategory,
	deleteColor,
	deleteEffect,
	getMetadataWithPagination,
	getProductMetadata,
	updateBrand,
	updateCategory,
	updateColor,
	updateEffect,
} from "./metadata";

// Query options for getting metadata (for forms/dropdowns)
export const getProductMetadataQueryOptions = () =>
	queryOptions({
		queryKey: ["metadata"],
		queryFn: () => getProductMetadata(),
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

// NEW: Query options for paginated metadata (for admin tables)
export const getMetadataWithPaginationQueryOptions = (filters: {
	page: number;
	pageSize: number;
	searchTitle?: string;
	type: "brands" | "categories" | "colors" | "effects";
}) =>
	queryOptions({
		queryKey: ["metadata", "paginated", filters],
		queryFn: () => getMetadataWithPagination(filters),
		staleTime: 1 * 60 * 1000, // 1 minute for admin data
	});

// BRAND MUTATIONS
export const useCreateBrandMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: (name: string) => createBrand(name, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["metadata"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};

export const useUpdateBrandMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: ({ id, name }: { id: string; name: string }) =>
			updateBrand(id, name, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["metadata"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};

export const useDeleteBrandMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: (id: string) => deleteBrand(id, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["metadata"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};

// CATEGORY MUTATIONS
export const useCreateCategoryMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: (name: string) => createCategory(name, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["metadata"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};

export const useUpdateCategoryMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: ({ id, name }: { id: string; name: string }) =>
			updateCategory(id, name, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["metadata"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};

export const useDeleteCategoryMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: (id: string) => deleteCategory(id, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["metadata"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};

// COLOR MUTATIONS
export const useCreateColorMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: (name: string) => createColor(name, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["metadata"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};

export const useUpdateColorMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: ({ id, name }: { id: string; name: string }) =>
			updateColor(id, name, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["metadata"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};

export const useDeleteColorMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: (id: string) => deleteColor(id, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["metadata"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};

// EFFECT MUTATIONS
export const useCreateEffectMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: (name: string) => createEffect(name, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["metadata"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};

export const useUpdateEffectMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: ({ id, name }: { id: string; name: string }) =>
			updateEffect(id, name, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["metadata"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};

export const useDeleteEffectMutation = (
	token: string,
	onSuccess?: () => void,
	onError?: (error: Error) => void,
) => {
	return useMutation({
		mutationFn: (id: string) => deleteEffect(id, token),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["metadata"] });
			if (onSuccess) onSuccess();
		},
		onError: (error: Error) => {
			if (onError) onError(error);
		},
	});
};
