import React, { useState, useCallback, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductCard } from "../../components/product-card";
import { getAllProductsQueryOptions } from "../../api/products/productsQueries";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Brand, TProduct, Category, Colors, Effects } from "../../types";
import { getAllProductsQuery } from "../../api/products/products";
import FilterPanel from "../../components/component-parts/filterPanel";
import { PageButtons } from "../../components/component-parts/pageButtons";
import { z } from "zod";

const Products: React.FC = () => {
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [selectedBrands, setSelectedBrands] = useState<Brand[]>(() =>
    Array.isArray(search.brands)
      ? (search.brands.filter(Boolean) as Brand[])
      : typeof search.brands === "string"
        ? (search.brands.split(",").filter(Boolean) as Brand[])
        : []
  );
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(
    () =>
      Array.isArray(search.categories)
        ? (search.categories.filter(Boolean) as Category[])
        : typeof search.categories === "string"
          ? (search.categories.split(",").filter(Boolean) as Category[])
          : []
  );
  const [selectedColors, setSelectedColors] = useState<Colors[]>(() =>
    Array.isArray(search.colors)
      ? (search.colors.filter(Boolean) as Colors[])
      : typeof search.colors === "string"
        ? (search.colors.split(",").filter(Boolean) as Colors[])
        : []
  );
  const [selectedEffects, setSelectedEffects] = useState<Effects[]>(() =>
    Array.isArray(search.effects)
      ? (search.effects.filter(Boolean) as Effects[])
      : typeof search.effects === "string"
        ? (search.effects.split(",").filter(Boolean) as Effects[])
        : []
  );

  const [page, setPage] = useState(() => Number(search.page) || 1);
  const [pageSize, setPageSize] = useState(() => Number(search.pageSize) || 25);
  const [searchTitle, setSearchTitle] = useState(search.searchTitle || "");

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
  ]);

  const handleFilterChange = useCallback(
    <T extends Brand | Category | Colors | Effects>(
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
    <div>
      <FilterPanel
        searchTitle={searchTitle}
        setSearchTitle={(value) => {
          setSearchTitle(value);
          setPage(1);
        }}
        selectedBrands={selectedBrands}
        setSelectedBrands={(brand: Brand) =>
          handleFilterChange(setSelectedBrands, brand)
        }
        selectedCategories={selectedCategories}
        setSelectedCategories={(category: Category) =>
          handleFilterChange(setSelectedCategories, category)
        }
        selectedColors={selectedColors}
        setSelectedColors={(color: Colors) =>
          handleFilterChange(setSelectedColors, color)
        }
        selectedEffects={selectedEffects}
        setSelectedEffects={(effect: Effects) =>
          handleFilterChange(setSelectedEffects, effect)
        }
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

      <div className="flex flex-wrap gap-4 p-6 h-[900px] overflow-y-auto justify-center bg-primary">
        {products?.contents.map((product: TProduct) => (
          <ProductCard
            key={product.id}
            product={product}
            searchParams={search}
          />
        ))}
      </div>

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

      {isFetching && <div>Fetching...</div>}
    </div>
  );
};

export const Route = createFileRoute("/products/")({
  component: Products,
  validateSearch: z.object({
    page: z.coerce.number(),
    pageSize: z.coerce.number(),
    brands: z.union([z.string(), z.array(z.nativeEnum(Brand))]).optional(),
    categories: z
      .union([z.string(), z.array(z.nativeEnum(Category))])
      .optional(),
    colors: z.union([z.string(), z.array(z.nativeEnum(Colors))]).optional(),
    effects: z.union([z.string(), z.array(z.nativeEnum(Effects))]).optional(),
    searchTitle: z.string().optional(),
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) => {
    const page = Number(deps.page) || 1;
    const pageSize = Number(deps.pageSize) || 25;
    const selectedBrands = Array.isArray(deps.brands)
      ? (deps.brands.filter(Boolean) as Brand[])
      : typeof deps.brands === "string"
        ? (deps.brands.split(",").filter(Boolean) as Brand[])
        : [];
    const selectedCategories = Array.isArray(deps.categories)
      ? (deps.categories.filter(Boolean) as Category[])
      : typeof deps.categories === "string"
        ? (deps.categories.split(",").filter(Boolean) as Category[])
        : [];
    const selectedColors = Array.isArray(deps.colors)
      ? (deps.colors.filter(Boolean) as Colors[])
      : typeof deps.colors === "string"
        ? (deps.colors.split(",").filter(Boolean) as Colors[])
        : [];
    const selectedEffects = Array.isArray(deps.effects)
      ? (deps.effects.filter(Boolean) as Effects[])
      : typeof deps.effects === "string"
        ? (deps.effects.split(",").filter(Boolean) as Effects[])
        : [];
    const searchTitle = deps.searchTitle || "";
    return queryClient.ensureQueryData(
      getAllProductsQueryOptions({
        page,
        pageSize,
        selectedBrands,
        selectedCategories,
        selectedColors,
        selectedEffects,
        searchTitle,
      })
    );
  },
});
