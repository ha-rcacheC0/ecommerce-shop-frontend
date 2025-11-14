/* eslint-disable @typescript-eslint/no-explicit-any */

import {
	type faEdit,
	faPlus,
	faSearch,
	faSort,
	faSortDown,
	faSortUp,
	type faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import {
	type ColumnDef,
	type FilterFn,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type Row,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { PageButtons } from "./pageButtons";

// Action button interface
export interface ActionButton<T> {
	icon: typeof faEdit | typeof faTrash | typeof faPlus;
	label?: string;
	color: string; // e.g., "primary", "warning", "error"
	onClick?: (item: T) => void;
	to?: string;
	getParams?: (item: T) => Record<string, any>;
	isDisabled?: (item: T) => boolean;
}

// Table props interface
export interface DataTableProps<T extends Record<string, unknown>> {
	title?: string;
	data: T[] | undefined;
	columns: ColumnDef<T>[];
	actions?: ActionButton<T>[];
	isLoading: boolean;
	isError: boolean;
	errorMessage?: string;
	createButton?: {
		label: string;
		to: string;
	};
	searchConfig?: {
		placeholder: string;
		searchTerm: string;
		onSearch: (value: string) => void;
		globalFilterFn?: FilterFn<T>;
	};
	pagination?: {
		manualPagination?: boolean;
		currentPage: number;
		pageSize: number;
		setPage: (value: number | ((prevValue: number) => number)) => void;
		setPageSize: (size: number) => void;
		hasMore: boolean;
		isFetching: boolean;
		isPlaceholderData: boolean;
		totalRows?: number;
	};
	rowClassName?: string | ((item: T) => string);
	emptyMessage?: string;
	initialSorting?: SortingState;
	manualSorting?: boolean;
	hidePagination?: boolean; // Optional prop to hide pagination
	onSortingChange?: (sorting: SortingState) => void;
}

// Default global filter function that searches across all fields
function defaultGlobalFilter<T extends Record<string, unknown>>(
	row: Row<T>,
	_columnId: string,
	filterValue: string,
): boolean {
	const searchValue = filterValue.toLowerCase();
	const original = row.original;

	// Search through all values in the row
	return Object.entries(original).some(([_key, value]) => {
		// Handle nested objects (like product.title)
		if (value && typeof value === "object" && !Array.isArray(value)) {
			return Object.values(value as Record<string, unknown>).some(
				(nestedValue) =>
					String(nestedValue).toLowerCase().includes(searchValue),
			);
		}

		// Handle arrays
		if (Array.isArray(value)) {
			return value.some((item) =>
				String(item).toLowerCase().includes(searchValue),
			);
		}

		// Handle regular values
		return String(value).toLowerCase().includes(searchValue);
	});
}

// The reusable DataTable component using TanStack Table
export function DataTable<T extends Record<string, unknown>>({
	title,
	data = [],
	columns,
	actions,
	isLoading,
	isError,
	errorMessage = "Error loading data",
	createButton,
	searchConfig,
	pagination = {
		currentPage: 1,
		pageSize: 25,
		setPage: () => {},
		setPageSize: () => {},
		hasMore: false,
		isFetching: false,
		isPlaceholderData: false,
		totalRows: data?.length,
		manualPagination: true,
	},
	rowClassName = "text-base-content hover:bg-primary hover:text-primary-content group",
	emptyMessage = "No data found.",
	initialSorting = [],
	manualSorting = false,
	onSortingChange,
	hidePagination = false,
}: DataTableProps<T>) {
	// Table state
	const [sorting, setSorting] = useState<SortingState>(initialSorting);
	const [globalFilter, setGlobalFilter] = useState(
		searchConfig?.searchTerm || "",
	);

	// Prepare action column if needed
	const tableColumns = [...columns];

	if (actions && actions.length > 0) {
		tableColumns.push({
			id: "actions",
			header: "Actions",
			cell: ({ row }) => (
				<div className="flex space-x-2">
					{actions.map((action, actionIndex) => {
						const item = row.original;
						const isDisabled = action.isDisabled
							? action.isDisabled(item)
							: false;

						if (action.to) {
							const params = action.getParams ? action.getParams(item) : {};
							return (
								<Link
									key={actionIndex}
									to={action.to}
									params={params}
									className={`btn btn-sm btn-${action.color} group-hover:shadow-lg group-hover:ring-2 group-hover:ring-white group-hover:ring-opacity-70`}
								>
									<FontAwesomeIcon icon={action.icon} />
									{action.label && <span className="ml-2">{action.label}</span>}
								</Link>
							);
						} else {
							return (
								<button
									key={actionIndex}
									className={`btn btn-sm btn-${action.color} group-hover:shadow-lg group-hover:ring-2 group-hover:ring-white group-hover:ring-opacity-70`}
									onClick={() => action.onClick?.(item)}
									disabled={isDisabled}
								>
									<FontAwesomeIcon icon={action.icon} />
									{action.label && <span className="ml-2">{action.label}</span>}
								</button>
							);
						}
					})}
				</div>
			),
		});
	}

	// Initialize the table
	const table = useReactTable({
		data: data || [],
		columns: tableColumns,
		state: {
			sorting,
			globalFilter: searchConfig?.searchTerm || globalFilter,
			pagination: pagination
				? {
						pageIndex: pagination.currentPage - 1,
						pageSize: pagination.pageSize,
					}
				: undefined,
		},
		onSortingChange: (updater) => {
			const newSorting =
				typeof updater === "function" ? updater(sorting) : updater;
			setSorting(newSorting);
			if (onSortingChange) {
				onSortingChange(newSorting);
			}
		},
		onGlobalFilterChange: (value) => {
			setGlobalFilter(value);
			if (searchConfig?.onSearch) {
				searchConfig.onSearch(value);
			}
		},
		globalFilterFn: searchConfig?.globalFilterFn || defaultGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualSorting,
		manualPagination: pagination?.manualPagination || false,
		manualFiltering: !!searchConfig?.globalFilterFn,
		rowCount: pagination?.totalRows || data?.length || 0,
	});

	// Handle loading state
	if (isLoading) return <div className="text-center">Loading...</div>;

	// Handle error state
	if (isError)
		return <div className="text-center text-error">{errorMessage}</div>;

	// Handle empty data
	if (!data || data.length === 0) {
		return (
			<div className="text-center py-8">
				{(title || createButton || searchConfig) && (
					<div className="flex justify-between items-center mb-4">
						{title && <h2 className="text-2xl font-bold">{title}</h2>}

						<div className="flex gap-4 items-center">
							{/* Search input */}
							{searchConfig && (
								<div className="form-control">
									<div className="input-group flex gap-2">
										<input
											type="text"
											placeholder={searchConfig.placeholder}
											className="input input-bordered"
											value={globalFilter}
											onChange={(e) => table.setGlobalFilter(e.target.value)}
										/>
										<button className="btn btn-square">
											<FontAwesomeIcon icon={faSearch} />
										</button>
									</div>
								</div>
							)}

							{/* Create button */}
							{createButton && (
								<Link to={createButton.to} className="btn btn-primary">
									<FontAwesomeIcon icon={faPlus} className="mr-2" />
									{createButton.label}
								</Link>
							)}
						</div>
					</div>
				)}
				{emptyMessage}
			</div>
		);
	}

	return (
		<div className="mx-auto my-4 w-full">
			{/* Header with title and create button */}
			{(title || createButton || searchConfig) && (
				<div className="flex justify-between items-center mb-4">
					{title && <h2 className="text-2xl font-bold">{title}</h2>}

					<div className="flex gap-4 items-center">
						{/* Search input */}
						{searchConfig && (
							<div className="form-control">
								<div className="input-group flex gap-2">
									<input
										type="text"
										placeholder={searchConfig.placeholder}
										className="input input-bordered"
										value={globalFilter}
										onChange={(e) => table.setGlobalFilter(e.target.value)}
									/>
									<button className="btn btn-square">
										<FontAwesomeIcon icon={faSearch} />
									</button>
								</div>
							</div>
						)}

						{/* Create button */}
						{createButton && (
							<Link to={createButton.to} className="btn btn-primary">
								<FontAwesomeIcon icon={faPlus} className="mr-2" />
								{createButton.label}
							</Link>
						)}
					</div>
				</div>
			)}

			{/* Pagination */}
			{pagination && !hidePagination && (
				<div className="p-4">
					<PageButtons
						isFetching={pagination.isFetching}
						isPlaceholderData={pagination.isPlaceholderData}
						setPage={(newPage) => {
							const pageIndex =
								typeof newPage === "function"
									? newPage(pagination.currentPage) - 1
									: newPage - 1;
							table.setPageIndex(pageIndex);
							pagination.setPage(pageIndex + 1);
						}}
						page={pagination.currentPage}
						hasMore={pagination.hasMore}
						pageSize={pagination.pageSize}
						setPageAmount={(size) => {
							table.setPageSize(size);
							pagination.setPageSize(size);
						}}
					/>
				</div>
			)}

			{/* Table */}
			<div className="overflow-x-auto bg-base-100 rounded-lg shadow">
				<table className="table w-full">
					<thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									// Get column meta for className
									const columnMeta = header.column.columnDef.meta as
										| Record<string, string>
										| undefined;
									const className = columnMeta?.className || "";

									return (
										<th key={header.id} className={className}>
											{header.isPlaceholder ? null : (
												<div
													className={
														header.column.getCanSort()
															? "flex items-center cursor-pointer select-none"
															: ""
													}
													onClick={header.column.getToggleSortingHandler()}
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
													{header.column.getCanSort() && (
														<span className="ml-2">
															{header.column.getIsSorted() ? (
																header.column.getIsSorted() === "asc" ? (
																	<FontAwesomeIcon icon={faSortUp} size="xs" />
																) : (
																	<FontAwesomeIcon
																		icon={faSortDown}
																		size="xs"
																	/>
																)
															) : (
																<FontAwesomeIcon icon={faSort} size="xs" />
															)}
														</span>
													)}
												</div>
											)}
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.map((row) => {
							const rowClass =
								typeof rowClassName === "function"
									? rowClassName(row.original)
									: rowClassName;

							return (
								<tr key={row.id} className={rowClass}>
									{row.getVisibleCells().map((cell) => {
										// Get column meta for className
										const columnMeta = cell.column.columnDef.meta as
											| Record<string, string>
											| undefined;
										const className = columnMeta?.className || "";

										return (
											<td key={cell.id} className={className}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>

				{/* Pagination */}
				{pagination && !hidePagination && (
					<div className="p-4">
						<PageButtons
							isFetching={pagination.isFetching}
							isPlaceholderData={pagination.isPlaceholderData}
							setPage={(newPage) => {
								const pageIndex =
									typeof newPage === "function"
										? newPage(pagination.currentPage) - 1
										: newPage - 1;
								table.setPageIndex(pageIndex);
								pagination.setPage(pageIndex + 1);
							}}
							page={pagination.currentPage}
							hasMore={pagination.hasMore}
							pageSize={pagination.pageSize}
							setPageAmount={(size) => {
								table.setPageSize(size);
								pagination.setPageSize(size);
							}}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
