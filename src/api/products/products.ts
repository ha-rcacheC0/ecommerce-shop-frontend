import {
  ProductFilters,
  ProductsResponse,
  TProduct,
  CreateProductData,
  UpdateProductData,
} from "../../types";
import { API_CONFIG } from "../../utils/config";

const BASE_URL = API_CONFIG.BASE_URL + "/products";

export const getAllProductsQuery = async (
  filters: ProductFilters
): Promise<ProductsResponse> => {
  const params = new URLSearchParams();

  params.append("page", filters.page.toString());
  params.append("pageSize", filters.pageSize.toString());

  if (filters.searchTitle) {
    params.append("searchTitle", filters.searchTitle);
  }

  if (filters.isShow !== undefined) {
    params.append("isShow", filters.isShow.toString());
  }
  if (filters.inStock !== undefined) {
    params.append("inStock", filters.inStock.toString());
  }

  filters.selectedBrands?.forEach((brand) => params.append("brands", brand));
  filters.selectedCategories?.forEach((category) =>
    params.append("categories", category)
  );
  filters.selectedColors?.forEach((color) => params.append("colors", color));
  filters.selectedEffects?.forEach((effect) =>
    params.append("effects", effect)
  );

  try {
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
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getOneProductQuery = async ({
  id,
}: {
  id: string;
}): Promise<TProduct> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

export const createProductQuery = async (
  data: CreateProductData,
  token: string
): Promise<TProduct> => {
  try {
    const response = await fetch(`${BASE_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create product");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProductQuery = async (
  id: string,
  data: UpdateProductData,
  token: string
): Promise<TProduct> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update product");
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};

export const deleteProductQuery = async (
  id: string,
  token: string
): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete product");
    }
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};

export const getProductMetadata = async () => {
  try {
    const METADATA_URL = BASE_URL + "/metadata";
    const response = await fetch(METADATA_URL, {
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
