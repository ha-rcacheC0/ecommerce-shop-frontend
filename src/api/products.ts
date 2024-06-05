const BASE_URL = import.meta.env.VITE_API_BASE_URL! + "/products";

export const getAllProductsQuery = async ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) => {
  return await fetch(`${BASE_URL}?page=${page}&pageSize=${pageSize}`, {}).then(
    (response) => response.json()
  );
};