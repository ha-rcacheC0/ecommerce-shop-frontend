import { queryOptions, useMutation } from "@tanstack/react-query";
import { getUserInfo, postUserInfo } from "./userInfo.api";
import { UserProfile } from "../../types";
import { queryClient } from "../../main";

export const userInfoQueryOptions = (token: string) =>
  queryOptions({
    queryKey: ["userInfo", token],
    queryFn: () => getUserInfo(token),
  });
export const useUserInfoPostMutation = (
  token: string,
  onSuccessCallback: () => void,
  onErrorCallback: (error: Error) => void
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
