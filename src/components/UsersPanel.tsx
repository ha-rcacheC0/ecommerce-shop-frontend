import React from "react";
import { useQuery } from "@tanstack/react-query";
import AdminPageLayout from "./AdminPageLayout";
import {
  faUsers,
  faUserTie,
  faUserCog,
  faCalendarAlt,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { getAllUsersQueryOptions } from "../api/users/userQueryOptions.api";
import { useAuth } from "../providers/auth.provider";

// You'll need to create this query function

interface UserData {
  id: string;
  role: "USER" | "MANAGER" | "ADMIN" | "MEMBER";
  email: string;
  createdOn: string;
  lastLogin: string | null;
  profiles?: {
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
    canContact: boolean;
  };
}

const UsersTable: React.FC<{ selectedView: string | null }> = ({
  selectedView,
}) => {
  const auth = useAuth();

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery(getAllUsersQueryOptions(auth.user!.token!));

  if (isLoading) return <div className="text-center">Loading...</div>;
  if (isError)
    return (
      <div className="text-center text-red-500">Error fetching user data</div>
    );

  // Filter users based on selectedView
  const filteredUsers = selectedView
    ? users?.filter((user: UserData) => {
        switch (selectedView) {
          case "admins-managers":
            return user.role === "ADMIN" || user.role === "MANAGER";
          case "members":
            return user.role === "MEMBER";
          case "users":
            return user.role === "USER";
          case "recent-signups":
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return new Date(user.createdOn) > sevenDaysAgo;
          case "email-list":
            return user.profiles?.canContact;
          default:
            return true;
        }
      })
    : users;

  return (
    <div className="overflow-x-auto mx-auto my-4 w-full">
      <table className="min-w-full border border-gray-900 table">
        <thead className="text-lg text-gray-900 border-gray-900 border-b-2">
          <tr>
            <th className="py-2 text-center">Email</th>
            <th className="py-2 text-center">Name</th>
            <th className="py-2 text-center">Role</th>
            <th className="py-2 text-center">Created On</th>
            <th className="py-2 text-center">Last Login</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers?.map((user: any) => (
            <tr
              key={user.id}
              className="border-t border-gray-600 text-black hover:bg-gray-400 hover:text-white text-center"
            >
              <td className="py-2">{user.email}</td>
              <td className="py-2">
                {user.profiles
                  ? `${user.profiles.firstName} ${user.profiles.lastName}`
                  : "N/A"}
              </td>
              <td className="py-2">{user.role}</td>
              <td className="py-2">
                {new Date(user.createdOn).toLocaleDateString()}
              </td>
              <td className="py-2">
                {user.lastLogin
                  ? new Date(user.lastLogin).toLocaleDateString()
                  : "Never"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UsersScreen: React.FC = () => {
  const usersSidebarItems = [
    { icon: faUsers, label: "All Users", id: "all-users" },
    { icon: faUserTie, label: "Admins/Managers", id: "admins-managers" },
    { icon: faUserCog, label: "Members", id: "members" },
    { icon: faUsers, label: "Regular Users", id: "users" },
    { icon: faCalendarAlt, label: "Recent Signups", id: "recent-signups" },
    { icon: faEnvelope, label: "Email List", id: "email-list" },
  ];

  return (
    <AdminPageLayout title="User Management" sidebarItems={usersSidebarItems}>
      {(selectedItem) => (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            {selectedItem
              ? selectedItem
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())
              : "All Users"}
          </h2>
          <UsersTable selectedView={selectedItem} />
        </div>
      )}
    </AdminPageLayout>
  );
};

export default UsersScreen;
