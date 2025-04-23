// Field error display component

import { FieldApi } from "@tanstack/react-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function FieldError({ field }: { field: FieldApi<any, any, any, any> }) {
  if (!field.state.meta.touchedErrors) return null;
  return (
    <p className="validator-hint text-error text-sm mt-1">
      {field.state.meta.touchedErrors}
    </p>
  );
}
