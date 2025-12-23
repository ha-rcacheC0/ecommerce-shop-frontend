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
	// biome-ignore lint/style/noNonNullAssertion: TanStack Router pattern - context is provided at render time
	context: { auth: undefined!, theme: undefined!, queryClient },
	history:
		typeof window !== "undefined"
			? createBrowserHistory()
			: createMemoryHistory(),
});
Sentry.init({
	dsn: "https://f8e5f04e220f6992793753fa9ec6312f@o4509347102654464.ingest.us.sentry.io/4509347102916608",
	environment: import.meta.env.MODE,
	integrations: [
		Sentry.browserTracingIntegration(),
		Sentry.replayIntegration({
			maskAllText: false,
			blockAllMedia: false,
		}),
		Sentry.tanstackRouterBrowserTracingIntegration(router),
	],
	tracesSampleRate: 1.0,
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,
	// Adds request headers and IP for users, for more info visit:
	// https://docs.sentry.io/platforms/javascript/guides/react/configuration/options/#sendDefaultPii
	sendDefaultPii: true,
	// Tag errors by domain for easier filtering
	beforeSend(event) {
		// Add domain tag based on URL path
		const path = window.location.pathname;
		if (path.includes("/cart")) {
			event.tags = { ...event.tags, domain: "cart" };
		} else if (path.includes("/profile")) {
			event.tags = { ...event.tags, domain: "profile" };
		} else if (path.includes("/products")) {
			event.tags = { ...event.tags, domain: "products" };
		} else if (path.includes("/admin")) {
			event.tags = { ...event.tags, domain: "admin" };
		}
		return event;
	},
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

// biome-ignore lint/style/noNonNullAssertion: Standard React pattern - root element exists in index.html
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
