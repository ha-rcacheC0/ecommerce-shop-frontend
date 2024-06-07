import { createFileRoute } from "@tanstack/react-router";
import { userInfoQueryOptions } from "../../../api/users/userQueryOptions.api";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_auth/profile/")({
  loader: async ({ context: { queryClient, auth } }) => {
    await queryClient.prefetchQuery(userInfoQueryOptions(auth.user!.token!));
  },
  component: () => ProfilePage,
});

// Create Profile Page
const ProfilePage = () => {
  const { auth } = Route.useRouteContext();
  const {
    data: userProfile,
    isLoading,
    isError,
  } = useQuery(userInfoQueryOptions(auth.user!.token!));
  if (isLoading || isError) return <>Loading Profile ...</>;
  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-2xl font-bold">Profile</h2>
      <div className="space-y-2">
        <div>
          <span className="font-semibold">First Name:</span>{" "}
          {userProfile?.firstName ?? ""}
        </div>
        <div>
          <span className="font-semibold">Last Name:</span>{" "}
          {userProfile?.lastName}
        </div>
        <div>
          <span className="font-semibold">Email:</span>{" "}
          {auth.user?.userInfo?.email}
        </div>
        <div>
          <span className="font-semibold">Date of Birth:</span>{" "}
          {userProfile?.dateOfBirth?.toLocaleDateString()}
        </div>
        <div>
          <span className="font-semibold">Phone Number:</span>{" "}
          {userProfile?.phoneNumber}
        </div>
        <div>
          <span className="font-semibold">Billing Address:</span>{" "}
          {userProfile?.billingAddress?.street1},{" "}
          {userProfile?.billingAddress?.city},{" "}
          {userProfile?.billingAddress?.state},{" "}
          {userProfile?.billingAddress?.postalCode}
        </div>
        <div>
          <span className="font-semibold">Shipping Address:</span>{" "}
          {userProfile?.shippingAddress?.street1},{" "}
          {userProfile?.shippingAddress?.city},{" "}
          {userProfile?.shippingAddress?.state},{" "}
          {userProfile?.shippingAddress?.postalCode}
        </div>
        <div>
          <span className="font-semibold">Can Contact:</span>{" "}
          {userProfile?.canContact ? "Yes" : "No"}
        </div>
      </div>
    </div>
  );
};

// Create Edit Page Link

// Cart Window View

//
