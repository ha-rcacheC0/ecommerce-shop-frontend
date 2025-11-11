import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTools,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

interface MaintenanceBannerProps {
  variant?: "banner" | "button" | "inline";
  className?: string;
}

const MaintenanceBanner = ({
  variant = "banner",
  className = "",
}: MaintenanceBannerProps) => {
  if (variant === "banner") {
    return (
      <div className={`alert alert-warning shadow-lg mb-4 ${className}`}>
        <FontAwesomeIcon icon={faTools} className="h-6 w-6 shrink-0" />
        <div>
          <h3 className="font-bold">Purchases Currently Unavailable</h3>
          <div className="text-sm">
            We're performing maintenance on our payment system. Orders will be
            back online shortly. Browse our catalog in the meantime!
          </div>
        </div>
      </div>
    );
  }

  if (variant === "button") {
    return (
      <div
        className={`mt-3 p-3 bg-warning/20 border border-warning rounded-lg ${className}`}
      >
        <div className="flex items-center gap-2 text-warning">
          <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4" />
          <span className="text-sm font-medium">
            Purchases temporarily unavailable due to maintenance
          </span>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div
        className={`inline-flex items-center gap-2 text-warning text-sm ${className}`}
      >
        <FontAwesomeIcon icon={faTools} className="h-4 w-4" />
        <span>Payment system under maintenance</span>
      </div>
    );
  }

  return null;
};

export default MaintenanceBanner;
