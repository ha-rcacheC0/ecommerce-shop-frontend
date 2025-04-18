import { TInventoryUnitProduct } from "../../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL! + "/admin/inventory";

export const getAllInventoryProducts = async (): Promise<
  TInventoryUnitProduct[]
> => {
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
