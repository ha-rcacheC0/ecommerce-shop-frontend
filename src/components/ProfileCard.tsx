import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";

type TUserProfile = {
  userId: string;
  firstName?: string | undefined;
  lastName?: string | undefined;
  dateOfBirth?: Date | undefined;
  phoneNumber?: string | undefined;
  billingAddress?:
    | {
        street1: string;
        city: string;
        state: string;
        postalCode: string;
        street2?: string | undefined;
      }
    | undefined;
  shippingAddress?:
    | {
        street1: string;
        city: string;
        state: string;
        postalCode: string;
        street2?: string | undefined;
      }
    | undefined;
  canContact?: boolean | undefined;
};

export const ProfileCard = ({
  userProfile,
  userEmail,
}: {
  userProfile: TUserProfile;
  userEmail: string;
}) => {
  const dob = userProfile.dateOfBirth
    ? new Date(userProfile.dateOfBirth)
    : null;

  return (
    <div className="card bg-base-300 shadow-xl shadow-base-300 w-full max-w-lg p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-center mb-4">
        <h2 className="text-2xl font-bold">Profile</h2>
        <Link to="/profile/edit" className="btn btn-primary btn-sm">
          <FontAwesomeIcon icon={faEdit} className="mr-2" /> Edit Profile
        </Link>
      </div>
      <div className="space-y-3 text-sm border-2 rounded-sm p-4 sm:text-base">
        <ProfileField label="First Name" value={userProfile?.firstName} />
        <ProfileField label="Last Name" value={userProfile?.lastName} />
        <ProfileField label="Email" value={userEmail} />
        <ProfileField
          label="Date of Birth"
          value={dob?.toLocaleDateString("en-US", { timeZone: "UTC" })}
        />
        <ProfileField label="Phone Number" value={userProfile?.phoneNumber} />
        <AddressField
          label="Billing Address"
          address={userProfile?.billingAddress}
          type="billing"
        />
        <AddressField
          label="Shipping Address"
          address={userProfile?.shippingAddress}
          type="shipping"
        />
        <ProfileField
          label="Receive Updates"
          value={userProfile?.canContact ? "Yes" : "No"}
        />
      </div>
    </div>
  );
};

const ProfileField = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) => (
  <div className="flex flex-col">
    <span className="font-semibold">{label}:</span>

    {value ? (
      <span className="ml-2 text-center"> {value} </span>
    ) : (
      <span className="ml-2 text-yellow-500">Not Provided</span>
    )}
  </div>
);

const AddressField = ({
  label,
  address,
  type,
}: {
  label: string;
  address: TUserProfile["billingAddress"];
  type: "billing" | "shipping";
}) => (
  <div className="flex flex-col">
    <span className="font-semibold">{label}:</span>
    {address ? (
      <div className="ml-2 text-center">
        {address.street1}
        <br />
        {address.city}, {address.state} {address.postalCode}
      </div>
    ) : (
      <span className="ml-2 text-yellow-500">
        Please update your {type} address
      </span>
    )}
  </div>
);
