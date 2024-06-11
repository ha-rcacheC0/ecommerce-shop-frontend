import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getAllProductsQuery, getOneProductQuery } from "./products";

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
export const getOneProductQueryOptions = ({ id }: { id: number }) =>
  queryOptions({
    queryKey: ["product", id],
    queryFn: () => getOneProductQuery({ id }),
  });
