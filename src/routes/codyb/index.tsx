// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import { createFileRoute } from "@tanstack/react-router";

const CodyBApparel: React.FC = () => {
  return <div>Apparel Coming Soon</div>;

  // const navigate = useNavigate();
  // const search = Route.useSearch();

  // const [selectedColors, setSelectedColors] = useState<string[]>(() =>
  //   Array.isArray(search.colors)
  //     ? search.colors.filter(Boolean)
  //     : typeof search.colors === "string"
  //       ? search.colors.split(",").filter(Boolean)
  //       : []
  // );

  // const [selectedSizes, setSelectedSizes] = useState<string[]>(() =>
  //   Array.isArray(search.sizes)
  //     ? search.sizes.filter(Boolean)
  //     : typeof search.sizes === "string"
  //       ? search.sizes.split(",").filter(Boolean)
  //       : []
  // );

  // const [selectedStyles, setSelectedStyles] = useState<string[]>(() =>
  //   Array.isArray(search.styles)
  //     ? search.styles.filter(Boolean)
  //     : typeof search.styles === "string"
  //       ? search.styles.split(",").filter(Boolean)
  //       : []
  // );

  // const [page, setPage] = useState(() => Number(search.page) || 1);
  // const [pageSize, setPageSize] = useState(() => Number(search.pageSize) || 25);
  // const [searchTitle, setSearchTitle] = useState(search.searchTitle || "");
  // const [showOutOfStock, setShowOutOfStock] = useState(false);

  // const {
  //   data: products,
  //   isPending,
  //   isError,
  //   error,
  //   isFetching,
  //   isPlaceholderData,
  // } = useQuery({
  //   queryKey: [
  //     "apparelProducts",
  //     {
  //       page,
  //       pageSize,
  //       selectedColors,
  //       selectedSizes,
  //       selectedStyles,
  //       searchTitle,
  //       inStock: showOutOfStock ? undefined : true,
  //       brand: "codyb",
  //       category: "apparel",
  //     },
  //   ],
  //   queryFn: () =>
  //     getApparelProductsQuery({
  //       page,
  //       pageSize,
  //       selectedColors,
  //       selectedSizes,
  //       selectedStyles,
  //       searchTitle,
  //       inStock: showOutOfStock ? undefined : true,
  //       brand: "codyb",
  //       category: "apparel",
  //     }),
  //   placeholderData: keepPreviousData,
  // });

  // const updateUrl = useCallback(() => {
  //   const searchParams: Record<string, string | string[]> = {
  //     page: page.toString(),
  //     pageSize: pageSize.toString(),
  //   };

  //   if (searchTitle) searchParams.searchTitle = searchTitle;
  //   if (selectedColors.length > 0) searchParams.colors = selectedColors;
  //   if (selectedSizes.length > 0) searchParams.sizes = selectedSizes;
  //   if (selectedStyles.length > 0) searchParams.styles = selectedStyles;

  //   navigate({
  //     search: () => {
  //       // Start with a fresh object to avoid carrying over old filter values
  //       const newSearch: Record<string, string | string[]> = {
  //         page: searchParams.page,
  //         pageSize: searchParams.pageSize,
  //       };

  //       // Only add filters that are present in the current searchParams
  //       if ("searchTitle" in searchParams)
  //         newSearch.searchTitle = searchParams.searchTitle;
  //       if ("colors" in searchParams) newSearch.colors = searchParams.colors;
  //       if ("sizes" in searchParams) newSearch.sizes = searchParams.sizes;
  //       if ("styles" in searchParams) newSearch.styles = searchParams.styles;
  //       if (showOutOfStock) searchParams.showOutOfStock = "true";

  //       return newSearch;
  //     },
  //     replace: true,
  //   });
  // }, [
  //   navigate,
  //   page,
  //   pageSize,
  //   selectedColors,
  //   selectedSizes,
  //   selectedStyles,
  //   searchTitle,
  //   showOutOfStock,
  // ]);

  // const handleFilterChange = useCallback(
  //   <T extends string>(
  //     setter: React.Dispatch<React.SetStateAction<T[]>>,
  //     value: T
  //   ) => {
  //     setter((prev) => {
  //       const newValues = prev.includes(value)
  //         ? prev.filter((item) => item !== value)
  //         : [...prev, value];
  //       setPage(1); // Reset to first page when filter changes
  //       return newValues;
  //     });
  //   },
  //   []
  // );

  // useEffect(() => {
  //   updateUrl();
  // }, [updateUrl]);

  // if (isPending) return <div>Loading...</div>;
  // if (isError) return <div>Error: {error.message}</div>;

  // return (
  //   <div className="flex min-h-screen max-lg:flex-col max-lg:items-center">
  //     <div className="flex-shrink-0 max-lg:w-40">
  //       <FilterPanel
  //         searchTitle={searchTitle}
  //         setSearchTitle={(value) => {
  //           setSearchTitle(value);
  //           setPage(1);
  //         }}
  //         selectedColors={selectedColors}
  //         setSelectedColors={(color: string) =>
  //           handleFilterChange(setSelectedColors, color)
  //         }
  //         selectedSizes={selectedSizes}
  //         setSelectedSizes={(size: string) =>
  //           handleFilterChange(setSelectedSizes, size)
  //         }
  //         selectedStyles={selectedStyles}
  //         setSelectedStyles={(style: string) =>
  //           handleFilterChange(setSelectedStyles, style)
  //         }
  //         showOutOfStock={showOutOfStock}
  //         setShowOutOfStock={(value) => {
  //           setShowOutOfStock(value);
  //           setPage(1);
  //         }}
  //         isFetching={isFetching}
  //         isPlaceholderData={isPlaceholderData}
  //         setPage={setPage}
  //         page={page}
  //         hasMore={products?.hasMore ?? false}
  //         pageSize={pageSize}
  //         setPageAmount={(value) => {
  //           setPageSize(value);
  //           setPage(1);
  //         }}
  //         // Indicate this is CodyB Apparel specific
  //         isCodyBApparel={true}
  //       />
  //     </div>
  //     <div className="flex flex-col sm:p-4">
  //       <h1 className="text-2xl font-bold mb-4">CodyB Apparel Collection</h1>
  //       <div className="bg-base-100 sm:p-4">
  //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:p-4">
  //           {products?.contents.map((product: TProduct) => (
  //             <ProductCard
  //               key={product.id}
  //               product={product}
  //               searchParams={search}
  //             />
  //           ))}
  //         </div>
  //       </div>

  //       <div className="bg-base-100 lg:p-4">
  //         <PageButtons
  //           isFetching={isFetching}
  //           isPlaceholderData={isPlaceholderData}
  //           setPage={setPage}
  //           page={page}
  //           hasMore={products?.hasMore ?? false}
  //           pageSize={pageSize}
  //           setPageAmount={(value) => {
  //             setPageSize(value);
  //             setPage(1);
  //           }}
  //         />
  //       </div>
  //     </div>
  //     {isFetching && <div>Fetching...</div>}
  //   </div>
  // );
};

export const Route = createFileRoute("/codyb/")({
  component: CodyBApparel,
});
