/* eslint-disable @typescript-eslint/no-explicit-any */
// biome-ignore lint/suspicious/noExplicitAny: TanStack Form FieldApi requires many generic parameters
import type { FieldApi } from "@tanstack/react-form";

export function FieldError({
	field,
}: {
	field: FieldApi<
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any,
		any
	>;
}) {
	if (!field.state.meta.errors) return null;
	return (
		<p className="validator-hint text-error text-sm mt-1">
			{field.state.meta.errors}
		</p>
	);
}
