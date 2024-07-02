import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";

interface PageButtonsProps {
  isFetching: boolean;
  isPlaceholderData: boolean;
  setPage: Dispatch<SetStateAction<number>>;
  page: number;
  hasMore: boolean;
  pageSize: number;
  setPageAmount: Dispatch<SetStateAction<number>>;
}

export const PageButtons = ({
  isFetching,
  isPlaceholderData,
  setPage,
  page,
  hasMore,
  pageSize,
  setPageAmount,
}: PageButtonsProps) => {
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
          className={`btn join-item ${
            pageSize === 10 ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => setPageAmount(10)}
        >
          10 items
        </button>
        <button
          className={`btn join-item ${
            pageSize === 25 ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => setPageAmount(25)}
        >
          25 items
        </button>
        <button
          className={`btn join-item ${
            pageSize === 50 ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => setPageAmount(50)}
        >
          50 items
        </button>
      </div>
    </div>
  );
};
