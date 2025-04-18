// src/api/shows/showsQueries.ts
import { queryOptions, useMutation } from "@tanstack/react-query";
import {
  getAllShows,
  getShowById,
  getShowsByType,
  getAllShowTypes,
  createShow,
  updateShow,
  deleteShow,
  createShowType,
  updateShowType,
  deleteShowType,
} from "./shows";
import { queryClient } from "../../main";
import { CreateShowData, UpdateShowData } from "../../types";

export const getAllShowsQueryOptions = () =>
  queryOptions({
    queryKey: ["shows"],
    queryFn: () => getAllShows(),
  });

export const getShowsByTypeQueryOptions = (typeId: string) =>
  queryOptions({
    queryKey: ["shows", "type", typeId],
    queryFn: () => getShowsByType(typeId),
  });

export const getShowByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["show", id],
    queryFn: () => getShowById(id),
  });

export const getAllShowTypesQueryOptions = () =>
  queryOptions({
    queryKey: ["showTypes"],
    queryFn: () => getAllShowTypes(),
  });

export const useCreateShowMutation = (
  token: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  return useMutation({
    mutationFn: (data: CreateShowData) => createShow(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shows"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
};

export const useUpdateShowMutation = (
  id: string,
  token: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  return useMutation({
    mutationFn: (data: UpdateShowData) => updateShow(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shows"] });
      queryClient.invalidateQueries({ queryKey: ["show", id] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
};

export const useDeleteShowMutation = (
  token: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  return useMutation({
    mutationFn: (id: string) => deleteShow(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shows"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
};

export const useCreateShowTypeMutation = (
  token: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      createShowType(data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showTypes"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
};

export const useUpdateShowTypeMutation = (
  id: string,
  token: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      updateShowType(id, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showTypes"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
};

export const useDeleteShowTypeMutation = (
  token: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
) => {
  return useMutation({
    mutationFn: (id: string) => deleteShowType(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showTypes"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      if (onError) onError(error);
    },
  });
};
