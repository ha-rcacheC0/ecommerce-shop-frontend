import { TInventoryUnitProduct } from "../../types";
import { API_CONFIG } from "../../utils/config";

const BASE_URL = API_CONFIG.BASE_URL + "/admin/inventory";

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface InventoryQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  view?: string | null;
}

export const getInventoryProducts = async (
  params: InventoryQueryParams = {}
): Promise<PaginatedResponse<TInventoryUnitProduct>> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.pageSize)
    queryParams.append("pageSize", params.pageSize.toString());
  if (params.search) queryParams.append("search", params.search);
  if (params.view) queryParams.append("view", params.view);

  const queryString = queryParams.toString()
    ? `?${queryParams.toString()}`
    : "";

  const response = await fetch(`${BASE_URL}${queryString}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
