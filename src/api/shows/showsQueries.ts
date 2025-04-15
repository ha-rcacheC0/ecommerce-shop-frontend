import { queryOptions, useMutation } from "@tanstack/react-query";
import {
  getAllShows,
  getShowById,
  getShowsByType,
  getAllShowTypes,
  createShow,
  updateShow,
  deleteShow,
  CreateShowData,
} from "./shows";
import { queryClient } from "../../main";

// Query options for fetching all shows
export const getAllShowsQueryOptions = () =>
  queryOptions({
    queryKey: ["shows"],
    queryFn: () => getAllShows(),
  });

// Query options for fetching shows by type
export const getShowsByTypeQueryOptions = (typeId: string) =>
  queryOptions({
    queryKey: ["shows", "type", typeId],
    queryFn: () => getShowsByType(typeId),
  });

// Query options for fetching a single show
export const getShowByIdQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["show", id],
    queryFn: () => getShowById(id),
  });

// Query options for fetching all show types
export const getAllShowTypesQueryOptions = () =>
  queryOptions({
    queryKey: ["showTypes"],
    queryFn: () => getAllShowTypes(),
  });

// Mutation for creating a show
export const useCreateShowMutation = (
  onSuccessCallback: () => void,
  onErrorCallback: (error: Error) => void
) => {
  return useMutation({
    mutationFn: (data: CreateShowData) => createShow(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shows"] });
      onSuccessCallback();
    },
    onError: (error: Error) => {
      onErrorCallback(error);
    },
  });
};

// Mutation for updating a show
export const useUpdateShowMutation = (
  id: string,
  onSuccessCallback: () => void,
  onErrorCallback: (error: Error) => void
) => {
  return useMutation({
    mutationFn: (data: Partial<CreateShowData>) => updateShow(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shows"] });
      queryClient.invalidateQueries({ queryKey: ["show", id] });
      onSuccessCallback();
    },
    onError: (error: Error) => {
      onErrorCallback(error);
    },
  });
};

// Mutation for deleting a show
export const useDeleteShowMutation = (
  onSuccessCallback: () => void,
  onErrorCallback: (error: Error) => void
) => {
  return useMutation({
    mutationFn: (id: string) => deleteShow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shows"] });
      onSuccessCallback();
    },
    onError: (error: Error) => {
      onErrorCallback(error);
    },
  });
};
