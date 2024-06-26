import { createFileRoute } from "@tanstack/react-router";

import { ProductCard } from "../../components/product-card";

import { getAllProductsQueryOptions } from "../../api/products/productsQueries";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { TProduct } from "../../types";
import { Dispatch, SetStateAction, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { getAllProductsQuery } from "../../api/products/products";

const PageButtons = ({
  isFetching,
  isPlaceholderData,
  setPage,
  page,
  hasMore,
  pageSize,
  setPageAmount,
}: {
  isFetching: boolean;
  isPlaceholderData: boolean;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
  hasMore: boolean;
  pageSize: number;
  setPageAmount: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div className="flex max-md:flex-col justify-center p-3">
      <div className="join flex justify-center items-center p-6">
        <button
          className="btn btn-square btn-outline join-item"
          onClick={() => setPage((old) => Math.max(old - 1, 0))}
          disabled={page === 1}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <span className="join-item btn btn-outline">Page {page}</span>
        <button
          className="btn btn-square btn-outline join-item"
          onClick={() => {
            if (!isPlaceholderData && hasMore) {
              setPage((old) => old + 1);
            }
          }}
          disabled={isPlaceholderData || !hasMore}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        {isFetching ? <span className="join-item ml-3">Loading...</span> : null}
      </div>

      <div className="join flex justify-center items-center ml-6">
        <button
          className={`btn join-item ${pageSize === 10 ? "btn-primary" : "btn-outline"}`}
          onClick={() => setPageAmount(10)}
        >
          10 items
        </button>
        <button
          className={`btn join-item ${pageSize === 25 ? "btn-primary" : "btn-outline"}`}
          onClick={() => setPageAmount(25)}
        >
          25 items
        </button>
        <button
          className={`btn join-item ${pageSize === 50 ? "btn-primary" : "btn-outline"}`}
          onClick={() => setPageAmount(50)}
        >
          50 items
        </button>
      </div>
    </div>
  );
};

const Products = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const {
    isPending,
    isError,
    error,
    data: products,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["products", page, pageSize],
    queryFn: () => getAllProductsQuery({ page, pageSize }),
    placeholderData: keepPreviousData,
  });

  return (
    <>
      {isPending ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <>
          <PageButtons
            isFetching={isFetching}
            isPlaceholderData={isPlaceholderData}
            setPage={setPage}
            page={page}
            hasMore={products.hasMore}
            pageSize={pageSize}
            setPageAmount={setPageSize}
          />
          <div className="flex flex-wrap gap-4 p-6 h-[900px] overflow-y-auto justify-center bg-primary">
            {products.contents.map((product: TProduct) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <PageButtons
            isFetching={isFetching}
            isPlaceholderData={isPlaceholderData}
            setPage={setPage}
            page={page}
            hasMore={products.hasMore}
            pageSize={pageSize}
            setPageAmount={setPageSize}
          />
        </>
      )}
    </>
  );
};

export const Route = createFileRoute("/products/")({
  component: () => <Products />,
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(
      getAllProductsQueryOptions({ page: 1, pageSize: 25 })
    );
  },
});
