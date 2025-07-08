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
  faEye,
  faUser,
  faMapMarkerAlt,
  faCalculator,
  faBox,
  faTheaterMasks,
  faBoxes,
} from "@fortawesome/free-solid-svg-icons";

import { useAuth } from "@providers/auth.provider";
import {
  getPurchaseOrderReportQueryOptions,
  useUpdatePurchaseOrderMutation,
} from "@api/reports/reportQueryOptions.api";
import Modal from "@components/component-parts/Modal";
import { TAddress, TPurchaseItem } from "@/types";

interface SalesReportItem {
  id: string;
  date: string;
  user: {
    id: string;
    email: string;
    profile: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
    };
  };
  shippingAddress: TAddress;
  grandTotal: number;
  subTotal: number;
  shippingCost: number;
  tax: number;
  liftGateFee: number;
  status: string;
  purchaseItems: Array<TPurchaseItem>;
}

const SalesReport: React.FC = () => {
  const { user } = useAuth();
  const token = user!.token!;
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] =
    useState<SalesReportItem | null>(null);

  // Handle date changes
  useEffect(() => {
    if (!startDate && !endDate) {
      const today = new Date();
      today.setHours(23, 59, 59, 999);
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
    () => {
      refetch();
    },
    () => {}
  );

  const handleRowClick = (order: SalesReportItem) => {
    setSelectedOrderDetail(order);
  };

  const handleCloseDetail = () => {
    setSelectedOrderDetail(null);
  };

  const handleStatusUpdate = (
    e: React.MouseEvent,
    orderId: string,
    status: string
  ) => {
    e.stopPropagation();
    statusUpdate.mutate({ id: orderId, status });
  };

  const handleStatusUpdateInModal = (orderId: string, status: string) => {
    statusUpdate.mutate({ id: orderId, status });
    // Update the selected order detail if it's the same order
    if (selectedOrderDetail && selectedOrderDetail.id === orderId) {
      setSelectedOrderDetail({ ...selectedOrderDetail, status });
    }
  };

  const formatAddress = (address: TAddress): string => {
    const { street1, street2, city, state, postalCode } = address;
    return `${street1}${street2 ? `, ${street2}` : ""}, ${city}, ${state} ${postalCode}`;
  };

  // CSV headers for react-csv
  const csvHeaders = [
    { label: "ID", key: "id" },
    { label: "Date Ordered", key: "formattedDate" },
    { label: "First Name", key: "firstName" },
    { label: "Last Name", key: "lastName" },
    { label: "Phone Number", key: "phoneNumber" },
    { label: "Email", key: "email" },
    { label: "Total Price", key: "totalPrice" },
    { label: "Status", key: "status" },
  ];

  const totalSales = salesReport
    ? salesReport.reduce(
        (acc: number, item: any) => acc + parseFloat(item.grandTotal),
        0
      )
    : 0;

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
      phoneNumber: item.user.profile.phoneNumber,
      email: item.user.email,
      totalPrice: item.grandTotal,
    }));
  };

  function showProductTypeBadge(purchaseItem: TPurchaseItem): React.ReactNode {
    if (purchaseItem.product.isShow)
      return (
        <div className="badge badge-primary mr-2">
          <span className="mr-1">
            <FontAwesomeIcon icon={faTheaterMasks} />
          </span>
          Show
        </div>
      );
    if (purchaseItem.isUnit)
      return (
        <div className="badge badge-primary mr-2">
          <span className="mr-1">
            <FontAwesomeIcon icon={faBox} />
          </span>
          Unit
        </div>
      );

    return (
      <div className="badge badge-secondary mr-2">
        <span className="mr-1">
          <FontAwesomeIcon icon={faBoxes} />
        </span>
        Case
      </div>
    );
  }

  return (
    <>
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
                {error instanceof Error
                  ? error.message
                  : "Failed to load report"}
              </span>
            </div>
          )}

          {/* Stats cards */}
          {salesReport && (
            <div className="stats shadow mb-6 w-full">
              <div className="stat">
                <div className="stat-title">Total Sales</div>
                <div className="stat-value">
                  ${Number(totalSales).toFixed(2)}
                </div>
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
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date Ordered</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {salesReport.map((item: SalesReportItem) => (
                    <tr
                      key={item.id}
                      className={`cursor-pointer hover:bg-base-200 transition-colors ${
                        selectedRowId === item.id ? "bg-base-300" : ""
                      }`}
                      onClick={() => handleRowClick(item)}
                      onMouseEnter={() => setSelectedRowId(item.id)}
                      onMouseLeave={() => setSelectedRowId(null)}
                    >
                      <td>{new Date(item.date).toISOString().split("T")[0]}</td>
                      <td>
                        {item.user.profile.firstName}{" "}
                        {item.user.profile.lastName}
                      </td>
                      <td>{item.user.email}</td>
                      <td>{item.user.profile.phoneNumber}</td>
                      <td className="font-semibold">
                        ${Number(item.grandTotal).toFixed(2)}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.status === "COMPLETED"
                              ? "badge-success"
                              : item.status === "PROCESSING"
                                ? "badge-warning"
                                : item.status === "FAILED"
                                  ? "badge-error"
                                  : "badge-neutral"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-1">
                          <button
                            className="btn btn-xs btn-ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(item);
                            }}
                            title="View Details"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </button>

                          <button
                            className="btn btn-xs btn-warning"
                            onClick={(e) =>
                              handleStatusUpdate(e, item.id, "PROCESSING")
                            }
                            title="Set to Processing"
                          >
                            <FontAwesomeIcon icon={faShippingFast} />
                          </button>

                          <button
                            className="btn btn-xs btn-success"
                            onClick={(e) =>
                              handleStatusUpdate(e, item.id, "COMPLETED")
                            }
                            title="Set to Completed"
                          >
                            <FontAwesomeIcon icon={faCheck} />
                          </button>

                          <button
                            className="btn btn-xs btn-error"
                            onClick={(e) =>
                              handleStatusUpdate(e, item.id, "FAILED")
                            }
                            title="Set to Failed"
                          >
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {salesReport.length > 0 && (
                <div className="mt-4 text-sm text-base-content/60 text-center">
                  Click on any row to view detailed information
                </div>
              )}
            </div>
          ) : (
            <div className="bg-base-200 rounded-lg p-8 text-center">
              <p className="text-lg">
                No sales data found for the selected period.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrderDetail && (
        <Modal onClose={handleCloseDetail}>
          <div className="max-w-6xl w-full max-h-[90vh] overflow-y-auto ">
            <div className="space-y-6 p-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <p className="text-base-content/60">
                    Order #{selectedOrderDetail.id} •{" "}
                    {new Date(selectedOrderDetail.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <span
                    className={`badge badge-lg ${
                      selectedOrderDetail.status === "COMPLETED"
                        ? "badge-success"
                        : selectedOrderDetail.status === "PROCESSING"
                          ? "badge-warning"
                          : selectedOrderDetail.status === "FAILED"
                            ? "badge-error"
                            : "badge-neutral"
                    }`}
                  >
                    {selectedOrderDetail.status}
                  </span>
                </div>

                {/* Status Actions */}
                <div className="flex gap-2">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() =>
                      handleStatusUpdateInModal(
                        selectedOrderDetail.id,
                        "PROCESSING"
                      )
                    }
                    disabled={statusUpdate.isPending}
                  >
                    <FontAwesomeIcon icon={faShippingFast} />
                    Processing
                  </button>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() =>
                      handleStatusUpdateInModal(
                        selectedOrderDetail.id,
                        "COMPLETED"
                      )
                    }
                    disabled={statusUpdate.isPending}
                  >
                    <FontAwesomeIcon icon={faCheck} />
                    Completed
                  </button>
                  <button
                    className="btn btn-error btn-sm"
                    onClick={() =>
                      handleStatusUpdateInModal(
                        selectedOrderDetail.id,
                        "FAILED"
                      )
                    }
                    disabled={statusUpdate.isPending}
                  >
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    Failed
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div className="card bg-base-100 shadow">
                  <div className="card-body">
                    <h3 className="card-title">
                      <FontAwesomeIcon icon={faUser} />
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-base-content/60">
                          Name
                        </label>
                        <p className="font-medium">
                          {selectedOrderDetail.user.profile.firstName}{" "}
                          {selectedOrderDetail.user.profile.lastName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/60">
                          Email
                        </label>
                        <p>{selectedOrderDetail.user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/60">
                          Phone
                        </label>
                        <p>{selectedOrderDetail.user.profile.phoneNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="card bg-base-100 shadow">
                  <div className="card-body">
                    <h3 className="card-title">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      Shipping Address
                    </h3>
                    <p className="whitespace-pre-line">
                      {formatAddress(selectedOrderDetail.shippingAddress)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h3 className="card-title">
                    <FontAwesomeIcon icon={faBox} />
                    Order Items
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>SKU</th>
                          <th>Product</th>
                          <th>Type</th>
                          <th>Quantity</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrderDetail.purchaseItems.map((item) => (
                          <tr key={item.product.id}>
                            <td className="font-mono font-bold">
                              {item.product.sku}
                            </td>
                            <td>{item.product.title}</td>
                            <td>{showProductTypeBadge(item)}</td>
                            <td>{item.quantity}</td>
                            <td className="font-medium">
                              ${Number(item.itemSubTotal).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="card bg-base-100 shadow">
                <div className="card-body">
                  <h3 className="card-title">
                    <FontAwesomeIcon icon={faCalculator} />
                    Order Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>
                        ${Number(selectedOrderDetail.subTotal).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>
                        ${Number(selectedOrderDetail.shippingCost).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${Number(selectedOrderDetail.tax).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lift Gate Fee:</span>
                      <span>
                        ${Number(selectedOrderDetail.liftGateFee).toFixed(2)}
                      </span>
                    </div>
                    <div className="divider my-2"></div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Grand Total:</span>
                      <span>
                        ${Number(selectedOrderDetail.grandTotal).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default SalesReport;
