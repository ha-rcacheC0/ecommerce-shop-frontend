import {
	getAllUsersQueryOptions,
	getUsersQueryOptions,
} from "@api/users/userQueryOptions.api";
import { DataTable } from "@components/component-parts/data-table";
import {
	faDownload,
	faEdit,
	faLock,
	faUserPlus,
	faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@providers/auth.provider";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { CSVLink } from "react-csv";
import type { User } from "@/types";
import AdminPageLayout from "./AdminPageLayout";

// Extend the User interface with Record<string, unknown>
interface UserTableItem extends User, Record<string, unknown> {}

const UsersPanel = () => {
	const auth = useAuth();
	const [searchTerm, setSearchTerm] = useState("");

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	// Query users data with pagination
	const {
		data: usersData,
		isLoading,
		isError,
		isFetching,
		isPlaceholderData,
	} = useQuery({
		...getUsersQueryOptions(auth.user?.token!, {
			page: currentPage,
			pageSize: pageSize,
			search: searchTerm,
		}),
		placeholderData: keepPreviousData,
	});
	const {
		data: allData,
		isLoading: allDataIsLoading,
		isError: allDataIsError,
	} = useQuery(getAllUsersQueryOptions(auth.user?.token!));

	// Create column helper
	const columnHelper = createColumnHelper<UserTableItem>();

	// Define columns
	const columns = [
		columnHelper.accessor(
			(row) =>
				`${row.profile.firstName || ""} ${row.profile.lastName || ""}`.trim(),
			{
				id: "fullName",
				header: "Name",
				cell: (info) => info.getValue() || "N/A",
				meta: { className: "text-center" },
			},
		),
		columnHelper.accessor("email", {
			header: "Email",
			cell: (info) => info.getValue(),
			meta: { className: "text-center" },
		}),
		columnHelper.accessor("role", {
			header: "Role",
			cell: (info) => info.getValue(),
			meta: { className: "text-center" },
		}),
		columnHelper.accessor("lastLogin", {
			header: "Last Login",
			cell: (info) => {
				const value = info.getValue();
				return value ? new Date(value as string).toLocaleDateString() : "Never";
			},
			meta: { className: "text-center" },
		}),
	] as ColumnDef<UserTableItem>[];

	const actions = [
		{
			icon: faEdit,
			color: "primary",
			to: "/admin/users/$id/edit",
			getParams: (user: UserTableItem) => ({ id: user.id }),
		},
		{
			icon: faLock,
			color: "warning",
			to: "/admin/users/$id/reset-password",
			getParams: (user: UserTableItem) => ({ id: user.id }),
		},
		{
			icon: faUserPlus,
			color: "success",
			to: "/admin/users/$id/permissions",
			getParams: (user: UserTableItem) => ({ id: user.id }),
		},
	];

	// Sidebar items
	const usersSidebarItems = [
		{ icon: faUsers, label: "All Users", id: "all-users" },
		// Add more items if needed, like "Admins", "Managers", etc.
	];

	// Handle search input changes
	const handleSearch = (value: string) => {
		setSearchTerm(value);
		setCurrentPage(1);
	};

	// Prepare CSV data
	const csvData =
		allData?.map((user) => ({
			name:
				`${user.profile.firstName || ""} ${user.profile.lastName || ""}`.trim() ||
				"N/A",
			email: user.email,
			role: user.role,
			lastLogin: user.lastLogin
				? new Date(user.lastLogin as string).toLocaleDateString()
				: "Never",
			id: user.id,
			createdAt: user.createdOn
				? new Date(user.createdOn as string).toLocaleDateString()
				: "N/A",
		})) || [];

	const csvHeaders = [
		{ label: "Name", key: "name" },
		{ label: "Email", key: "email" },
		{ label: "Role", key: "role" },
		{ label: "Last Login", key: "lastLogin" },
		{ label: "ID", key: "id" },
		{ label: "Created At", key: "createdAt" },
	];
	const generateFilename = () => {
		const date = new Date().toISOString().split("T")[0];
		return `users-export-${date}.csv`;
	};

	return (
		<AdminPageLayout title="User Management" sidebarItems={usersSidebarItems}>
			{() => (
				<div className="p-6">
					<div className="mb-4 flex justify-end-safe items-center">
						{allDataIsLoading ? (
							<span className="text-gray-500">Loading export data...</span>
						) : allDataIsError ? (
							<span className="text-red-500">Error loading export data</span>
						) : (
							<CSVLink
								data={csvData}
								headers={csvHeaders}
								filename={generateFilename()}
								className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
								target="_blank"
							>
								<FontAwesomeIcon icon={faDownload} className="mr-2" />
								Export CSV
							</CSVLink>
						)}
					</div>

					<DataTable<UserTableItem>
						title="Users"
						data={usersData?.items as UserTableItem[]}
						columns={columns}
						actions={actions}
						isLoading={isLoading}
						isError={isError}
						errorMessage="Error fetching users data"
						searchConfig={{
							placeholder: "Search users...",
							searchTerm: searchTerm,
							onSearch: handleSearch,
						}}
						createButton={{
							label: "Add User",
							to: "/admin/users/new",
						}}
						emptyMessage="No users found."
						initialSorting={[{ id: "fullName", desc: false }]}
						pagination={{
							currentPage,
							pageSize,
							setPage: setCurrentPage,
							setPageSize,
							hasMore: usersData?.pagination.hasMore || false,
							isFetching,
							isPlaceholderData,
							totalRows: usersData?.pagination.totalItems,
							manualPagination: true,
						}}
						manualSorting={true}
					/>
				</div>
			)}
		</AdminPageLayout>
	);
};

export default UsersPanel;
