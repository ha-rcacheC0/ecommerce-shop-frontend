// src/api/apparel/apparel.ts

import { CreateApparelData, UpdateApparelData } from "@/types";
import { API_CONFIG } from "../../utils/config";

const BASE_URL = API_CONFIG.BASE_URL + "/apparel";

export const getAllApparel = async () => {
  const response = await fetch(`${BASE_URL}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data.apparel;
};

export const getApparelByType = async (typeId: string) => {
  const response = await fetch(`${BASE_URL}/type/${typeId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data.apparel;
};

export const getApparelById = async (id: string) => {
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

export const getAllApparelTypes = async () => {
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

export const createApparelItem = async (
  apparelData: CreateApparelData,
  token: string
) => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(apparelData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create apparel");
  }

  return await response.json();
};

export const updateApparelItem = async (
  id: string,
  apparelData: UpdateApparelData,
  token: string
) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(apparelData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update apparel");
  }

  return await response.json();
};

export const deleteApparelItem = async (id: string, token: string) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete apparel");
  }

  return true;
};

export const createApparelType = async (
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
    throw new Error(error.message || "Failed to create apparel type");
  }

  return await response.json();
};

export const updateApparelType = async (
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
    throw new Error(error.message || "Failed to update apparel type");
  }

  return await response.json();
};

export const deleteApparelType = async (id: string, token: string) => {
  const response = await fetch(`${BASE_URL}/types/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete apparel type");
  }

  return response.status === 204;
};
