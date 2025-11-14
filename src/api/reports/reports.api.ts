// reports.api.ts
import { API_CONFIG } from "../../utils/config";

const BASE_URL = `${API_CONFIG.BASE_URL}/reports`;

export const getCaseBreakReport = async (
	token: string,
	startDate?: string,
	endDate?: string,
	statusFilter?: string,
) => {
	const params = new URLSearchParams();
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);
	if (statusFilter) params.append("status", statusFilter);

	const response = await fetch(`${BASE_URL}/case-break?${params}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch case break report");
	}

	return await response.json();
};

export const processCaseBreakRequest = async (
	token: string,
	id: string,
	quantityAdded: number,
) => {
	const response = await fetch(`${BASE_URL}/case-break/${id}/process`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ quantityAdded }),
	});

	if (!response.ok) {
		throw new Error("Failed to process case break request");
	}

	return response.json();
};
export const getPurchaseOrderReport = async (
	token: string,
	startDate?: string,
	endDate?: string,
) => {
	const params = new URLSearchParams();
	if (startDate) params.append("startDate", startDate);
	if (endDate) params.append("endDate", endDate);
	const response = await fetch(`${BASE_URL}/purchases?${params}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch purchase order report");
	}

	return await response.json();
};
export const updatePurchaseOrderStatus = async (
	token: string,
	id: string,
	status: string,
) => {
	const response = await fetch(`${BASE_URL}/purchases/${id}`, {
		method: "PATCH",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ status }),
	});

	if (!response.ok) {
		throw new Error("Failed to update purchase order status");
	}

	return await response.json();
};
