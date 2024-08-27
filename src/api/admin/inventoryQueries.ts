import { queryOptions } from "@tanstack/react-query";
import { getAllInventoryProducts } from "./inventory";

export const getAllItemsInInventoryQueryOptions = () => {
  return queryOptions({
    queryKey: ["inventory"],
    queryFn: () => getAllInventoryProducts(),
  });
};
