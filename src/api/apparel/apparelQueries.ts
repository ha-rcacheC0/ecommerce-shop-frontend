// src/api/apparel/apparelQueries.ts
import { queryOptions, useMutation } from "@tanstack/react-query";
import {
  createApparelItem,
  createApparelType,
  deleteApparelItem,
  deleteApparelType,
  getAllApparel,
  getAllApparelTypes,
  getApparelById,
  getApparelByType,
  updateApparelItem,
  updateApparelType,
} from "./apparel";
import { queryClient } from "../../main";
import { CreateApparelData, UpdateApparelData } from "../../types";

export const getAllApparelQueryOptions = () =>
  queryOptions({
    queryKey: ["apparel"],
    queryFn: () => getAllApparel(),
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

export const useCreateApparelMutation = (
  token: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  return useMutation({
    mutationFn: (data: CreateApparelData) => createApparelItem(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apparel"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
};

export const useUpdateApparelMutation = (
  id: string,
  token: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  return useMutation({
    mutationFn: (data: UpdateApparelData) => updateApparelItem(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apparel"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
};

export const useDeleteApparelMutation = (
  token: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  return useMutation({
    mutationFn: (id: string) => deleteApparelItem(id, token),
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
  onError?: (error: Error) => void
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
  onError?: (error: Error) => void
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
  onError?: (error: Error) => void
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
