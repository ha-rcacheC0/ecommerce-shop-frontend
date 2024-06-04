import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getAllProductsQuery } from "./products";

export const getAllProductsQueryOptions = ({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) =>
  queryOptions({
    queryKey: ["products", page],
    queryFn: () => getAllProductsQuery({ page, pageSize }),
    placeholderData: keepPreviousData,
  });
