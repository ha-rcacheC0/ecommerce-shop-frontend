// src/api/metadata/metadata.ts - Complete metadata API functions with pagination

import { API_CONFIG } from "../../utils/config";

const BASE_URL = `${API_CONFIG.BASE_URL}/metadata`;

// GET all metadata (existing function for forms/dropdowns)
export const getProductMetadata = async () => {
	try {
		const response = await fetch(BASE_URL, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Network response was not ok: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching product metadata:", error);
		throw error;
	}
};

// NEW: GET paginated metadata for admin tables (similar to products pattern)
export const getMetadataWithPagination = async (filters: {
	page: number;
	pageSize: number;
	searchTitle?: string;
	type: "brands" | "categories" | "colors" | "effects";
}) => {
	try {
		const params = new URLSearchParams();
		params.append("page", filters.page.toString());
		params.append("pageSize", filters.pageSize.toString());
		params.append("type", filters.type);

		if (filters.searchTitle) {
			params.append("searchTitle", filters.searchTitle);
		}

		const response = await fetch(`${BASE_URL}?${params.toString()}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Network response was not ok: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching paginated metadata:", error);
		throw error;
	}
};

// BRAND API FUNCTIONS
export const createBrand = async (name: string, token: string) => {
	const response = await fetch(`${BASE_URL}/brands`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ name }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to create brand");
	}

	return await response.json();
};

export const updateBrand = async (id: string, name: string, token: string) => {
	const response = await fetch(`${BASE_URL}/brands/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ name }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to update brand");
	}

	return await response.json();
};

export const deleteBrand = async (id: string, token: string) => {
	const response = await fetch(`${BASE_URL}/brands/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to delete brand");
	}

	return response.status === 204;
};

// CATEGORY API FUNCTIONS
export const createCategory = async (name: string, token: string) => {
	const response = await fetch(`${BASE_URL}/categories`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ name }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to create category");
	}

	return await response.json();
};

export const updateCategory = async (
	id: string,
	name: string,
	token: string,
) => {
	const response = await fetch(`${BASE_URL}/categories/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ name }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to update category");
	}

	return await response.json();
};

export const deleteCategory = async (id: string, token: string) => {
	const response = await fetch(`${BASE_URL}/categories/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to delete category");
	}

	return response.status === 204;
};

// COLOR API FUNCTIONS
export const createColor = async (name: string, token: string) => {
	const response = await fetch(`${BASE_URL}/colors`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ name }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to create color");
	}

	return await response.json();
};

export const updateColor = async (id: string, name: string, token: string) => {
	const response = await fetch(`${BASE_URL}/colors/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ name }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to update color");
	}

	return await response.json();
};

export const deleteColor = async (id: string, token: string) => {
	const response = await fetch(`${BASE_URL}/colors/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to delete color");
	}

	return response.status === 204;
};

// EFFECT API FUNCTIONS
export const createEffect = async (name: string, token: string) => {
	const response = await fetch(`${BASE_URL}/effects`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ name }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to create effect");
	}

	return await response.json();
};

export const updateEffect = async (id: string, name: string, token: string) => {
	const response = await fetch(`${BASE_URL}/effects/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ name }),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to update effect");
	}

	return await response.json();
};

export const deleteEffect = async (id: string, token: string) => {
	const response = await fetch(`${BASE_URL}/effects/${id}`, {
		method: "DELETE",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to delete effect");
	}

	return response.status === 204;
};
