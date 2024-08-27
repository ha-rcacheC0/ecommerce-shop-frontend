import { ProductFilters, ProductsResponse, TProduct } from "../../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL! + "/products";

export const getAllProductsQuery = async (
  filters: ProductFilters
): Promise<ProductsResponse> => {
  const params = new URLSearchParams();

  params.append("page", filters.page.toString());
  params.append("pageSize", filters.pageSize.toString());

  if (filters.searchTitle) {
    params.append("searchTitle", filters.searchTitle);
  }

  filters.selectedBrands?.forEach((brand) => params.append("brands", brand));
  filters.selectedCategories?.forEach((category) =>
    params.append("categories", category)
  );
  filters.selectedColors?.forEach((color) => params.append("colors", color));
  filters.selectedEffects?.forEach((effect) =>
    params.append("effects", effect)
  );

  const response = await fetch(`${BASE_URL}?${params.toString()}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
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
