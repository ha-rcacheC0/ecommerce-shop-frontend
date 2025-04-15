import { User, UserProfile } from "../../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL + "/user";
export const getUserInfo = async (token: string): Promise<UserProfile> => {
  return await fetch(BASE_URL + "/userInfo", {
    headers: { Authorization: `Bearer ${token}` },
  }).then((response) => response.json());
};
export const postUserInfo = async (
  token: string,
  body: UserProfile
): Promise<UserProfile> => {
  return await fetch(BASE_URL + "/userInfo", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(body),
  }).then((response) => response.json());
};

export const getAllUsers = async (token: string): Promise<User[]> => {
  return await fetch(BASE_URL + "/getAll", {
    headers: { Authorization: `Bearer ${token}` },
  }).then((response) => response.json());
};
