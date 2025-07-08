import {
  SignInRequest,
  SignInRequestSchema,
  SignInResponse,
  UserCreateRequest,
  createUserRequestSchema,
} from "../../types";
import { API_CONFIG } from "../../utils/config";

const BASE_URL = API_CONFIG.BASE_URL;

export const signInUser = async (
  body: SignInRequest
): Promise<SignInResponse> => {
  const requestBody = SignInRequestSchema.safeParse(body);
  if (!requestBody.success) throw new Error("Invalid request data");
  const response = await fetch(`${BASE_URL}/user/login`, {
    method: "Post",
    body: JSON.stringify(requestBody.data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return await response.json();
};

export const createUser = async (body: UserCreateRequest): Promise<unknown> => {
  const result = createUserRequestSchema.safeParse(body);
  if (!result.success) throw new Error("invalid request data");

  const response = await fetch(`${BASE_URL}/user/register`, {
    method: "POST",
    body: JSON.stringify(result.data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
};
