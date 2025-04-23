import { queryOptions } from "@tanstack/react-query";
import { getInventoryProducts, InventoryQueryParams } from "./inventory";

export const getInventoryQueryOptions = (params: InventoryQueryParams = {}) => {
  return queryOptions({
    queryKey: ["inventory", params],
    queryFn: () => getInventoryProducts(params),
  });
};
