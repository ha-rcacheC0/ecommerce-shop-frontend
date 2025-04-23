import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import AdminPageLayout from "./AdminPageLayout";
import {
  faFileAlt,
  faDownload,
  faSpinner,
  faChartLine,
  faBoxes,
  faUsers,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "./component-parts/data-table";
import { useAuth } from "../providers/auth.provider";
import {
  getReportsQueryOptions,
  useDownloadReport,
} from "../api/reports/reportQueryOptions.api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReportType, ReportStatus } from "../types";

interface ReportTableItem extends Report, Record<string, unknown> {}

const ReportsPanel = () => {
  const auth = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const downloadReportMutation = useDownloadReport(auth.user!.token!);

  const {
    data: reportsData,
    isLoading,
    isError,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    ...getReportsQueryOptions(auth.user!.token!, {
      page: currentPage,
      pageSize: pageSize,
      search: searchTerm,
      type: selectedType || undefined,
    }),
    placeholderData: keepPreviousData,
  });

  // Create column helper
  const columnHelper = createColumnHelper<ReportTableItem>();

  // Define columns
  const columns = [
    columnHelper.accessor("name", {
      header: "Report Name",
      cell: (info) => info.getValue(),
      meta: { className: "text-left font-medium" },
    }),
    columnHelper.accessor("type", {
      header: "Type",
      cell: (info) => {
        const type = info.getValue();
        return (
          <div className="flex items-center justify-center gap-2">
            <TypeIcon type={type as ReportType} />
            <span>{type.replace(/_/g, " ")}</span>
          </div>
        );
      },
      meta: { className: "text-center" },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        return (
          <div
            className={`badge ${getStatusBadgeClass(status as ReportStatus)}`}
          >
            {status === ReportStatus.PROCESSING && (
              <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
            )}
            {status as string}
          </div>
        );
      },
      meta: { className: "text-center" },
    }),
    columnHelper.accessor("createdAt", {
      header: "Created",
      cell: (info) => new Date(info.getValue() as string).toLocaleString(),
      meta: { className: "text-center" },
    }),
    columnHelper.accessor("createdBy", {
      header: "Created By",
      cell: (info) => info.getValue(),
      meta: { className: "text-center" },
    }),
  ] as ColumnDef<ReportTableItem>[];

  // Define action buttons
  const actions = [
    {
      icon: faDownload,
      color: "primary",
      onClick: (report: ReportTableItem) => {
        downloadReportMutation.mutate(report.id as string);
      },
      isDisabled: (report: ReportTableItem) =>
        report.status !== ReportStatus.COMPLETED || !report.fileUrl,
    },
    {
      icon: faFileAlt,
      color: "info",
      to: "/admin/reports/$id/view",
      getParams: (report: ReportTableItem) => ({ id: report.id }),
      isDisabled: (report: ReportTableItem) =>
        report.status !== ReportStatus.COMPLETED,
    },
  ];

  // Report type sidebar items with icons
  const reportsSidebarItems = [
    { icon: faChartLine, label: "All Reports", id: "all-reports" },
    { icon: faDollarSign, label: "Sales", id: ReportType.SALES },
    { icon: faBoxes, label: "Inventory", id: ReportType.INVENTORY },
    { icon: faUsers, label: "User Activity", id: ReportType.USER_ACTIVITY },
    { icon: faDollarSign, label: "Financial", id: ReportType.FINANCIAL },
    {
      icon: faChartLine,
      label: "Product Performance",
      id: ReportType.PRODUCT_PERFORMANCE,
    },
  ];

  // Handle sidebar item selection
  const handleSidebarItemSelect = (itemId: string | null) => {
    setSelectedType(itemId === "all-reports" ? null : (itemId as ReportType));
    setCurrentPage(1);
  };

  // Handle search input changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Helper function to get badge class based on status
  const getStatusBadgeClass = (status: ReportStatus) => {
    switch (status) {
      case ReportStatus.COMPLETED:
        return "badge-success";
      case ReportStatus.PROCESSING:
        return "badge-info";
      case ReportStatus.PENDING:
        return "badge-warning";
      case ReportStatus.FAILED:
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  // Helper component for type icon
  const TypeIcon = ({ type }: { type: ReportType }) => {
    switch (type) {
      case ReportType.SALES:
        return <FontAwesomeIcon icon={faDollarSign} />;
      case ReportType.INVENTORY:
        return <FontAwesomeIcon icon={faBoxes} />;
      case ReportType.USER_ACTIVITY:
        return <FontAwesomeIcon icon={faUsers} />;
      case ReportType.FINANCIAL:
        return <FontAwesomeIcon icon={faDollarSign} />;
      case ReportType.PRODUCT_PERFORMANCE:
        return <FontAwesomeIcon icon={faChartLine} />;
      default:
        return <FontAwesomeIcon icon={faFileAlt} />;
    }
  };

  return (
    <AdminPageLayout
      title="Reports"
      sidebarItems={reportsSidebarItems}
      onSidebarItemSelect={handleSidebarItemSelect}
    >
      {(selectedItem) => (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-base-content">
            {selectedItem === "all-reports" || !selectedItem
              ? "All Reports"
              : `${selectedItem.replace(/_/g, " ")} Reports`}
          </h2>

          <DataTable<ReportTableItem>
            title="Reports"
            data={reportsData?.items as unknown as ReportTableItem[]}
            columns={columns}
            actions={actions}
            isLoading={isLoading}
            isError={isError}
            errorMessage="Error fetching reports data"
            searchConfig={{
              placeholder: "Search reports...",
              searchTerm: searchTerm,
              onSearch: handleSearch,
            }}
            createButton={{
              label: "Generate Report",
              to: "/admin/reports/new",
            }}
            emptyMessage="No reports found."
            initialSorting={[{ id: "createdAt", desc: true }]}
            pagination={{
              currentPage,
              pageSize,
              setPage: setCurrentPage,
              setPageSize,
              hasMore: reportsData?.pagination.hasMore || false,
              isFetching,
              isPlaceholderData: isPlaceholderData,
              totalRows: reportsData?.pagination.totalItems,
              manualPagination: true,
            }}
            manualSorting={true}
          />
        </div>
      )}
    </AdminPageLayout>
  );
};

export default ReportsPanel;
