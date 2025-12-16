/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/reports/CaseBreakReport.tsx

import {
	getAllCaseBreaksQueryOptions,
	useProcessCaseBreakMutation,
} from "@api/reports/reportQueryOptions.api";
import Modal from "@components/component-parts/Modal";
import {
	faCheck,
	faDownload,
	faExclamationTriangle,
	faHourglassHalf,
	faShippingFast,
	faSpinner,
	faSync,
	faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@providers/auth.provider";
import { useQuery } from "@tanstack/react-query";
import type React from "react";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import type { ReportStatus } from "@/types";

const CaseBreakReport: React.FC = () => {
	const { user } = useAuth();
	const token = user?.token ?? "";
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedItem, setSelectedItem] = useState<{
		id: string;
		quantity: number;
		boxSize: number[];
	} | null>(null);
	const [inputQuantity, setInputQuantity] = useState("");

	// State for date filters
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");

	// State for status filter
	const [statusFilter, setStatusFilter] = useState<ReportStatus | "ALL">("ALL");

	// Handle date changes
	useEffect(() => {
		// Default to today if no dates are set
		if (!startDate && !endDate) {
			const today = new Date();
			today.setUTCHours(23, 59, 59, 999); // Set to end of day in UTC
			setEndDate(today.toISOString().split("T")[0]);
		}
	}, [startDate, endDate]);

	// Format dates with proper UTC time for API requests
	const getFormattedStartDate = (): string => {
		if (!startDate) return "";
		// Set to start of day in UTC (00:00:00.000Z)
		return `${startDate}T00:00:00.000Z`;
	};

	const getFormattedEndDate = (): string => {
		if (!endDate) return "";
		// Set to end of day in UTC (23:59:59.999Z)
		return `${endDate}T23:59:59.999Z`;
	};

	// Fetch case break report data with properly formatted dates
	const {
		data: reportData,
		isLoading,
		isError,
		error,
		refetch,
	} = useQuery(
		getAllCaseBreaksQueryOptions(
			token,
			getFormattedStartDate(),
			getFormattedEndDate(),
			statusFilter !== "ALL" ? statusFilter : undefined,
		),
	);

	// Refetch when statusFilter changes
	useEffect(() => {
		refetch();
	}, [refetch]);

	// Mutation for processing case break requests
	const processMutation = useProcessCaseBreakMutation(
		token,
		() => {
			refetch(); // Refresh data after successful update
		},
		(_e) => {},
	);

	const handleProcessRequest = (
		id: string,
		defaultQuantity: number,
		boxSize: number[],
	) => {
		setSelectedItem({ id, quantity: defaultQuantity, boxSize });
		setInputQuantity(defaultQuantity.toString());

		setIsModalOpen(true);
	};

	const handleConfirm = () => {
		const quantityNum = parseInt(inputQuantity, 10);
		if (Number.isNaN(quantityNum) || quantityNum <= 0) {
			toast.error("Please enter a valid positive number");
			return;
		}

		if (selectedItem) {
			processMutation.mutate({ id: selectedItem.id, quantity: quantityNum });
		}
		setIsModalOpen(false);
		setSelectedItem(null);
	};

	// Handle status filter change
	const handleStatusFilterChange = (
		e: React.ChangeEvent<HTMLSelectElement>,
	) => {
		const newStatus = e.target.value as ReportStatus | "ALL";
		setStatusFilter(newStatus);
	};

	// Get status icon based on status
	const getStatusIcon = (status: ReportStatus) => {
		switch (status) {
			case "PENDING":
				return <FontAwesomeIcon icon={faHourglassHalf} />;
			case "PROCESSING":
				return <FontAwesomeIcon icon={faShippingFast} />;
			case "COMPLETED":
				return <FontAwesomeIcon icon={faCheck} />;
			case "FAILED":
				return <FontAwesomeIcon icon={faTimesCircle} />;
			default:
				return null;
		}
	};

	// Get status badge class based on status
	const getStatusBadgeClass = (status: ReportStatus) => {
		switch (status) {
			case "PENDING":
				return "badge badge-warning";
			case "PROCESSING":
				return "badge badge-info";
			case "COMPLETED":
				return "badge badge-success";
			case "FAILED":
				return "badge badge-error";
			default:
				return "badge";
		}
	};

	// CSV headers for react-csv
	const csvHeaders = [
		{ label: "ID", key: "id" },
		{ label: "Product ID", key: "productId" },
		{ label: "SKU", key: "sku" },
		{ label: "Product", key: "title" },
		{ label: "Quantity", key: "quantity" },
		{ label: "Status", key: "status" },
		{ label: "Date", key: "formattedDate" },
	];

	// Generate a filename for the CSV
	const getCSVFilename = () => {
		const dateStr = new Date().toLocaleDateString().replace(/\//g, "-");
		return `case-break-report-${dateStr}.csv`;
	};

	// Filter data based on status if needed
	const getFilteredData = () => {
		if (!reportData || !reportData.data) return [];

		return reportData.data;
	};

	const filteredData = getFilteredData();

	return (
		<div className="bg-base-100 rounded-lg shadow-lg">
			{/* Filters */}
			<div className="p-4 bg-base-200 rounded-t-lg">
				<div className="flex flex-wrap gap-4">
					<label className="floating-label">
						<span className="label-text">Start Date</span>
						<input
							type="date"
							className="input input-bordered"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							title="Start of day (00:00:00 UTC)"
						/>
					</label>

					<label className="floating-label">
						<span className="label-text">End Date</span>
						<input
							type="date"
							className="input input-bordered"
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
							title="End of day (23:59:59 UTC)"
						/>
					</label>

					{/* Status Filter Dropdown */}
					<label className="floating-label">
						<span className="label-text">Status</span>
						<select
							className="select select-bordered"
							value={statusFilter}
							onChange={handleStatusFilterChange}
						>
							<option value="ALL">All Statuses</option>
							<option value="PENDING">Pending</option>
							<option value="PROCESSING">Processing</option>
							<option value="COMPLETED">Completed</option>
							<option value="FAILED">Failed</option>
						</select>
					</label>

					<div className="flex items-end">
						<button
							type="button"
							className="btn btn-primary"
							onClick={() => refetch()}
							disabled={isLoading}
						>
							{isLoading ? (
								<FontAwesomeIcon icon={faSpinner} spin />
							) : (
								<FontAwesomeIcon icon={faSync} />
							)}
							<span className="ml-2">Refresh</span>
						</button>
					</div>

					{filteredData.length > 0 && (
						<div className="flex items-end ml-auto">
							<CSVLink
								data={filteredData}
								headers={csvHeaders}
								filename={getCSVFilename()}
								className="btn btn-success"
								target="_blank"
							>
								<FontAwesomeIcon icon={faDownload} />
								<span className="ml-2">Export CSV</span>
							</CSVLink>
						</div>
					)}
				</div>
			</div>

			<div className="p-4">
				{/* Error display */}
				{isError && (
					<div className="alert alert-error mb-6">
						<FontAwesomeIcon icon={faExclamationTriangle} />
						<span>
							Error:{" "}
							{error instanceof Error ? error.message : "Failed to load report"}
						</span>
					</div>
				)}

				{/* Stats cards */}
				{reportData && (
					<div className="stats shadow mb-6 w-full">
						<div className="stat">
							<div className="stat-title">Total Requests</div>
							<div className="stat-value">{reportData.count}</div>
						</div>

						<div className="stat">
							<div className="stat-title">Total Quantity</div>
							<div className="stat-value">{reportData.totalQuantity}</div>
						</div>

						{/* Status counts */}
						{reportData.statusCounts && (
							<>
								<div className="stat">
									<div className="stat-title">
										<span className="badge badge-warning">Pending</span>
									</div>
									<div className="stat-value">
										{reportData.statusCounts.PENDING || 0}
									</div>
								</div>
								<div className="stat">
									<div className="stat-title">
										<span className="badge badge-info">Processing</span>
									</div>
									<div className="stat-value">
										{reportData.statusCounts.PROCESSING || 0}
									</div>
								</div>
							</>
						)}
					</div>
				)}

				{/* Data table */}
				{isLoading ? (
					<div className="flex justify-center items-center h-64">
						<FontAwesomeIcon icon={faSpinner} spin size="2x" />
						<span className="ml-2">Loading report...</span>
					</div>
				) : filteredData.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="table w-full">
							<thead>
								<tr>
									<th>SKU</th>
									<th>Product</th>
									<th>Quantity</th>
									<th>Status</th>
									<th>Created At</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{/* biome-ignore lint/suspicious/noExplicitAny: Report data has complex dynamic structure */}
								{filteredData.map((item: any) => (
									<tr key={item.id}>
										<td>{item.sku}</td>
										<td>{item.title}</td>
										<td>{item.quantity}</td>
										<td>
											<span className={getStatusBadgeClass(item.status)}>
												{getStatusIcon(item.status)} {item.status}
											</span>
										</td>
										<td>{item.formattedDate}</td>
										<td>
											<button
												type="button"
												className="btn btn-sm btn-primary"
												onClick={() => {
													handleProcessRequest(
														item.id,
														item.quantity,
														item.boxSize,
													);
												}}
												disabled={
													processMutation.isPending ||
													item.status === "COMPLETED" ||
													item.status === "FAILED"
												}
											>
												{processMutation.isPending &&
												processMutation.variables?.id === item.id ? (
													<FontAwesomeIcon icon={faSpinner} spin />
												) : (
													<FontAwesomeIcon icon={faCheck} />
												)}
												<span className="ml-1">
													{item.status === "COMPLETED"
														? "Completed"
														: item.status === "FAILED"
															? "Failed"
															: "Process"}
												</span>
											</button>

											{/* Modal for entering quantity */}
											{isModalOpen && selectedItem && (
												<Modal onClose={() => setIsModalOpen(false)}>
													<div className="p-4">
														<h3 className="text-lg font-semibold mb-4">
															Enter Quantity
														</h3>
														<p className="mb-2">
															<strong>Box Size:</strong>{" "}
															{selectedItem.boxSize[0]} items
														</p>
														<p className="mb-4">
															<strong>Requested Quantity:</strong>{" "}
															{selectedItem.quantity} items
														</p>
														<input
															type="number"
															className="input input-bordered w-full"
															value={inputQuantity}
															onChange={(e) => setInputQuantity(e.target.value)}
															min="1"
														/>
														<div className="flex justify-end mt-4">
															<button
																type="button"
																className="btn btn-outline mr-2"
																onClick={() => setIsModalOpen(false)}
															>
																Cancel
															</button>
															<button
																type="button"
																className="btn btn-primary"
																onClick={handleConfirm}
															>
																Confirm
															</button>
														</div>
													</div>
												</Modal>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="bg-base-200 rounded-lg p-8 text-center">
						<p className="text-lg">
							No case break requests found for the selected period
							{statusFilter !== "ALL" ? ` with status ${statusFilter}` : ""}.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default CaseBreakReport;
