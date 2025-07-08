/* eslint-disable @typescript-eslint/no-explicit-any */
// src/api/apparel/apparel.ts - Updated for variants

import {
  ApparelFilter,
  CreateApparelProductData,
  CreateVariantData,
  UpdateVariantData,
} from "@/types";
import { API_CONFIG } from "../../utils/config";

const BASE_URL = API_CONFIG.BASE_URL + "/apparel";

export const getAllApparel = async (filters: ApparelFilter) => {
  const params = new URLSearchParams();
  params.append("page", filters.page.toString());
  params.append("pageSize", filters.pageSize.toString());
  if (filters.searchTitle) {
    params.append("searchTitle", filters.searchTitle);
  }
  params.append("isApparel", "true");
  if (filters.showOutOfStock) {
    params.append("showOutOfStock", "true");
  } else {
    params.append("showOutOfStock", "false");
  }
  filters.selectedBrands.forEach((brand) => params.append("brands", brand));
  filters.selectedCategories.forEach((category) =>
    params.append("categories", category)
  );
  filters.selectedColors.forEach((color) => params.append("colors", color));
  filters.selectedApparelTypes.forEach((apparelType) =>
    params.append("apparelTypes", apparelType)
  );
  filters.selectedGenders.forEach((gender) => params.append("genders", gender));
  filters.selectedSizes.forEach((size) => params.append("sizes", size));

  const response = await fetch(`${BASE_URL}?${params.toString()}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  const data = await response.json();
  return data;
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

// NEW: Create apparel product with variants
export const createApparelProduct = async (
  apparelData: CreateApparelProductData,
  token: string
) => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(apparelData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create apparel product");
  }

  return await response.json();
};
export const deleteApparelProductAndVariants = async (
  apparelId: string,
  token: string
) => {
  const response = await fetch(`${BASE_URL}/products/${apparelId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete apparel product");
  }

  return await response.json();
};

export const getSkuPreview = async () => {
  const response = await fetch(`${BASE_URL}/sku/preview`);
  if (!response.ok) throw new Error("Failed to fetch SKU preview");
  return await response.json();
};

// NEW: Create variant for existing product
export const createVariant = async (
  variantData: CreateVariantData,
  token: string
) => {
  const response = await fetch(`${BASE_URL}/variants`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(variantData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create variant");
  }

  return await response.json();
};

// NEW: Update variant
export const updateVariant = async (
  id: string,
  variantData: UpdateVariantData,
  token: string
) => {
  const response = await fetch(`${BASE_URL}/variants/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(variantData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update variant");
  }

  return await response.json();
};

// NEW: Delete variant
export const deleteVariant = async (id: string, token: string) => {
  const response = await fetch(`${BASE_URL}/variants/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete variant");
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
