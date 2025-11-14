interface DashboardCardProps {
	title: string;
	value: string;
	description: string;
}

export const DashboardCard = ({
	title,
	value,
	description,
}: DashboardCardProps) => (
	<div className="bg-white rounded-lg shadow-md p-6">
		<h3 className="text-2xl font-semibold text-primary mb-2">{title}</h3>
		<p className="text-3xl font-bold text-primary mb-2">{value}</p>
		<p className="text-sm text-primary">{description}</p>
	</div>
);
