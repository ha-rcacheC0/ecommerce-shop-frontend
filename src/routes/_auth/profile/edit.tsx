import { FieldApi, useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";

import { States, UserProfile } from "../../../types";
import {
  useUserInfoPostMutation,
  userInfoQueryOptions,
} from "../../../api/users/userQueryOptions.api";
import { useQuery } from "@tanstack/react-query";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.touchedErrors ? (
        <em>{field.state.meta.touchedErrors}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

export const ProfileForm = () => {
  const { auth } = Route.useRouteContext();
  const { data: userProfile }: { data: UserProfile | undefined } = useQuery({
    queryKey: ["userInfo", auth.user?.token],
  });
  const navigate = useNavigate();
  const mutation = useUserInfoPostMutation(
    auth.user!.token!,
    () => {},
    () => {}
  );
  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: userProfile,
    onSubmit: async ({ value }) => {
      mutation.mutate({ token: auth.user!.token!, body: value });
      navigate({ to: "/profile" });
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="bg-white p-8 rounded-lg shadow-md w-4/5 max-w-4xl "
      >
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-bold mb-4 text-base-300">
            Personal Info
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <form.Field name="firstName">
                {(field) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className="font-semibold input input-bordered flex items-center gap-2"
                    >
                      First Name:
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="grow"
                      />
                    </label>
                    <FieldInfo field={field} />
                  </>
                )}
              </form.Field>
              <form.Field name="lastName">
                {(field) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className="font-semibold input input-bordered flex items-center gap-2"
                    >
                      Last Name:
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="grow"
                      />
                    </label>
                    <FieldInfo field={field} />
                  </>
                )}
              </form.Field>
            </div>
            <div className="flex gap-2">
              <form.Field name="dateOfBirth">
                {(field) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className="font-semibold input input-bordered flex items-center gap-2"
                    >
                      Date of Birth:
                      <input
                        type="date"
                        id={field.name}
                        name={field.name}
                        value={
                          field.state.value
                            ? new Date(field.state.value)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const dateValue = e.target.value
                            ? new Date(e.target.value)
                            : undefined;
                          field.handleChange(dateValue);
                        }}
                        className="grow"
                      />
                    </label>
                    <FieldInfo field={field} />
                  </>
                )}
              </form.Field>
              <form.Field name="phoneNumber">
                {(field) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className="font-semibold input input-bordered flex items-center gap-2"
                    >
                      Phone Number:
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="grow"
                      />
                    </label>
                    <FieldInfo field={field} />
                  </>
                )}
              </form.Field>
              <form.Field name="canContact">
                {(field) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className="flex items-center font-semibold text-base-300"
                    >
                      Can Contact:
                      <input
                        type="checkbox"
                        id={field.name}
                        name={field.name}
                        checked={field.state.value ?? false}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.checked)}
                        className="checkbox checkbox-primary"
                      />
                    </label>
                    <FieldInfo field={field} />
                  </>
                )}
              </form.Field>
            </div>
          </div>
        </div>

        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-bold mb-4 text-base-300">
            Billing Address
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <form.Field name="billingAddress.street1">
              {(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="font-semibold input input-bordered flex items-center gap-2"
                  >
                    Street 1:
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </label>
                  <FieldInfo field={field} />
                </>
              )}
            </form.Field>
            <form.Field name="billingAddress.street2">
              {(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="font-semibold input input-bordered flex items-center gap-2"
                  >
                    Street 2:
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </label>
                  <FieldInfo field={field} />
                </>
              )}
            </form.Field>
            <div className="flex gap-2">
              <form.Field name="billingAddress.city">
                {(field) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className="font-semibold input input-bordered w-2/5 flex items-center mb-2"
                    >
                      City:
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className=" "
                      />
                    </label>
                    <FieldInfo field={field} />
                  </>
                )}
              </form.Field>
              <form.Field name="billingAddress.state">
                {(field) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className="w-1/5 font-semibold input input-bordered flex items-center gap-2"
                    >
                      State:
                      <select
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="select grow"
                      >
                        <option value="" disabled>
                          Select a state
                        </option>
                        {Object.entries(States).map(([code, name]) => (
                          <option key={code} value={code}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <FieldInfo field={field} />
                  </>
                )}
              </form.Field>
              <form.Field name="billingAddress.postalCode">
                {(field) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className="w-2/5 font-semibold input input-bordered flex items-center gap-2"
                    >
                      Postal Code:
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </label>
                    <FieldInfo field={field} />
                  </>
                )}
              </form.Field>
            </div>
          </div>
        </div>

        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-bold mb-4 text-base-300">
            Shipping Address
          </h2>
          <div className="flex flex-col gap-4">
            <form.Field name="shippingAddress.street1">
              {(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="font-semibold input input-bordered flex items-center gap-2"
                  >
                    Street 1:
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="grow"
                    />
                  </label>
                  <FieldInfo field={field} />
                </>
              )}
            </form.Field>
            <form.Field name="shippingAddress.street2">
              {(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="font-semibold input input-bordered flex items-center gap-2"
                  >
                    Street 2:
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="grow"
                    />
                  </label>
                  <FieldInfo field={field} />
                </>
              )}
            </form.Field>
            <div className="flex gap-2">
              <form.Field name="shippingAddress.city">
                {(field) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className="font-semibold input input-bordered w-2/5 flex items-center mb-2"
                    >
                      City:
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className=" "
                      />
                    </label>
                    <FieldInfo field={field} />
                  </>
                )}
              </form.Field>
              <form.Field name="shippingAddress.state">
                {(field) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className="w-1/5 font-semibold input input-bordered flex items-center gap-2"
                    >
                      State:
                      <select
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="select grow"
                      >
                        <option value="" disabled>
                          Select a state
                        </option>
                        {Object.entries(States).map(([code, name]) => (
                          <option key={code} value={code}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <FieldInfo field={field} />
                  </>
                )}
              </form.Field>
              <form.Field name="shippingAddress.postalCode">
                {(field) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className="w-2/5 font-semibold input input-bordered flex items-center gap-2"
                    >
                      Postal Code:
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </label>
                    <FieldInfo field={field} />
                  </>
                )}
              </form.Field>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Save
        </button>
      </form>
    </div>
  );
};

export const Route = createFileRoute("/_auth/profile/edit")({
  loader: async ({ context: { queryClient, auth } }) => {
    await queryClient.prefetchQuery(userInfoQueryOptions(auth.user!.token!));
  },
  component: ProfileForm,
});
