import React from "react";
import AdminPageLayout from "./AdminPageLayout";
import {
  faChartLine,
  faBoxOpen,
  faClipboardList,
  faFlask,
  faFileInvoiceDollar,
} from "@fortawesome/free-solid-svg-icons";

interface ReportContentProps {
  selectedItem: string | null;
}

const ReportContent: React.FC<ReportContentProps> = ({ selectedItem }) => {
  if (!selectedItem) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Select a report type</h2>
        <p>Please select a report type from the sidebar to view its details.</p>
      </div>
    );
  }

  // Here you would typically fetch or compute the data for the selected report
  const reportData = getReportData(selectedItem);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        {selectedItem
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase())}
      </h2>
      {/* Render your report data here */}
      <pre>{JSON.stringify(reportData, null, 2)}</pre>
    </div>
  );
};

const ReportScreen: React.FC = () => {
  const reportTypes = [
    { icon: faChartLine, label: "Total Sales", id: "total-sales" },
    {
      icon: faBoxOpen,
      label: "Case Break Requests",
      id: "case-break-requests",
    },
    { icon: faClipboardList, label: "Daily Orders", id: "daily-orders" },
    { icon: faFlask, label: "R&D Requisitions", id: "rd-requisitions" },
    { icon: faFileInvoiceDollar, label: "Sale Reports", id: "sale-reports" },
  ];

  return (
    <AdminPageLayout title="Reports" sidebarItems={reportTypes}>
      {(selectedItem: string | null) => (
        <ReportContent selectedItem={selectedItem} />
      )}
    </AdminPageLayout>
  );
};

// This is a placeholder function. You would replace this with actual data fetching logic.
function getReportData(reportType: string) {
  // This is where you would typically fetch data from an API or database
  // For now, we'll just return some dummy data
  return {
    type: reportType,
    data: [
      { id: 1, value: Math.random() * 1000 },
      { id: 2, value: Math.random() * 1000 },
      { id: 3, value: Math.random() * 1000 },
    ],
  };
}

export default ReportScreen;
