import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeContextType } from "../providers/theme.provider";
import { QueryClient } from "@tanstack/react-query";
import { AuthContextType } from "../providers/auth.provider";

interface RouterContext {
  auth: AuthContextType;
  theme: ThemeContextType;
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});

function Root() {
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      {isDevelopment && (
        <>
          <TanStackRouterDevtools position="bottom-right" />
          <ReactQueryDevtools
            initialIsOpen={false}
            buttonPosition="bottom-left"
          />
        </>
      )}
    </>
  );
}
