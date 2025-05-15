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
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "../providers/auth.provider";

import {
  getPurchaseOrderReportQueryOptions,
  useUpdatePurchaseOrderMutation,
} from "../api/reports/reportQueryOptions.api";
import Modal from "./component-parts/Modal";
import { TAddress, TCartProduct } from "../types";

interface SalesReportItem {
  id: string;
  date: string;
  user: {
    id: string;
    profile: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
  };
  shippingAddress: TAddress;
  grandTotal: number;
  status: string;
  purchaseItems: Array<TCartProduct>;
}

const SalesReport: React.FC = () => {
  const { user } = useAuth();
  const token = user!.token!;
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [isAmountsModalOpen, setIsAmountsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
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
    setIsItemsModalOpen(true);
  };
  const openAmountsModal = (order: any) => {
    // Open a modal to show the items in the order
    setSelectedOrder(order);
    setIsAmountsModalOpen(true);
  };
  // CSV headers for react-csv
  const csvHeaders = [
    { label: "ID", key: "id" },
    { label: "Date Ordered", key: "formattedDate" },
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Total Price", key: "totalPrice" },
    { label: "Status", key: "status" },
    { label: "Items", key: "items" },
  ];
  const totalSales = salesReport
    ? salesReport.reduce(
        (acc: number, item: any) => acc + parseFloat(item.grandTotal),
        0
      )
    : 0;
  // Generate a filename for the CSV
  const getCSVFilename = () => {
    const dateStr = new Date().toLocaleDateString().replace(/\//g, "-");
    return `sales-report-${dateStr}.csv`;
  };
  const formatDataForCSV = (data: any[]) => {
    return data.map((item) => ({
      ...item,
      formattedDate: new Date(item.date).toLocaleDateString(),
      firstName: item.user.profile.firstName,
      lastName: item.user.profile.lastName,
      totalPrice: item.grandTotal,
      items: item.purchaseItems
        .map((i: any) => `${i.product.sku} | ${i.product.title}`)
        .join(", "),
    }));
  };

  function printAddress(shippingAddress: {
    id: string;
    street1: string;
    city: string;
    state: string;
    postalCode: string;
    street2?: string | undefined;
  }): React.ReactNode {
    const { street1, street2, city, state, postalCode } = shippingAddress;
    return (
      <span>
        {street1}
        {street2 ? `, ${street2}` : ""}, {city}, {state} {postalCode}
      </span>
    );
  }

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
                data={formatDataForCSV(salesReport)}
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
            <table className="table">
              <thead>
                <tr className="text-center">
                  <th>Date Ordered</th>
                  <th>Name</th>
                  <th>Shipping Address</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th className="w-[200px] min-w-[180px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {salesReport.map((item: SalesReportItem) => (
                  <tr key={item.id} className="text-center">
                    <td>{new Date(item.date).toISOString().split("T")[0]}</td>
                    <td>
                      {item.user.profile.firstName} {item.user.profile.lastName}
                    </td>
                    <td className="text-center">
                      {printAddress(item.shippingAddress)}
                    </td>
                    <td>${Number(item.grandTotal).toFixed(2)}</td>
                    <td>{item.status}</td>

                    {/* Actions cell with better layout */}
                    <td className="p-2">
                      <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => openItemsModal(item)}
                          >
                            View Items
                          </button>

                          {/* New button for amounts modal */}
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => openAmountsModal(item)}
                          >
                            <FontAwesomeIcon
                              icon={faChartLine}
                              className="mr-1"
                            />
                            Amounts
                          </button>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
                          <button
                            className="btn btn-icon btn-warning"
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
                            className="btn btn-icon btn-success"
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
      {isItemsModalOpen && (
        <Modal onClose={() => setIsItemsModalOpen(false)}>
          <div className="p-4 w-full ">
            <h3 className="text-lg font-semibold mb-4">Ordered Items</h3>
            <table className="table w-full table-zebra border *:border-base-300 overflow-auto">
              <thead>
                <tr className="">
                  <th>SKU</th>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item) => (
                  <tr key={item.product.id}>
                    <td className="font-bold">{item.product.sku}</td>
                    <td>{item.product.title}</td>
                    <td>{item.quantity}</td>
                    <td>{item.isUnit ? "units" : "case"}</td>
                    <td>{Number(item.itemSubTotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <button
                className="btn btn-outline"
                onClick={() => setIsItemsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isAmountsModalOpen && (
        <Modal onClose={() => setIsAmountsModalOpen(false)}>
          <div className="p-4 w-full ">
            <h3 className="text-lg font-semibold mb-4">Order Amounts</h3>
            <table className="table w-full table-zebra border *:border-base-300 overflow-auto">
              <thead>
                <tr className="">
                  <th>SubTotal</th>
                  <th>Shipping</th>
                  <th>Tax</th>
                  <th>Lift Gate Fee</th>
                  <th>Grand Total</th>
                </tr>
              </thead>
              <tbody>
                <tr key={selectedOrder.id}>
                  <td className="font-bold">
                    {Number(selectedOrder.subTotal).toFixed(2)}
                  </td>
                  <td>{Number(selectedOrder.shippingCost).toFixed(2)}</td>
                  <td>{Number(selectedOrder.tax).toFixed(2)}</td>
                  <td>{Number(selectedOrder.liftGateFee).toFixed(2)}</td>
                  <td>{Number(selectedOrder.grandTotal).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-end mt-4">
              <button
                className="btn btn-outline"
                onClick={() => setIsAmountsModalOpen(false)}
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
