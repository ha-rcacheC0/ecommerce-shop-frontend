import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminDashboard } from "../../../components/AdminPanel";

import LoadingScreen from "../../../components/LoadingScreen";

export const Route = createFileRoute("/_auth/admin")({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.user?.userInfo?.role !== "ADMIN") {
      throw redirect({
        to: "/",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  pendingComponent: () => <LoadingScreen />,
  component: AdminDashboard,
});
