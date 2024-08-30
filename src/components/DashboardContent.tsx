import { DashboardCard } from "./component-parts/dashboard-card";

const DashboardContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <DashboardCard title="Members" value="1,234" description="Total active" />
      <DashboardCard
        title="Case Break Requests"
        value="56"
        description="unfufilled"
      />
      <DashboardCard
        title="Current Sale Products "
        value="27"
        description="remaining"
      />
      <DashboardCard
        title="Inventory"
        value="789"
        description="Items in stock"
      />
    </div>
  );
};

export default DashboardContent;
