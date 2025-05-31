import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUsersQueryOptions } from "@api/users/userQueryOptions.api";
import AdminPageLayout from "./AdminPageLayout";
import {
  faEdit,
  faLock,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { User } from "@/types";
import { DataTable } from "@components/component-parts/data-table";
import { useAuth } from "@providers/auth.provider";

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
    ...getUsersQueryOptions(auth.user!.token!, {
      page: currentPage,
      pageSize: pageSize,
      search: searchTerm,
    }),
    placeholderData: keepPreviousData,
  });

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
      }
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

  return (
    <AdminPageLayout title="User Management" sidebarItems={usersSidebarItems}>
      {() => (
        <div className="p-6">
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
