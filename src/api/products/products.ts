import { TProduct } from "../../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL! + "/products";
type AllProductsResponse = {
  contents: TProduct[];
  hasMore: boolean;
};

export const getAllProductsQuery = async ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<AllProductsResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("pageSize", pageSize.toString());

  return await fetch(`${BASE_URL}?${params}`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};
export const getOneProductQuery = async ({
  id,
}: {
  id: string;
}): Promise<TProduct> => {
  return await fetch(`${BASE_URL}/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());
};
