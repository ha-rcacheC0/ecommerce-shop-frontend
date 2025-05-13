// src/components/ReportPanel.tsx - Updated version
import { useState } from "react";

import {
  faBoxes,
  faUsers,
  faChartLine,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import AdminPageLayout from "./AdminPageLayout";

import CaseBreakReport from "./CaseBreakPanel";
import InventoryReport from "./InventoryReport";
import UserActivityReport from "./UserActivityReport";
import SalesReport from "./SalesReport";

// Define available report types
enum ReportView {
  CASE_BREAK = "case-break",
  SALES = "sales",
  INVENTORY = "inventory",
  USER_ACTIVITY = "user-activity",
  FINANCIAL = "financial",
}

const ReportsPanel = () => {
  const [selectedView, setSelectedView] = useState<ReportView | null>(
    ReportView.CASE_BREAK
  );

  // Report sidebar items with icons
  const reportsSidebarItems = [
    { icon: faBoxes, label: "Case Break", id: ReportView.CASE_BREAK },
    { icon: faDollarSign, label: "Sales", id: ReportView.SALES },
    { icon: faBoxes, label: "Inventory", id: ReportView.INVENTORY },
    { icon: faUsers, label: "User Activity", id: ReportView.USER_ACTIVITY },
    { icon: faChartLine, label: "Financial", id: ReportView.FINANCIAL },
  ];

  // Handle sidebar item selection
  const handleSidebarItemSelect = (itemId: string | null) => {
    setSelectedView(itemId as ReportView | null);
  };

  // Render the selected report component
  const renderReportComponent = () => {
    switch (selectedView) {
      case ReportView.CASE_BREAK:
        return <CaseBreakReport />;
      case ReportView.SALES:
        return <SalesReport />;
      case ReportView.INVENTORY:
        return <InventoryReport />;
      case ReportView.USER_ACTIVITY:
        return <UserActivityReport />;
      case ReportView.FINANCIAL:
        return (
          <div className="p-6 text-center">Financial Report (Coming Soon)</div>
        );
      default:
        return (
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Select a Report Type</h2>
            <p>Choose a report type from the sidebar to get started.</p>
          </div>
        );
    }
  };

  return (
    <AdminPageLayout
      title="Reports"
      sidebarItems={reportsSidebarItems}
      onSidebarItemSelect={handleSidebarItemSelect}
    >
      {() => (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-base-content">
            {selectedView
              ? reportsSidebarItems.find((item) => item.id === selectedView)
                  ?.label || "Reports"
              : "Reports Dashboard"}
          </h2>

          {renderReportComponent()}
        </div>
      )}
    </AdminPageLayout>
  );
};

export default ReportsPanel;
