// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useCallback, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductCard } from "../../components/product-card";
import { getAllProductsQueryOptions } from "../../api/products/productsQueries";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TProduct } from "../../types";
import { getAllProductsQuery } from "../../api/products/products";
import FilterPanel from "../../components/component-parts/filterPanel";
import { PageButtons } from "../../components/component-parts/pageButtons";
import { z } from "zod";

const Products: React.FC = () => {
  const navigate = useNavigate();
  const search = Route.useSearch();

  // Update states to use string arrays instead of enum arrays
  const [selectedBrands, setSelectedBrands] = useState<string[]>(() =>
    Array.isArray(search.brands)
      ? search.brands.filter(Boolean)
      : typeof search.brands === "string"
        ? search.brands.split(",").filter(Boolean)
        : []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
    Array.isArray(search.categories)
      ? search.categories.filter(Boolean)
      : typeof search.categories === "string"
        ? search.categories.split(",").filter(Boolean)
        : []
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(() =>
    Array.isArray(search.colors)
      ? search.colors.filter(Boolean)
      : typeof search.colors === "string"
        ? search.colors.split(",").filter(Boolean)
        : []
  );
  const [selectedEffects, setSelectedEffects] = useState<string[]>(() =>
    Array.isArray(search.effects)
      ? search.effects.filter(Boolean)
      : typeof search.effects === "string"
        ? search.effects.split(",").filter(Boolean)
        : []
  );

  const [page, setPage] = useState(() => Number(search.page) || 1);
  const [pageSize, setPageSize] = useState(() => Number(search.pageSize) || 25);
  const [searchTitle, setSearchTitle] = useState(search.searchTitle || "");
  const [showOutOfStock, setShowOutOfStock] = useState(false);

  const {
    data: products,
    isPending,
    isError,
    error,
    isFetching,
    isPlaceholderData,
  } = useQuery({
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
        inStock: showOutOfStock ? undefined : true,
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
        inStock: showOutOfStock ? undefined : true,
      }),
    placeholderData: keepPreviousData,
  });

  const updateUrl = useCallback(() => {
    const searchParams: Record<string, string | string[]> = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };

    if (searchTitle) searchParams.searchTitle = searchTitle;
    if (selectedBrands.length > 0) searchParams.brands = selectedBrands;
    if (selectedCategories.length > 0)
      searchParams.categories = selectedCategories;
    if (selectedColors.length > 0) searchParams.colors = selectedColors;
    if (selectedEffects.length > 0) searchParams.effects = selectedEffects;

    navigate({
      search: () => {
        // Start with a fresh object to avoid carrying over old filter values
        const newSearch: Record<string, string | string[]> = {
          page: searchParams.page,
          pageSize: searchParams.pageSize,
        };

        // Only add filters that are present in the current searchParams
        if ("searchTitle" in searchParams)
          newSearch.searchTitle = searchParams.searchTitle;
        if ("brands" in searchParams) newSearch.brands = searchParams.brands;
        if ("categories" in searchParams)
          newSearch.categories = searchParams.categories;
        if ("colors" in searchParams) newSearch.colors = searchParams.colors;
        if ("effects" in searchParams) newSearch.effects = searchParams.effects;
        if (showOutOfStock) searchParams.showOutOfStock = "true";

        return newSearch;
      },
      replace: true,
    });
  }, [
    navigate,
    page,
    pageSize,
    selectedBrands,
    selectedCategories,
    selectedColors,
    selectedEffects,
    searchTitle,
    showOutOfStock,
  ]);

  const handleFilterChange = useCallback(
    <T extends string>(
      setter: React.Dispatch<React.SetStateAction<T[]>>,
      value: T
    ) => {
      setter((prev) => {
        const newValues = prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value];
        setPage(1); // Reset to first page when filter changes
        return newValues;
      });
    },
    []
  );

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="flex min-h-screen max-lg:flex-col max-lg:items-center">
      <div className="flex-shrink-0 max-lg:w-40">
        <FilterPanel
          searchTitle={searchTitle}
          setSearchTitle={(value) => {
            setSearchTitle(value);
            setPage(1);
          }}
          selectedBrands={selectedBrands}
          setSelectedBrands={(brand: string) =>
            handleFilterChange(setSelectedBrands, brand)
          }
          selectedCategories={selectedCategories}
          setSelectedCategories={(category: string) =>
            handleFilterChange(setSelectedCategories, category)
          }
          selectedColors={selectedColors}
          setSelectedColors={(color: string) =>
            handleFilterChange(setSelectedColors, color)
          }
          selectedEffects={selectedEffects}
          setSelectedEffects={(effect: string) =>
            handleFilterChange(setSelectedEffects, effect)
          }
          showOutOfStock={showOutOfStock}
          setShowOutOfStock={(value) => {
            setShowOutOfStock(value);
            setPage(1);
          }}
          isFetching={isFetching}
          isPlaceholderData={isPlaceholderData}
          setPage={setPage}
          page={page}
          hasMore={products?.hasMore ?? false}
          pageSize={pageSize}
          setPageAmount={(value) => {
            setPageSize(value);
            setPage(1);
          }}
        />
      </div>
      <div className="flex flex-col sm:p-4">
        <div className="bg-base-100 sm:p-4 ">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:p-4">
            {products?.contents.map((product: TProduct) => (
              <ProductCard
                key={product.id}
                product={product}
                searchParams={search}
              />
            ))}
          </div>
        </div>

        <div className="bg-base-100 lg:p-4">
          <PageButtons
            isFetching={isFetching}
            isPlaceholderData={isPlaceholderData}
            setPage={setPage}
            page={page}
            hasMore={products?.hasMore ?? false}
            pageSize={pageSize}
            setPageAmount={(value) => {
              setPageSize(value);
              setPage(1);
            }}
          />
        </div>
      </div>
      {isFetching && <div>Fetching...</div>}
    </div>
  );
};

export const Route = createFileRoute("/products/")({
  component: Products,
  validateSearch: z.object({
    page: z.coerce.number(),
    pageSize: z.coerce.number(),
    brands: z.union([z.string(), z.array(z.string())]).optional(),
    categories: z.union([z.string(), z.array(z.string())]).optional(),
    colors: z.union([z.string(), z.array(z.string())]).optional(),
    effects: z.union([z.string(), z.array(z.string())]).optional(),
    searchTitle: z.string().optional(),
    showOutOfStock: z.enum(["true", "false"]).optional(),
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) => {
    const page = Number(deps.page) || 1;
    const pageSize = Number(deps.pageSize) || 25;
    const selectedBrands = Array.isArray(deps.brands)
      ? deps.brands.filter(Boolean)
      : typeof deps.brands === "string"
        ? deps.brands.split(",").filter(Boolean)
        : [];
    const selectedCategories = Array.isArray(deps.categories)
      ? deps.categories.filter(Boolean)
      : typeof deps.categories === "string"
        ? deps.categories.split(",").filter(Boolean)
        : [];
    const selectedColors = Array.isArray(deps.colors)
      ? deps.colors.filter(Boolean)
      : typeof deps.colors === "string"
        ? deps.colors.split(",").filter(Boolean)
        : [];
    const selectedEffects = Array.isArray(deps.effects)
      ? deps.effects.filter(Boolean)
      : typeof deps.effects === "string"
        ? deps.effects.split(",").filter(Boolean)
        : [];
    const searchTitle = deps.searchTitle || "";
    const showOutOfStock = deps.showOutOfStock === "true";
    return queryClient.ensureQueryData(
      getAllProductsQueryOptions({
        page,
        pageSize,
        selectedBrands,
        selectedCategories,
        selectedColors,
        selectedEffects,
        searchTitle,
        inStock: showOutOfStock ? undefined : true,
      })
    );
  },
});
