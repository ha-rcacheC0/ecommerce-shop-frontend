import pino from "pino";

const isDevelopment = import.meta.env.MODE === "development";

export const logger = pino({
	level: isDevelopment ? "debug" : "info",
	browser: {
		asObject: true,
	},
	transport: isDevelopment
		? {
				target: "pino-pretty",
				options: {
					colorize: true,
				},
			}
		: undefined,
});

// Domain-specific loggers with context
export const cartLogger = logger.child({ domain: "cart" });
export const profileLogger = logger.child({ domain: "profile" });
export const productsLogger = logger.child({ domain: "products" });
export const adminLogger = logger.child({ domain: "admin" });

// Utility to log when undefined/null guards trigger
export function logNullGuard(
	logger: pino.Logger,
	field: string,
	context: Record<string, unknown>,
) {
	logger.warn(
		{
			guardTriggered: field,
			...context,
		},
		`Null/undefined guard triggered for ${field}`,
	);
}
