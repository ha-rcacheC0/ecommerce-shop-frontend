import {
	createUserRequestSchema,
	type SignInRequest,
	SignInRequestSchema,
	type SignInResponse,
	type UserCreateRequest,
} from "../../types";
import { API_CONFIG } from "../../utils/config";

const BASE_URL = API_CONFIG.BASE_URL;

export const signInUser = async (
	body: SignInRequest,
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

// Password Reset APIs
export interface ForgotPasswordRequest {
	email: string;
}

export interface ForgotPasswordResponse {
	message: string;
}

export interface ResetPasswordRequest {
	token: string;
	newPassword: string;
}

export interface ResetPasswordResponse {
	message: string;
}

export interface AdminResetPasswordRequest {
	userId: string;
	expiresInHours?: number;
}

export interface AdminResetPasswordResponse {
	message: string;
	expiresAt: string;
}

export const forgotPassword = async (
	body: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> => {
	const response = await fetch(`${BASE_URL}/user/forgot-password`, {
		method: "POST",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
		},
	});
	return await response.json();
};

export const resetPassword = async (
	body: ResetPasswordRequest,
): Promise<ResetPasswordResponse> => {
	const response = await fetch(`${BASE_URL}/user/reset-password`, {
		method: "POST",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
		},
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message || "Failed to reset password");
	}
	return data;
};

export const adminResetPassword = async (
	token: string,
	body: AdminResetPasswordRequest,
): Promise<AdminResetPasswordResponse> => {
	const response = await fetch(`${BASE_URL}/user/admin/reset-password`, {
		method: "POST",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	const data = await response.json();
	if (!response.ok) {
		throw new Error(data.message || "Failed to send password reset");
	}
	return data;
};
