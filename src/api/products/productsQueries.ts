import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import {
  getAllProductsQuery,
  getOneProductQuery,
  getProductMetadata,
} from "./products";
import { ProductFilters } from "../../types";

export const getAllProductsQueryOptions = ({
  page,
  pageSize,
  selectedBrands,
  selectedCategories,
  selectedColors,
  selectedEffects,
  searchTitle,
}: ProductFilters) =>
  queryOptions({
    queryKey: [
      "products",
      {
        page,
        pageSize,
        selectedBrands,
        selectedCategories,
        selectedColors,
        selectedEffects,
        searchTitle,
      },
    ],
    queryFn: () =>
      getAllProductsQuery({
        page,
        pageSize,
        selectedBrands,
        selectedCategories,
        selectedColors,
        selectedEffects,
        searchTitle,
      }),
    placeholderData: keepPreviousData,
  });

export const getOneProductQueryOptions = ({ id }: { id: string }) =>
  queryOptions({
    queryKey: ["product", id],
    queryFn: () => getOneProductQuery({ id }),
  });

export const getProductMetadataQueryOptions = () =>
  queryOptions({
    queryKey: ["productMetadata"],
    queryFn: () => getProductMetadata(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
