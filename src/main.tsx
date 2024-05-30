import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";

import { ClerkProvider } from "@clerk/clerk-react";
import { routeTree } from "./routeTree.gen.ts";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ThemeProvider,
  useThemeProvider,
} from "./providers/theme.provider.tsx";
export const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: { theme: undefined!, queryClient },
});

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const theme = useThemeProvider();
  return <RouterProvider router={router} context={{ theme }} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ClerkProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
