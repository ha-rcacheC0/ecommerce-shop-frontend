import { Footer } from "@components/footer";
import { Navbar } from "@components/navbar";
import type { AuthContextType } from "@providers/auth.provider";
import type { ThemeContextType } from "@providers/theme.provider";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { logger } from "@/utils/logger";

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
					<button
						type="button"
						className="btn btn-primary fixed bottom-4 right-4 z-50"
						onClick={() => {
							logger.warn({}, "Breaking the world - Sentry test error");
							throw new Error("Sentry Test Error");
						}}
					>
						Break the world
					</button>
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
