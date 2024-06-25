import { UserProfile } from "../../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/user/userInfo";
export const getUserInfo = async (token: string): Promise<UserProfile> => {
  return await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  }).then((response) => response.json());
};
export const postUserInfo = async (
  token: string,
  body: UserProfile
): Promise<UserProfile> => {
  console.log("Inside postUserInfo", body);
  return await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  }).then((response) => response.json());
};
