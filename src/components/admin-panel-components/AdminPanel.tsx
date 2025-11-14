import {
	faBoxes,
	faBoxesPacking,
	faFile,
	faHome,
	faUsers,
	faWarehouse,
	type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet } from "@tanstack/react-router";
import DashboardContent from "./DashboardContent";

interface MenuItem {
	icon: IconDefinition;
	label: string;
	toDest: string;
}

const menuItems: MenuItem[] = [
	{ icon: faHome, label: "Home", toDest: "/admin" },
	{ icon: faUsers, label: "Users", toDest: "/admin/users" },
	{ icon: faBoxes, label: "Products", toDest: "/admin/products" },
	{ icon: faBoxes, label: "Apparel Products", toDest: "/admin/apparel" },
	{ icon: faBoxesPacking, label: "Shows", toDest: "/admin/shows" },
	{ icon: faFile, label: "Reports", toDest: "/admin/reports" },
	{ icon: faWarehouse, label: "Inventory", toDest: "/admin/inventory" },
];

const AdminDashboard = () => {
	return (
		<div className="bg-base-100 min-h-screen flex flex-col">
			{/* Navbar */}
			<div className="w-full navbar bg-primary text-primary-content">
				<div className="flex-1 px-2 mx-2">Admin Dashboard</div>
				<div className="flex-none block">
					<ul className="menu menu-horizontal">
						{menuItems.map((item, index) => (
							<li key={index}>
								<Link
									to={item.toDest}
									className="tooltip"
									data-tip={item.label}
								>
									<FontAwesomeIcon icon={item.icon} />
									<span className="hidden xl:inline ml-2">{item.label}</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* Main content */}
			<main className="flex-1 p-2 overflow-y-auto bg-base-200">
				<div className="container mx-auto">
					<DashboardContent />
					<div className="mt-8">
						<Outlet />
					</div>
				</div>
			</main>
		</div>
	);
};

export { AdminDashboard };
