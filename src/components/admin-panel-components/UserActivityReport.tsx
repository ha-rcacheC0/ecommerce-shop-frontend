// src/components/reports/UserActivityReport.tsx

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserActivityReport = () => {
	return (
		<div className="bg-base-100 rounded-lg shadow-lg p-6">
			<h2 className="text-xl font-semibold mb-4">User Activity Report</h2>
			<div className="p-8 text-center">
				<FontAwesomeIcon icon={faSpinner} spin className="text-4xl mb-4" />
				<p>User Activity Report component is under development</p>
			</div>
		</div>
	);
};

export default UserActivityReport;
