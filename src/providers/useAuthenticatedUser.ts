import type { SignInResponse } from "../types";
import { useAuth } from "./auth.provider";

/**
 * Use this hook ONLY in routes under `_auth/` where authentication is guaranteed.
 * The `_auth.tsx` route guard ensures users are authenticated before rendering.
 *
 * This hook provides a non-null user, eliminating redundant null checks.
 *
 * @throws Error if used outside of an authenticated route (should never happen
 * if used correctly, but provides safety during development)
 */
export function useAuthenticatedUser(): SignInResponse {
	const { user, authState } = useAuth();

	// This should never happen in _auth routes due to the route guard,
	// but provides a safety check during development
	if (authState !== "authenticated" || !user) {
		throw new Error(
			"useAuthenticatedUser must only be used in authenticated routes (_auth/*). " +
				"The user should always exist here due to the route guard in _auth.tsx.",
		);
	}

	return user;
}
