import { queryOptions } from "@tanstack/react-query";
import { getUserInfo } from "./userInfo.api";

export const userInfoQueryOptions = (token: string) =>
  queryOptions({
    queryKey: ["userInfo", token],
    queryFn: () => getUserInfo(token),
  });
