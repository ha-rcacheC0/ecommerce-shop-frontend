import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getAllProductsQuery, getOneProductQuery } from "./products";
import { ProductFilters } from "../../types";

export const getAllProductsQueryOptions = ({
  page,
  pageSize,
  selectedBrands,
  searchTitle,
}: ProductFilters) =>
  queryOptions({
    queryKey: ["products", page],
    queryFn: () =>
      getAllProductsQuery({ page, pageSize, selectedBrands, searchTitle }),
    placeholderData: keepPreviousData,
  });
export const getOneProductQueryOptions = ({ id }: { id: string }) =>
  queryOptions({
    queryKey: ["product", id],
    queryFn: () => getOneProductQuery({ id }),
  });
