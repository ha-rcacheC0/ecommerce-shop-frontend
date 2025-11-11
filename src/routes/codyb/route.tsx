// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useCallback, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ProductCard } from "@components/product-card";
import { ShowCard } from "@components/show-card";
import { getAllProductsQueryOptions } from "@api/products/productsQueries";
import { getAllApparelQueryOptions } from "@api/apparel/apparelQueries";
import {
  getShowsByBrandQueryOptions,
  getAllShowTypesQueryOptions,
} from "@api/shows/showsQueries";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TProduct } from "@/types";
import { getAllProductsQuery } from "@api/products/products";
import FilterPanel from "@components/component-parts/filterPanel";
import { PageButtons } from "@components/component-parts/pageButtons";
import { z } from "zod";
import { ApparelProductCard } from "@/components/apparelProductCard";

const CodyBPage: React.FC = () => {
  const navigate = useNavigate();
  const search = Route.useSearch();

  // Force Cody B brand to always be selected
  const CODY_B_BRAND = "CODY_B"; // Adjust this to match your actual brand identifier

  // Tab state
  const [activeTab, setActiveTab] = useState<"products" | "shows">(
    search.tab || "products"
  );

  // Product filter states (excluding brands since it's fixed to Cody B)
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

  // Apparel-specific filter states
  const [selectedApparelTypes, setSelectedApparelTypes] = useState<string[]>(
    () =>
      Array.isArray(search.apparelTypes)
        ? search.apparelTypes.filter(Boolean)
        : typeof search.apparelTypes === "string"
          ? search.apparelTypes.split(",").filter(Boolean)
          : []
  );
  const [selectedGenders, setSelectedGenders] = useState<string[]>(() =>
    Array.isArray(search.genders)
      ? search.genders.filter(Boolean)
      : typeof search.genders === "string"
        ? search.genders.split(",").filter(Boolean)
        : []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(() =>
    Array.isArray(search.sizes)
      ? search.sizes.filter(Boolean)
      : typeof search.sizes === "string"
        ? search.sizes.split(",").filter(Boolean)
        : []
  );

  // Show filter states
  const [selectedShowType, setSelectedShowType] = useState<string | null>(
    search.showType || null
  );

  const [page, setPage] = useState(() => Number(search.page) || 1);
  const [pageSize, setPageSize] = useState(() => Number(search.pageSize) || 25);
  const [searchTitle, setSearchTitle] = useState(search.searchTitle || "");
  const [showOutOfStock, setShowOutOfStock] = useState(false);

  // Always include Cody B in the brand filter
  const selectedBrands = [CODY_B_BRAND];

  // Regular products query (excludes apparel items)
  const {
    data: regularProducts,
    isPending: regularProductsLoading,
    isError: regularProductsError,
    error: regularProductsErrorMessage,
    isFetching: regularProductsFetching,
    isPlaceholderData: regularProductsPlaceholderData,
  } = useQuery({
    queryKey: [
      "products",
      "codyb-regular",
      {
        page: activeTab === "products" ? page : 1,
        pageSize,
        selectedBrands,
        selectedCategories,
        selectedColors,
        selectedEffects,
        searchTitle,
        inStock: showOutOfStock ? undefined : true,
        isApparel: false, // Exclude apparel items
      },
    ],
    queryFn: () =>
      getAllProductsQuery({
        page: activeTab === "products" ? page : 1,
        pageSize,
        selectedBrands,
        selectedCategories,
        selectedColors,
        selectedEffects,
        searchTitle,
        inStock: showOutOfStock ? undefined : true,
        isApparel: false, // Exclude apparel items
      }),
    placeholderData: keepPreviousData,
  });

  // Apparel products query (only apparel items)
  const {
    data: apparelProducts,
    isPending: apparelProductsLoading,
    isError: apparelProductsError,
    error: apparelProductsErrorMessage,
    isFetching: apparelProductsFetching,
    isPlaceholderData: apparelProductsPlaceholderData,
  } = useQuery(
    getAllApparelQueryOptions({
      page: activeTab === "products" ? page : 1,
      pageSize,
      selectedBrands,
      selectedCategories,
      selectedColors,
      selectedApparelTypes,
      selectedGenders,
      selectedSizes,
      searchTitle,
      showOutOfStock,
      isFetching: false,
      isPlaceholderData: false,
      setPage: () => {},
      hasMore: false,
      setPageAmount: () => {},
    })
  );

  // Shows query
  const {
    data: showsData,
    isPending: showsLoading,
    isError: showsError,
    error: showsErrorMessage,
    isFetching: showsFetching,
  } = useQuery({
    ...getShowsByBrandQueryOptions(CODY_B_BRAND, {
      page: activeTab === "shows" ? page : 1,
      pageSize,
      typeId: selectedShowType || undefined,
      searchTitle,
    }),
  });

  // Show types query
  const { data: showTypes } = useQuery(getAllShowTypesQueryOptions());

  // Combine regular products and apparel products for display
  const combinedProducts = React.useMemo(() => {
    if (!regularProducts && !apparelProducts) return null;

    const regularItems = regularProducts?.contents || [];
    const apparelItems = apparelProducts?.contents || [];

    // Sort combined products by title or any other criteria
    const allProducts = [...regularItems, ...apparelItems].sort((a, b) =>
      a.title.localeCompare(b.title)
    );

    return {
      contents: allProducts,
      totalItems:
        (regularProducts?.totalItems || 0) + (apparelProducts?.totalItems || 0),
      hasMore:
        regularProducts?.hasMore || false || apparelProducts?.hasMore || false,
      currentPage: page,
      totalPages: Math.max(
        regularProducts?.totalPages || 0,
        apparelProducts?.totalPages || 0
      ),
    };
  }, [regularProducts, apparelProducts, page]);

  const updateUrl = useCallback(() => {
    const searchParams: Record<string, string | string[]> = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      tab: activeTab,
    };

    if (searchTitle) searchParams.searchTitle = searchTitle;
    if (selectedCategories.length > 0)
      searchParams.categories = selectedCategories;
    if (selectedColors.length > 0) searchParams.colors = selectedColors;
    if (selectedEffects.length > 0) searchParams.effects = selectedEffects;
    if (selectedApparelTypes.length > 0)
      searchParams.apparelTypes = selectedApparelTypes;
    if (selectedGenders.length > 0) searchParams.genders = selectedGenders;
    if (selectedSizes.length > 0) searchParams.sizes = selectedSizes;
    if (selectedShowType) searchParams.showType = selectedShowType;
    if (showOutOfStock) searchParams.showOutOfStock = "true";

    navigate({
      search: () => {
        const newSearch: Record<string, string | string[]> = {
          page: searchParams.page,
          pageSize: searchParams.pageSize,
          tab: searchParams.tab,
        };

        if ("searchTitle" in searchParams)
          newSearch.searchTitle = searchParams.searchTitle;
        if ("categories" in searchParams)
          newSearch.categories = searchParams.categories;
        if ("colors" in searchParams) newSearch.colors = searchParams.colors;
        if ("effects" in searchParams) newSearch.effects = searchParams.effects;
        if ("apparelTypes" in searchParams)
          newSearch.apparelTypes = searchParams.apparelTypes;
        if ("genders" in searchParams) newSearch.genders = searchParams.genders;
        if ("sizes" in searchParams) newSearch.sizes = searchParams.sizes;
        if ("showType" in searchParams)
          newSearch.showType = searchParams.showType;
        if ("showOutOfStock" in searchParams)
          newSearch.showOutOfStock = searchParams.showOutOfStock;

        return newSearch;
      },
      replace: true,
    });
  }, [
    navigate,
    page,
    pageSize,
    activeTab,
    selectedCategories,
    selectedColors,
    selectedEffects,
    selectedApparelTypes,
    selectedGenders,
    selectedSizes,
    selectedShowType,
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
        setPage(1);
        return newValues;
      });
    },
    []
  );

  const handleTabChange = (tab: "products" | "shows") => {
    setActiveTab(tab);
    setPage(1);
    // Clear filters that don't apply to the new tab
    if (tab === "shows") {
      setSelectedCategories([]);
      setSelectedColors([]);
      setSelectedEffects([]);
      setSelectedApparelTypes([]);
      setSelectedGenders([]);
      setSelectedSizes([]);
    } else {
      setSelectedShowType(null);
    }
  };

  useEffect(() => {
    updateUrl();
  }, [updateUrl]);

  // Loading states
  const isInitialLoading =
    (regularProductsLoading || apparelProductsLoading || showsLoading) &&
    !combinedProducts &&
    !showsData;

  const isTabSpecificError =
    (activeTab === "products" &&
      (regularProductsError || apparelProductsError)) ||
    (activeTab === "shows" && showsError);

  const errorMessage =
    activeTab === "products"
      ? regularProductsErrorMessage || apparelProductsErrorMessage
      : showsErrorMessage;

  if (isInitialLoading) return <div>Loading Cody B collection...</div>;
  if (isTabSpecificError) return <div>Error: {errorMessage?.message}</div>;

  const currentData = activeTab === "products" ? combinedProducts : showsData;
  const isFetching =
    activeTab === "products"
      ? regularProductsFetching || apparelProductsFetching
      : showsFetching;
  const isPlaceholderData =
    activeTab === "products"
      ? regularProductsPlaceholderData || apparelProductsPlaceholderData
      : false;

  return (
    <div className="min-h-screen bg-base-200">
      {/* Cody B Brand Header */}
      <div className="bg-gradient-to-r from-primary to-secondary py-8 mb-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-primary-content">
            <h1 className="text-4xl font-bold mb-2">Cody B Fireworks</h1>
            <p className="text-lg opacity-90">
              Premium Quality Fireworks - Discover the Cody B Collection
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <div className="badge badge-accent badge-lg">
                {combinedProducts?.totalItems || 0} Products
              </div>
              <div className="badge badge-accent badge-lg">
                {showsData?.pagination?.total || 0} Shows
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 mb-6">
        <div className="tabs tabs-boxed justify-center">
          <button
            className={`tab tab-lg ${activeTab === "products" ? "tab-active" : ""}`}
            onClick={() => handleTabChange("products")}
          >
            <span className="mr-2">🎆</span>
            Products ({combinedProducts?.totalItems || 0})
            {(regularProductsFetching || apparelProductsFetching) &&
              activeTab !== "products" && (
                <span className="loading loading-spinner loading-xs ml-2"></span>
              )}
          </button>
          <button
            className={`tab tab-lg ${activeTab === "shows" ? "tab-active" : ""}`}
            onClick={() => handleTabChange("shows")}
          >
            <span className="mr-2">🎪</span>
            Shows ({showsData?.pagination?.total || 0})
            {showsFetching && activeTab !== "shows" && (
              <span className="loading loading-spinner loading-xs ml-2"></span>
            )}
          </button>
        </div>
      </div>

      <div className="flex min-h-screen max-lg:flex-col max-lg:items-center">
        <div className="flex-shrink-0 max-lg:w-40">
          <FilterPanel
            searchTitle={searchTitle}
            setSearchTitle={(value) => {
              setSearchTitle(value);
              setPage(1);
            }}
            selectedBrands={selectedBrands}
            setSelectedBrands={() => {}}
            hideBrandFilter={true}
            // Product filters (only show for products tab)
            selectedCategories={
              activeTab === "products" ? selectedCategories : []
            }
            setSelectedCategories={
              activeTab === "products"
                ? (category: string) =>
                    handleFilterChange(setSelectedCategories, category)
                : () => {}
            }
            selectedColors={activeTab === "products" ? selectedColors : []}
            setSelectedColors={
              activeTab === "products"
                ? (color: string) =>
                    handleFilterChange(setSelectedColors, color)
                : () => {}
            }
            selectedEffects={activeTab === "products" ? selectedEffects : []}
            setSelectedEffects={
              activeTab === "products"
                ? (effect: string) =>
                    handleFilterChange(setSelectedEffects, effect)
                : () => {}
            }
            // Apparel-specific filters (only show for products tab)
            selectedApparelTypes={
              activeTab === "products" ? selectedApparelTypes : []
            }
            setSelectedApparelTypes={
              activeTab === "products"
                ? (apparelType: string) =>
                    handleFilterChange(setSelectedApparelTypes, apparelType)
                : () => {}
            }
            selectedGenders={activeTab === "products" ? selectedGenders : []}
            setSelectedGenders={
              activeTab === "products"
                ? (gender: string) =>
                    handleFilterChange(setSelectedGenders, gender)
                : () => {}
            }
            selectedSizes={activeTab === "products" ? selectedSizes : []}
            setSelectedSizes={
              activeTab === "products"
                ? (size: string) => handleFilterChange(setSelectedSizes, size)
                : () => {}
            }
            // Show filters (only show for shows tab)
            showFilters={activeTab === "shows"}
            showTypes={showTypes}
            selectedShowType={activeTab === "shows" ? selectedShowType : null}
            setSelectedShowType={
              activeTab === "shows" ? setSelectedShowType : () => {}
            }
            // Common filters
            showOutOfStock={showOutOfStock}
            setShowOutOfStock={(value) => {
              setShowOutOfStock(value);
              setPage(1);
            }}
            isFetching={isFetching}
            isPlaceholderData={isPlaceholderData}
            setPage={setPage}
            page={page}
            hasMore={currentData?.hasMore ?? false}
            pageSize={pageSize}
            setPageAmount={(value) => {
              setPageSize(value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex flex-col sm:p-4 flex-1">
          {/* Results Summary */}
          <div className="bg-base-100 p-4 mb-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <h2 className="text-xl font-semibold">
                  Cody B {activeTab === "products" ? "Products" : "Shows"}
                  {searchTitle && (
                    <span className="text-primary"> - "{searchTitle}"</span>
                  )}
                </h2>
                <p className="text-sm text-gray-600">
                  Showing{" "}
                  {activeTab === "products"
                    ? combinedProducts?.contents.length || 0
                    : showsData?.shows.length || 0}{" "}
                  of{" "}
                  {activeTab === "products"
                    ? combinedProducts?.totalItems || 0
                    : showsData?.pagination?.total || 0}{" "}
                  {activeTab}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-2">
                {activeTab === "products" && (
                  <>
                    {selectedCategories.length > 0 && (
                      <div className="badge badge-outline">
                        {selectedCategories.length} Categories
                      </div>
                    )}
                    {selectedColors.length > 0 && (
                      <div className="badge badge-outline">
                        {selectedColors.length} Colors
                      </div>
                    )}
                    {selectedEffects.length > 0 && (
                      <div className="badge badge-outline">
                        {selectedEffects.length} Effects
                      </div>
                    )}
                    {selectedApparelTypes.length > 0 && (
                      <div className="badge badge-outline">
                        {selectedApparelTypes.length} Apparel Types
                      </div>
                    )}
                    {selectedGenders.length > 0 && (
                      <div className="badge badge-outline">
                        {selectedGenders.length} Genders
                      </div>
                    )}
                    {selectedSizes.length > 0 && (
                      <div className="badge badge-outline">
                        {selectedSizes.length} Sizes
                      </div>
                    )}
                  </>
                )}
                {activeTab === "shows" && selectedShowType && (
                  <div className="badge badge-outline">
                    {showTypes?.find((t) => t.id === selectedShowType)?.name ||
                      "Show Type"}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-base-100 sm:p-4">
            {(
              activeTab === "products"
                ? combinedProducts?.contents.length === 0
                : showsData?.shows.length === 0
            ) ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">
                  {activeTab === "products" ? "🎆" : "🎪"}
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  No Cody B {activeTab === "products" ? "Products" : "Shows"}{" "}
                  Found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search terms to find more{" "}
                  {activeTab}.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSearchTitle("");
                    if (activeTab === "products") {
                      setSelectedCategories([]);
                      setSelectedColors([]);
                      setSelectedEffects([]);
                      setSelectedApparelTypes([]);
                      setSelectedGenders([]);
                      setSelectedSizes([]);
                    } else {
                      setSelectedShowType(null);
                    }
                    setPage(1);
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-4 sm:p-4">
                {activeTab === "products"
                  ? combinedProducts?.contents.map((product: TProduct) => {
                      if (product.isApparel) {
                        return (
                          <ApparelProductCard
                            key={product.id}
                            product={product}
                            searchParams={search}
                          />
                        );
                      } else {
                        return (
                          <ProductCard
                            key={product.id}
                            product={product}
                            searchParams={search}
                          />
                        );
                      }
                    })
                  : showsData?.shows.map((show) => (
                      <ShowCard key={show.id} show={show} />
                    ))}
              </div>
            )}
          </div>

          <div className="bg-base-100 lg:p-4">
            <PageButtons
              isFetching={isFetching}
              isPlaceholderData={isPlaceholderData}
              setPage={setPage}
              page={page}
              hasMore={
                activeTab === "products"
                  ? (combinedProducts?.hasMore ?? false)
                  : (showsData?.pagination?.page || 0) <
                    (showsData?.pagination?.totalPages || 0)
              }
              pageSize={pageSize}
              setPageAmount={(value) => {
                setPageSize(value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {isFetching && (
          <div className="fixed bottom-4 right-4 bg-primary text-primary-content px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <span className="loading loading-spinner loading-sm"></span>
              Updating results...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/codyb")({
  component: CodyBPage,
  validateSearch: z.object({
    page: z.coerce.number().optional().default(1),
    pageSize: z.coerce.number().optional().default(25),
    tab: z.enum(["products", "shows"]).optional().default("products"),
    categories: z.union([z.string(), z.array(z.string())]).optional(),
    colors: z.union([z.string(), z.array(z.string())]).optional(),
    effects: z.union([z.string(), z.array(z.string())]).optional(),
    apparelTypes: z.union([z.string(), z.array(z.string())]).optional(),
    genders: z.union([z.string(), z.array(z.string())]).optional(),
    sizes: z.union([z.string(), z.array(z.string())]).optional(),
    showType: z.string().optional(),
    searchTitle: z.string().optional(),
    showOutOfStock: z.enum(["true", "false"]).optional(),
  }),
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) => {
    const page = Number(deps.page) || 1;
    const pageSize = Number(deps.pageSize) || 25;
    const activeTab = deps.tab || "products";
    const selectedBrands = ["CODY_B"];

    // Prepare filter arrays
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
    const selectedApparelTypes = Array.isArray(deps.apparelTypes)
      ? deps.apparelTypes.filter(Boolean)
      : typeof deps.apparelTypes === "string"
        ? deps.apparelTypes.split(",").filter(Boolean)
        : [];
    const selectedGenders = Array.isArray(deps.genders)
      ? deps.genders.filter(Boolean)
      : typeof deps.genders === "string"
        ? deps.genders.split(",").filter(Boolean)
        : [];
    const selectedSizes = Array.isArray(deps.sizes)
      ? deps.sizes.filter(Boolean)
      : typeof deps.sizes === "string"
        ? deps.sizes.split(",").filter(Boolean)
        : [];
    const searchTitle = deps.searchTitle || "";
    const showOutOfStock = deps.showOutOfStock === "true";

    // Load regular products (non-apparel)
    const regularProductsPromise = queryClient.ensureQueryData(
      getAllProductsQueryOptions({
        page: activeTab === "products" ? page : 1,
        pageSize,
        selectedBrands,
        selectedCategories,
        selectedColors,
        selectedEffects,
        searchTitle,
        inStock: showOutOfStock ? undefined : true,
        isApparel: false,
      })
    );

    const apparelProductsPromise = queryClient.ensureQueryData(
      getAllApparelQueryOptions({
        page: activeTab === "products" ? page : 1,
        pageSize,
        selectedBrands,
        selectedCategories,
        selectedColors,
        selectedApparelTypes,
        selectedGenders,
        selectedSizes,
        searchTitle,
        showOutOfStock,
        isFetching: false,
        isPlaceholderData: false,
        setPage: () => {},
        hasMore: false,
        setPageAmount: () => {},
      })
    );

    const showsPromise = queryClient.ensureQueryData(
      getShowsByBrandQueryOptions("CODY_B", {
        page: activeTab === "shows" ? page : 1,
        pageSize,
        typeId: deps.showType || undefined,
        searchTitle: deps.searchTitle || "",
      })
    );

    const showTypesPromise = queryClient.ensureQueryData(
      getAllShowTypesQueryOptions()
    );

    return Promise.all([
      regularProductsPromise,
      apparelProductsPromise,
      showsPromise,
      showTypesPromise,
    ]);
  },
});
