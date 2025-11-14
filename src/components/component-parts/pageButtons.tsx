import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type React from "react";

type PageButtonsProps = {
	isFetching: boolean;
	isPlaceholderData: boolean;
	setPage: (value: number | ((prevValue: number) => number)) => void;
	page: number;
	hasMore: boolean;
	pageSize: number;
	setPageAmount: (value: number) => void;
};

export const PageButtons: React.FC<PageButtonsProps> = ({
	isFetching,
	isPlaceholderData,
	setPage,
	page,
	hasMore,
	pageSize,
	setPageAmount,
}) => {
	return (
		<div className="flex text-sm justify-end flex-wrap p-4 max-md:justify-center">
			<div className="join flex justify-center items-center p-1">
				<button
					className="btn btn-square btn-secondary btn-outline join-item text-sm"
					onClick={() => setPage((old) => Math.max(old - 1, 1))}
					disabled={page === 1}
				>
					<FontAwesomeIcon icon={faArrowLeft} />
				</button>
				<span className="join-item btn btn-secondary btn-outline font-normal text-sm">
					Page {page}
				</span>
				<button
					className="btn btn-square btn-secondary btn-outline join-item text-sm"
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
				{[10, 25, 50].map((size) => (
					<button
						key={size}
						className={`btn btn-secondary join-item font-normal ${
							pageSize === size ? "btn-primary" : "btn-outline"
						}`}
						onClick={() => setPageAmount(size)}
					>
						{size} items
					</button>
				))}
			</div>
		</div>
	);
};
