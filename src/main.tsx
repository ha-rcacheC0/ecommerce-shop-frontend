import * as Sentry from "@sentry/react";
import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createBrowserHistory,
	createMemoryHistory,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "./providers/auth.provider.tsx";
import {
	ThemeProvider,
	useThemeProvider,
} from "./providers/theme.provider.tsx";
import { routeTree } from "./routeTree.gen.ts";
import "react-toastify/dist/ReactToastify.css";

export const queryClient = new QueryClient();

const router = createRouter({
	routeTree,
	defaultPreload: "intent",
	context: { auth: undefined!, theme: undefined!, queryClient },
	history:
		typeof window !== "undefined"
			? createBrowserHistory()
			: createMemoryHistory(),
});
Sentry.init({
	dsn: "https://f8e5f04e220f6992793753fa9ec6312f@o4509347102654464.ingest.us.sentry.io/4509347102916608",

	// Adds request headers and IP for users, for more info visit:
	// https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#sendDefaultPii
	sendDefaultPii: true,

	integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

function App() {
	const auth = useAuth();
	const theme = useThemeProvider();
	return <RouterProvider router={router} context={{ theme, auth }} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Sentry.ErrorBoundary fallback={<p>Something went wrong</p>}>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<ThemeProvider>
						<ToastContainer />
						<App />
					</ThemeProvider>
				</AuthProvider>
			</QueryClientProvider>
		</Sentry.ErrorBoundary>
	</React.StrictMode>,
);
