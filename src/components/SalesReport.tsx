/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faSync,
  faSpinner,
  faExclamationTriangle,
  faShippingFast,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../providers/auth.provider";

import {
  getPurchaseOrderReportQueryOptions,
  useUpdatePurchaseOrderMutation,
} from "../api/reports/reportQueryOptions.api";
import Modal from "./component-parts/Modal";

const SalesReport: React.FC = () => {
  const { user } = useAuth();
  const token = user!.token!;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Handle date changes
  useEffect(() => {
    if (!startDate && !endDate) {
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Set to the very end of the day
      setEndDate(today.toISOString().split("T")[0]);
    }
  }, [startDate, endDate]);

  // Adjust startDate and endDate to include time for backend
  const adjustedStartDate = startDate ? `${startDate}T00:00:00.000Z` : null;
  const adjustedEndDate = endDate ? `${endDate}T23:59:59.999Z` : null;

  // Fetch sales report data
  const {
    data: salesReport,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(
    getPurchaseOrderReportQueryOptions(
      token,
      adjustedStartDate || "",
      adjustedEndDate || ""
    )
  );
  const statusUpdate = useUpdatePurchaseOrderMutation(
    token,
    () => {},
    () => {}
  );

  const openItemsModal = (item: any) => {
    // Open a modal to show the items in the order
    setSelectedItems(item.purchaseItems);
    setIsModalOpen(true);
  };
  // CSV headers for react-csv
  const csvHeaders = [
    { label: "ID", key: "id" },
    { label: "Product", key: "productTitle" },
    { label: "User", key: "userName" },
    { label: "Quantity", key: "quantity" },
    { label: "Total Price", key: "totalPrice" },
    { label: "Date", key: "formattedDate" },
  ];
  const totalSales = salesReport
    ? salesReport.reduce(
        (acc: number, item: any) => acc + parseFloat(item.amount),
        0
      )
    : 0;
  // Generate a filename for the CSV
  const getCSVFilename = () => {
    const dateStr = new Date().toLocaleDateString().replace(/\//g, "-");
    return `sales-report-${dateStr}.csv`;
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

          {Array.isArray(salesReport) && (
            <div className="flex items-end ml-auto">
              <CSVLink
                data={salesReport}
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
        {salesReport && (
          <div className="stats shadow mb-6 w-full">
            <div className="stat">
              <div className="stat-title">Total Sales</div>
              <div className="stat-value">${totalSales}</div>
            </div>

            <div className="stat">
              <div className="stat-title">Total Orders</div>
              <div className="stat-value">{salesReport.length}</div>
            </div>
          </div>
        )}

        {/* Data table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            <span className="ml-2">Loading report...</span>
          </div>
        ) : salesReport ? (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date Ordered</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {salesReport.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{new Date(item.date).toISOString().split("T")[0]}</td>
                    <td>{item.user.profile.firstName}</td>
                    <td>{item.user.profile.lastName}</td>
                    <td>${item.amount}</td>
                    <td>{item.status}</td>
                    <td className="flex flex-col gap-2 justify-center-safe">
                      <button
                        className="btn btn-sm btn-info "
                        onClick={() => openItemsModal(item)}
                      >
                        View Items
                      </button>
                      <div className="grid grid-cols-3 max-md:grid-cols-1 gap-2">
                        <button
                          className="btn btn-icon btn-warning "
                          onClick={() =>
                            statusUpdate.mutate({
                              id: item.id,
                              status: "PROCESSING",
                            })
                          }
                        >
                          <FontAwesomeIcon icon={faShippingFast} />
                        </button>
                        <button
                          className="btn btn-icon btn-success "
                          onClick={() =>
                            statusUpdate.mutate({
                              id: item.id,
                              status: "COMPLETED",
                            })
                          }
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <button
                          className="btn btn-icon btn-error"
                          onClick={() =>
                            statusUpdate.mutate({
                              id: item.id,
                              status: "FAILED",
                            })
                          }
                        >
                          <FontAwesomeIcon icon={faExclamationTriangle} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-base-200 rounded-lg p-8 text-center">
            <p className="text-lg">
              No sales data found for the selected period.
            </p>
          </div>
        )}
      </div>
      {/* Modal for viewing ordered items */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Ordered Items</h3>
            <table className="table w-full table-zebra border *:border-base-300 ">
              <thead>
                <tr className="">
                  <th>SKU</th>
                  <th>Title</th>
                  <th>Quantity</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item) => (
                  <tr key={item.product.id}>
                    <td className="font-bold">{item.product.sku}</td>
                    <td>{item.product.title}</td>
                    <td>{item.quantity}</td>
                    <td>{item.isUnit ? "units" : "case"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <button
                className="btn btn-outline"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SalesReport;
