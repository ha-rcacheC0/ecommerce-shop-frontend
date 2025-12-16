import { queryOptions } from "@tanstack/react-query";
import { getInventoryProducts, type InventoryQueryParams } from "./inventory";

export const getInventoryQueryOptions = (params: InventoryQueryParams = {}) => {
	return queryOptions({
		queryKey: ["inventory", params],
		queryFn: () => getInventoryProducts(params),
	});
};
