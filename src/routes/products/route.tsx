import { createFileRoute } from "@tanstack/react-router";

import { ProductCard } from "../../components/product-card";

import { getAllProductsQueryOptions } from "../../api/productsQueries";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { TProduct } from "../../types";
import { useState } from "react";

export const Route = createFileRoute("/products")({
  component: () => <Products />,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(
      getAllProductsQueryOptions({ page: 1, pageSize: 25 })
    );
  },
});

function Products() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const {
    isPending,
    isError,
    error,
    data: products,
    isFetching,
    isPlaceholderData,
  } = useQuery(getAllProductsQueryOptions({ page, pageSize }));

  return (
    <>
      {isPending ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div className="flex flex-wrap gap-4 p-6 h-[900px] overflow-y-auto justify-center bg-primary">
          {products.contents.map((product: TProduct) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <span>Current Page: {page}</span>
      <button
        className="btn btn-square btn-outline"
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 1}
      >
        Previous Page
      </button>{" "}
      <button
        className="btn btn-square btn-outline"
        onClick={() => {
          if (!isPlaceholderData && products.hasMore) {
            setPage((old) => old + 1);
          }
        }}
        // Disable the Next Page button until we know a next page is available
        disabled={isPlaceholderData || !products?.hasMore}
      >
        Next Page
      </button>
      {isFetching ? <span> Loading...</span> : null}{" "}
    </>
  );
}
