import type { User, UserProfile, UsersResponse } from "../../types";
import { API_CONFIG } from "../../utils/config";

const BASE_URL = `${API_CONFIG.BASE_URL}/user`;
export const getUserInfo = async (token: string): Promise<UserProfile> => {
	return await fetch(`${BASE_URL}/userInfo`, {
		headers: { Authorization: `Bearer ${token}` },
	}).then((response) => response.json());
};
export const postUserInfo = async (
	token: string,
	body: UserProfile,
): Promise<UserProfile> => {
	return await fetch(`${BASE_URL}/userInfo`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(body),
	}).then((response) => response.json());
};

// Define params interface for the users endpoint
export interface UsersQueryParams {
	page?: number;
	pageSize?: number;
	search?: string;
	role?: string;
	active?: boolean;
}

export const getUsers = async (
	token: string,
	params: UsersQueryParams = {},
): Promise<UsersResponse> => {
	// Build query string from params
	const queryParams = new URLSearchParams();

	if (params.page) queryParams.append("page", params.page.toString());
	if (params.pageSize)
		queryParams.append("pageSize", params.pageSize.toString());
	if (params.search) queryParams.append("search", params.search);
	if (params.role) queryParams.append("role", params.role);
	if (params.active !== undefined)
		queryParams.append("active", params.active.toString());

	const queryString = queryParams.toString()
		? `?${queryParams.toString()}`
		: "";

	const response = await fetch(`${BASE_URL}/getAll${queryString}`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	return response.json();
};

// For backwards compatibility
export const getAllUsers = async (token: string): Promise<User[]> => {
	const response = await getUsers(token, { pageSize: 1000 });
	return response.items;
};
