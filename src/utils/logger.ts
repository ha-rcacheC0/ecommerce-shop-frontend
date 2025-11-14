// Structured logging utility using Pino for browser
// Provides consistent logging with levels and context

import pino from "pino";

// Configure pino for browser environment
const isDev = import.meta.env.DEV;

export const logger = pino({
	level: isDev ? "debug" : "info",
	browser: {
		asObject: true,
		transmit: {
			level: "error",
			send: (level, logEvent) => {
				// In production, you could send errors to a service like Sentry
				// For now, we just ensure they're logged to console
				if (level === "error") {
					console.error(logEvent);
				}
			},
		},
	},
	// Browser-friendly formatting
	formatters: {
		level: (label) => {
			return { level: label };
		},
	},
});

// Helper methods for common logging patterns
export const logApiCall = (
	method: string,
	endpoint: string,
	status?: number,
) => {
	logger.info({ method, endpoint, status }, "API Call");
};

export const logError = (
	message: string,
	error: Error | unknown,
	context?: Record<string, unknown>,
) => {
	if (error instanceof Error) {
		logger.error(
			{
				...context,
				error: {
					message: error.message,
					stack: error.stack,
					name: error.name,
				},
			},
			message,
		);
	} else {
		logger.error({ ...context, error }, message);
	}
};

export const logUserAction = (
	action: string,
	context?: Record<string, unknown>,
) => {
	logger.debug({ action, ...context }, "User Action");
};
