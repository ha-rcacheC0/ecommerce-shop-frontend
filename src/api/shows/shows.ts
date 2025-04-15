import { ShowWithProducts } from "../../types";

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

  return response.json();
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

  return response.json();
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

  return response.json();
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

  return response.json();
};

export type CreateShowProduct = {
  productId: string;
  quantity: number;
  notes?: string;
};

export type CreateShowData = {
  title: string;
  description?: string;
  price: number;
  image?: string;
  videoURL?: string;
  inStock?: boolean;
  showTypeId: string;
  products: CreateShowProduct[];
};

export const createShow = async (showData: CreateShowData) => {
  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(showData),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const updateShow = async (
  id: string,
  showData: Partial<CreateShowData>
) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(showData),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const deleteShow = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return true;
};
