import { adminResetPassword } from "@api/users/auth.api";
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
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";
import type { User } from "@/types";
import AdminPageLayout from "./AdminPageLayout";

// Extend the User interface with Record<string, unknown>
interface UserTableItem extends User, Record<string, unknown> {}

const UsersPanel = () => {
	const auth = useAuth();
	const [searchTerm, setSearchTerm] = useState("");
	const [resetModalUser, setResetModalUser] = useState<UserTableItem | null>(
		null,
	);

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	// Password reset mutation
	const resetPasswordMutation = useMutation({
		mutationFn: (userId: string) =>
			adminResetPassword(auth.user?.token ?? "", {
				userId,
				expiresInHours: 24,
			}),
		onSuccess: (data) => {
			toast.success(
				`Password reset email sent. Expires: ${new Date(data.expiresAt).toLocaleString()}`,
			);
			setResetModalUser(null);
		},
		onError: (error: Error) => {
			toast.error(error.message || "Failed to send password reset email");
		},
	});

	// Query users data with pagination
	const {
		data: usersData,
		isLoading,
		isError,
		isFetching,
		isPlaceholderData,
	} = useQuery({
		...getUsersQueryOptions(auth.user?.token ?? "", {
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
	} = useQuery(getAllUsersQueryOptions(auth.user?.token ?? ""));

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
			onClick: (user: UserTableItem) => setResetModalUser(user),
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

					{/* Password Reset Confirmation Modal */}
					{resetModalUser && (
						<dialog className="modal modal-open">
							<div className="modal-box">
								<h3 className="font-bold text-lg">Reset User Password</h3>
								<p className="py-4">
									Are you sure you want to send a password reset email to{" "}
									<strong>{resetModalUser.email}</strong>?
								</p>
								<p className="text-sm text-base-content/70">
									The user will receive an email with a link valid for 24 hours.
								</p>
								<div className="modal-action">
									<button
										className="btn btn-ghost"
										onClick={() => setResetModalUser(null)}
										disabled={resetPasswordMutation.isPending}
									>
										Cancel
									</button>
									<button
										className="btn btn-warning"
										onClick={() =>
											resetPasswordMutation.mutate(resetModalUser.id)
										}
										disabled={resetPasswordMutation.isPending}
									>
										{resetPasswordMutation.isPending ? (
											<>
												<span className="loading loading-spinner loading-sm"></span>
												Sending...
											</>
										) : (
											<>
												<FontAwesomeIcon icon={faLock} className="mr-2" />
												Send Reset Email
											</>
										)}
									</button>
								</div>
							</div>
							<form method="dialog" className="modal-backdrop">
								<button onClick={() => setResetModalUser(null)}>close</button>
							</form>
						</dialog>
					)}
				</div>
			)}
		</AdminPageLayout>
	);
};

export default UsersPanel;
