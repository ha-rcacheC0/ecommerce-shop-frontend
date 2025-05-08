/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/reports/CaseBreakReport.tsx
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faSync,
  faCheck,
  faSpinner,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

import { toast } from "react-toastify";
import { useAuth } from "../providers/auth.provider";
import {
  getAllCaseBreaksQueryOptions,
  useProcessCaseBreakMutation,
} from "../api/reports/reportQueryOptions.api";
import Modal from "./component-parts/Modal";

const CaseBreakReport: React.FC = () => {
  const { user } = useAuth();
  const token = user!.token!;
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

  // Handle date changes
  useEffect(() => {
    // Default to today if no dates are set
    if (!startDate && !endDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      setEndDate(today.toISOString().split("T")[0]);
    }
  }, [startDate, endDate]);

  // Fetch case break report data
  const {
    data: reportData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(getAllCaseBreaksQueryOptions(token, startDate, endDate));

  // Mutation for processing case break requests
  const processMutation = useProcessCaseBreakMutation(
    token,
    () => {},
    (_e) => {}
  );

  const handleProcessRequest = (
    id: string,
    defaultQuantity: number,
    boxSize: number[]
  ) => {
    setSelectedItem({ id, quantity: defaultQuantity, boxSize });
    setInputQuantity(defaultQuantity.toString());

    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    const quantityNum = parseInt(inputQuantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error("Please enter a valid positive number");
      return;
    }

    if (selectedItem) {
      processMutation.mutate({ id: selectedItem.id, quantity: quantityNum });
    }
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  // CSV headers for react-csv
  const csvHeaders = [
    { label: "ID", key: "id" },
    { label: "Product ID", key: "productId" },
    { label: "SKU", key: "sku" },
    { label: "Product", key: "title" },
    { label: "Quantity", key: "quantity" },
    { label: "Date", key: "formattedDate" },
  ];

  // Generate a filename for the CSV
  const getCSVFilename = () => {
    const dateStr = new Date().toLocaleDateString().replace(/\//g, "-");
    return `case-break-report-${dateStr}.csv`;
  };

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
            />
          </label>

          <label className="floating-label">
            <span className="label-text">End Date</span>
            <input
              type="date"
              className="input input-bordered"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>

          <div className="flex items-end">
            <button
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

          {reportData && reportData.data && reportData.data.length > 0 && (
            <div className="flex items-end ml-auto">
              <CSVLink
                data={reportData.data}
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
          </div>
        )}

        {/* Data table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            <span className="ml-2">Loading report...</span>
          </div>
        ) : reportData && reportData.data && reportData.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportData.data.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.sku}</td>
                    <td>{item.title}</td>
                    <td>{item.quantity}</td>
                    <td>{item.formattedDate}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                          console.log(item);
                          handleProcessRequest(
                            item.id,
                            item.quantity,
                            item.boxSize
                          );
                        }}
                        disabled={processMutation.isPending}
                      >
                        {processMutation.isPending &&
                        processMutation.variables?.id === item.id ? (
                          <FontAwesomeIcon icon={faSpinner} spin />
                        ) : (
                          <FontAwesomeIcon icon={faCheck} />
                        )}
                        <span className="ml-1">Process</span>
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
                                className="btn btn-outline mr-2"
                                onClick={() => setIsModalOpen(false)}
                              >
                                Cancel
                              </button>
                              <button
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
              No case break requests found for the selected period.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseBreakReport;
