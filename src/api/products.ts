import { z } from "zod";

const BASE_URL = import.meta.env.VITE_API_BASE_URL! + "/products";

export const getAllProductsQuery = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return await fetch(`${BASE_URL}?page=${page}&limit=${limit}`, {}).then(
    (response) => response.json()
  );
};
