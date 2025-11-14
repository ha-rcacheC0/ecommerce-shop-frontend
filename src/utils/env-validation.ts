// Environment variable validation for frontend
// Ensures required Vite environment variables are set

interface EnvConfig {
	// Required
	VITE_API_BASE_URL: string;

	// Optional
	SENTRY_AUTH_TOKEN?: string;
	VITE_CLERK_PUBLISHABLE_KEY?: string;
}

/**
 * Validates required environment variables
 * Warns about optional missing variables
 */
export function validateEnvironment(): EnvConfig {
	const missingRequired: string[] = [];
	const missingOptional: string[] = [];

	// Check required variables
	if (!import.meta.env.VITE_API_BASE_URL) {
		missingRequired.push("VITE_API_BASE_URL");
	}

	// Check optional variables (just informational)
	if (!import.meta.env.SENTRY_AUTH_TOKEN) {
		missingOptional.push("SENTRY_AUTH_TOKEN (error tracking will be disabled)");
	}

	if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
		missingOptional.push(
			"VITE_CLERK_PUBLISHABLE_KEY (Clerk authentication will be disabled)",
		);
	}

	// Error if required variables are missing
	if (missingRequired.length > 0) {
		const errorMessage = `
╔════════════════════════════════════════════════════════════════╗
║          MISSING REQUIRED ENVIRONMENT VARIABLES                ║
╚════════════════════════════════════════════════════════════════╝

The following environment variables are required but not set:

${missingRequired.map((v) => `  ✗ ${v}`).join("\n")}

To fix this:
1. Copy .env.example to .env: cp .env.example .env
2. Fill in the missing values in .env
3. Restart the development server

See README.md for details.
    `;

		throw new Error(errorMessage);
	}

	// Warn about optional variables (only in development)
	if (missingOptional.length > 0 && import.meta.env.DEV) {
		console.warn("\n⚠️  Optional Environment Variables Not Set:");
		missingOptional.forEach((msg) => console.warn(`  - ${msg}`));
		console.warn(
			"\nThe app will work without these, but some features may be disabled.\n",
		);
	}

	return {
		VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
		SENTRY_AUTH_TOKEN: import.meta.env.SENTRY_AUTH_TOKEN,
		VITE_CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
	};
}

// Auto-validate on import (only in development)
if (import.meta.env.DEV) {
	try {
		validateEnvironment();
		console.info("✓ Required environment variables are set");
	} catch (error) {
		console.error(error);
		// Don't exit in browser, just log the error
	}
}

/**
 * Get validated environment config
 */
export function getEnv(): EnvConfig {
	return validateEnvironment();
}
