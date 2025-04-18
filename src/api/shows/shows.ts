// src/api/shows/shows.ts
import { ShowWithProducts, CreateShowData, UpdateShowData } from "../../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL! + "/shows";

export const getAllShows = async (): Promise<ShowWithProducts[]> => {
  const response = await fetch(`${BASE_URL}`, {
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
