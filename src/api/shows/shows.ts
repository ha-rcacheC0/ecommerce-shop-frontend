/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/shows/shows.ts
import { ShowWithProducts, CreateShowData, UpdateShowData } from "../../types";
import { API_CONFIG } from "../../utils/config";

const BASE_URL = API_CONFIG.BASE_URL + "/shows";

// Update the existing getAllShows function to support brand filtering
export const getAllShows = async (params?: {
  page?: number;
  pageSize?: number;
  typeId?: string;
  searchTitle?: string;
  brandId?: string; // Add brand filter
}): Promise<{ shows: ShowWithProducts[]; pagination: any }> => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.pageSize)
    searchParams.append("pageSize", params.pageSize.toString());
  if (params?.typeId) searchParams.append("typeId", params.typeId);
  if (params?.searchTitle)
    searchParams.append("searchTitle", params.searchTitle);
  if (params?.brandId) searchParams.append("brandId", params.brandId); // Add brand filter

  const response = await fetch(`${BASE_URL}?${searchParams}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return { shows: data.shows, pagination: data.pagination };
};

export const getShowsByBrand = async (
  brandId: string,
  params?: {
    page?: number;
    pageSize?: number;
    typeId?: string;
    searchTitle?: string;
  }
): Promise<{ shows: ShowWithProducts[]; brand: any; pagination: any }> => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.pageSize)
    searchParams.append("pageSize", params.pageSize.toString());
  if (params?.typeId) searchParams.append("typeId", params.typeId);
  if (params?.searchTitle)
    searchParams.append("searchTitle", params.searchTitle);

  const response = await fetch(`${BASE_URL}/brand/${brandId}?${searchParams}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json();
};
export const getShowsByType = async (
  typeId: string
): Promise<ShowWithProducts[]> => {
  const response = await fetch(`${BASE_URL}/type/${typeId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data.shows;
};

export const getShowById = async (id: string): Promise<ShowWithProducts> => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json();
};

export const getAllShowTypes = async () => {
  const response = await fetch(`${BASE_URL}/types/all`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return await response.json();
};

export const createShow = async (showData: CreateShowData, token: string) => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(showData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create show");
  }

  return await response.json();
};

export const updateShow = async (
  id: string,
  showData: UpdateShowData,
  token: string
) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(showData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update show");
  }

  return await response.json();
};

export const deleteShow = async (id: string, token: string) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete show");
  }

  return true;
};

export const createShowType = async (
  data: { name: string; description?: string },
  token: string
) => {
  const response = await fetch(`${BASE_URL}/types`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create show type");
  }

  return await response.json();
};

export const updateShowType = async (
  id: string,
  data: { name: string; description?: string },
  token: string
) => {
  const response = await fetch(`${BASE_URL}/types/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update show type");
  }

  return await response.json();
};

export const deleteShowType = async (id: string, token: string) => {
  const response = await fetch(`${BASE_URL}/types/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete show type");
  }

  return true;
};
