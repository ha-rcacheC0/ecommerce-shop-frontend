import { queryOptions, useMutation } from "@tanstack/react-query";
import { queryClient } from "../../main";
import type { UserProfile } from "../../types";
import {
	getAllUsers,
	getUserInfo,
	getUsers,
	postUserInfo,
	type UsersQueryParams,
} from "./userInfo.api";

export const userInfoQueryOptions = (token: string) =>
	queryOptions({
		queryKey: ["userInfo", token],
		queryFn: () => getUserInfo(token),
	});
export const useUserInfoPostMutation = (
	token: string,
	onSuccessCallback: () => void,
	onErrorCallback: (error: Error) => void,
) => {
	return useMutation({
		mutationKey: ["createUserInfo"],
		mutationFn: ({ token, body }: { token: string; body: UserProfile }) =>
			postUserInfo(token, body),
		onSuccess: async () => {
			onSuccessCallback();
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["userInfo", token] });
		},
		onError: (e: Error) => {
			onErrorCallback(e);
		},
	});
};

export const getUsersQueryOptions = (
	token: string,
	params: UsersQueryParams = {},
) => {
	return queryOptions({
		queryKey: ["users", params],
		queryFn: () => getUsers(token, params),
	});
};

// For backwards compatibility
export const getAllUsersQueryOptions = (token: string) => {
	return queryOptions({
		queryKey: ["users", "all"],
		queryFn: () => getAllUsers(token),
	});
};
