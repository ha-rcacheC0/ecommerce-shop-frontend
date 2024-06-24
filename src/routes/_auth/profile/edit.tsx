import { FieldApi, useForm } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";

// Define the schema using zod
const userProfileSchema = z.object({
  userId: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.preprocess(
    (arg) => (arg ? new Date(arg as string) : undefined),
    z.date().optional()
  ),
  phoneNumber: z.string().optional(),
  billingAddress: z
    .object({
      street1: z.string(),
      street2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
    })
    .optional(),
  shippingAddress: z
    .object({
      street1: z.string(),
      street2: z.string().optional(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
    })
    .optional(),
  canContact: z.boolean().optional(),
});

type TUserProfile = z.infer<typeof userProfileSchema>;

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

export const ProfileForm = ({ userProfile }: { userProfile: TUserProfile }) => {
  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: userProfile,
    onSubmit: async ({ value }) => {
      console.log(value);
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
        className="bg-white p-8 rounded-lg shadow-md w-4/5 max-w-4xl"
      >
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-bold mb-4">Personal Info</h2>
          <div className="grid grid-cols-1 gap-4">
            <form.Field
              name="firstName"
              children={(field) => (
                <>
                  <label htmlFor={field.name} className="font-semibold">
                    First Name:
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="input input-bordered w-full mb-2"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            />
            <form.Field
              name="lastName"
              children={(field) => (
                <>
                  <label htmlFor={field.name} className="block font-semibold">
                    Last Name:
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="input input-bordered w-full mb-2"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            />
            <form.Field
              name="dateOfBirth"
              children={(field) => (
                <>
                  <label htmlFor={field.name} className="block font-semibold">
                    Date of Birth:
                  </label>
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
                    className="input input-bordered w-full mb-2"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            />
            <form.Field
              name="phoneNumber"
              children={(field) => (
                <>
                  <label htmlFor={field.name} className="block font-semibold">
                    Phone Number:
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="input input-bordered w-full mb-2"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            />
          </div>
        </div>

        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-bold mb-4">Billing Address</h2>
          <div className="grid grid-cols-1  gap-4">
            <form.Field
              name="billingAddress.street1"
              children={(field) => (
                <>
                  <label htmlFor={field.name} className="block font-semibold">
                    Street 1:
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="input input-bordered w-full mb-2"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            />
            <form.Field
              name="billingAddress.street2"
              children={(field) => (
                <>
                  <label htmlFor={field.name} className="block font-semibold">
                    Street 2:
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="input input-bordered w-full mb-2"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            />
            <form.Field
              name="billingAddress.city"
              children={(field) => (
                <>
                  <label htmlFor={field.name} className="w-1/2 font-semibold">
                    City:
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="input input-bordered w-1/2 mb-2"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            />
            <form.Field
              name="billingAddress.state"
              children={(field) => (
                <>
                  <label htmlFor={field.name} className=" font-semibold">
                    State:
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="input input-bordered w-1/2 mb-2"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            />
            <form.Field
              name="billingAddress.postalCode"
              children={(field) => (
                <>
                  <label htmlFor={field.name} className="block font-semibold">
                    Postal Code:
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="input input-bordered w-full mb-2"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            />
          </div>
        </div>

        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="shippingAddress.street1"
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="input input-bordered flex items-center gap-2"
                  >
                    Street 1:
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="grow"
                    />
                  </label>
                  <FieldInfo field={field} />
                </>
              )}
            />
            <form.Field
              name="shippingAddress.street2"
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="input input-bordered flex items-center gap-2"
                  >
                    Street 2:
                    <input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="grow"
                    />
                  </label>
                  <FieldInfo field={field} />
                </>
              )}
            />
            <form.Field
              name="shippingAddress.city"
              children={(field) => (
                <>
                  <label htmlFor={field.name} className="block font-semibold">
                    City:
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="input input-bordered w-full mb-2"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            />
            <form.Field
              name="shippingAddress.state"
              children={(field) => (
                <>
                  <label htmlFor={field.name} className="block font-semibold">
                    State:
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="input input-bordered w-full mb-2"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            />
            <form.Field
              name="shippingAddress.postalCode"
              children={(field) => (
                <>
                  <label htmlFor={field.name} className="block font-semibold">
                    Postal Code:
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="input input-bordered w-full mb-2"
                  />
                  <FieldInfo field={field} />
                </>
              )}
            />
          </div>
        </div>

        <div className="pb-4">
          <h2 className="text-xl font-bold mb-4">Contact Preferences</h2>
          <form.Field
            name="canContact"
            children={(field) => (
              <>
                <label htmlFor={field.name} className="block font-semibold">
                  Can Contact:
                </label>
                <input
                  type="checkbox"
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  className="checkbox checkbox-primary"
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Save
        </button>
      </form>
    </div>
  );
};

export const Route = createFileRoute("/_auth/profile/edit")({
  component: ProfileForm,
});
