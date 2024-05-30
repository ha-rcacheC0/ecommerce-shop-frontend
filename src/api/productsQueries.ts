import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getAllProductsQuery } from "./products";

export const getAllProductsQueryOptions = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) =>
  queryOptions({
    queryKey: ["products", page],
    queryFn: () => getAllProductsQuery({ page, limit }),
    placeholderData: keepPreviousData,
  });
