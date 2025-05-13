// src/components/reports/InventoryReport.tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const InventoryReport = () => {
  return (
    <div className="bg-base-100 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Inventory Report</h2>
      <div className="p-8 text-center">
        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl mb-4" />
        <p>Inventory Report component is under development</p>
      </div>
    </div>
  );
};

export default InventoryReport;
