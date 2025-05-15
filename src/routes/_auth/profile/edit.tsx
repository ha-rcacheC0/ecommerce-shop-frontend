import { useForm } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useState, useEffect } from "react";

import { States } from "../../../types";
import {
  useUserInfoPostMutation,
  userInfoQueryOptions,
} from "../../../api/users/userQueryOptions.api";
import { useQuery } from "@tanstack/react-query";
import { FieldError } from "../../../components/component-parts/ErrorMessage";

export const ProfileForm = () => {
  const { auth } = Route.useRouteContext();
  const { data: userProfile } = useQuery(
    userInfoQueryOptions(auth.user!.token!)
  );
  const navigate = useNavigate();
  const [sameAddress, setSameAddress] = useState(true);

  const mutation = useUserInfoPostMutation(
    auth.user!.token!,
    () => {
      navigate({ to: "/profile" });
    },
    (error) => {
      console.error("Error updating profile:", error);
    }
  );

  const form = useForm({
    validatorAdapter: zodValidator,
    defaultValues: userProfile,
    onSubmit: ({ value }) => {
      if (sameAddress && value.billingAddress) {
        value.shippingAddress = { ...value.billingAddress };
      }
      mutation.mutate({ token: auth.user!.token!, body: value });
    },
  });

  useEffect(() => {
    if (userProfile) {
      const billing = userProfile.billingAddress;
      const shipping = userProfile.shippingAddress;

      // Check if addresses exist and are the same
      if (billing && shipping) {
        const isSame =
          billing.street1 === shipping.street1 &&
          billing.street2 === shipping.street2 &&
          billing.city === shipping.city &&
          billing.state === shipping.state &&
          billing.postalCode === shipping.postalCode;

        setSameAddress(isSame);
      }
    }
  }, [userProfile]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 py-8 px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-4xl"
      >
        <h1 className="text-2xl font-bold mb-6 text-base-content">
          Edit Profile
        </h1>

        {/* Personal Information Section */}
        <div className="border-b border-base-300 pb-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-base-content">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <form.Field name="firstName">
              {(field) => (
                <div>
                  <label className="floating-label">
                    <span>First Name</span>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </label>
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            {/* Last Name */}
            <form.Field name="lastName">
              {(field) => (
                <div>
                  <label className="floating-label">
                    <span>Last Name</span>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </label>
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            {/* Date of Birth */}
            <form.Field name="dateOfBirth">
              {(field) => (
                <div>
                  <label className="floating-label">
                    <span>Date of Birth</span>
                    <input
                      type="date"
                      className="input input-bordered w-full"
                      value={
                        field.state.value
                          ? new Date(field.state.value)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const dateValue = e.target.value
                          ? new Date(e.target.value)
                          : undefined;
                        field.handleChange(dateValue);
                      }}
                      onBlur={field.handleBlur}
                    />
                  </label>
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            {/* Phone Number */}
            <form.Field name="phoneNumber">
              {(field) => (
                <div>
                  <label className="floating-label">
                    <span>Phone Number</span>
                    <input
                      type="tel"
                      className="input input-bordered w-full"
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </label>
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>
          </div>

          {/* Contact Preference */}
          <div className="mt-4">
            <form.Field name="canContact">
              {(field) => (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="canContact"
                    className="checkbox checkbox-primary"
                    checked={field.state.value ?? false}
                    onChange={(e) => field.handleChange(e.target.checked)}
                  />
                  <label htmlFor="canContact" className="cursor-pointer">
                    I would like to receive promotional emails and updates
                  </label>
                </div>
              )}
            </form.Field>
          </div>
        </div>

        {/* Billing Address Section */}
        <div className="border-b border-base-300 pb-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-base-content">
            Billing Address
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {/* Street 1 */}
            <form.Field name="billingAddress.street1">
              {(field) => (
                <div>
                  <label className="floating-label">
                    <span>Street Address</span>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </label>
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            {/* Street 2 */}
            <form.Field name="billingAddress.street2">
              {(field) => (
                <div>
                  <label className="floating-label">
                    <span>Apartment, Suite, etc. (optional)</span>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </label>
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* City */}
              <form.Field name="billingAddress.city">
                {(field) => (
                  <div>
                    <label className="floating-label">
                      <span>City</span>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </label>
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              {/* State */}
              <form.Field name="billingAddress.state">
                {(field) => (
                  <div>
                    <label className="floating-label">
                      <span>State</span>
                      <select
                        className="select select-bordered w-full"
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
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
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              {/* Postal Code */}
              <form.Field name="billingAddress.postalCode">
                {(field) => (
                  <div>
                    <label className="floating-label">
                      <span>Postal Code</span>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </label>
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          {/* Same Address Checkbox */}
          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="sameAddress"
              className="checkbox checkbox-primary"
              checked={sameAddress}
              onChange={(e) => setSameAddress(e.target.checked)}
            />
            <label htmlFor="sameAddress" className="cursor-pointer">
              Use the same address for shipping
            </label>
          </div>
        </div>

        {/* Shipping Address Section - Only show if not using same address */}
        {!sameAddress && (
          <div className="border-b border-base-300 pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-base-content">
              Shipping Address
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {/* Street 1 */}
              <form.Field name="shippingAddress.street1">
                {(field) => (
                  <div>
                    <label className="floating-label">
                      <span>Street Address</span>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </label>
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              {/* Street 2 */}
              <form.Field name="shippingAddress.street2">
                {(field) => (
                  <div>
                    <label className="floating-label">
                      <span>Apartment, Suite, etc. (optional)</span>
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={field.state.value ?? ""}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                    </label>
                    <FieldError field={field} />
                  </div>
                )}
              </form.Field>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* City */}
                <form.Field name="shippingAddress.city">
                  {(field) => (
                    <div>
                      <label className="floating-label">
                        <span>City</span>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          value={field.state.value ?? ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </label>
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                {/* State */}
                <form.Field name="shippingAddress.state">
                  {(field) => (
                    <div>
                      <label className="floating-label">
                        <span>State</span>
                        <select
                          className="select select-bordered w-full"
                          value={field.state.value ?? ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
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
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>

                {/* Postal Code */}
                <form.Field name="shippingAddress.postalCode">
                  {(field) => (
                    <div>
                      <label className="floating-label">
                        <span>Postal Code</span>
                        <input
                          type="text"
                          className="input input-bordered w-full"
                          value={field.state.value ?? ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                        />
                      </label>
                      <FieldError field={field} />
                    </div>
                  )}
                </form.Field>
              </div>
            </div>
          </div>
        )}

        {/* Form Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate({ to: "/profile" })}
            disabled={mutation.isPending}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </button>
        </div>
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
