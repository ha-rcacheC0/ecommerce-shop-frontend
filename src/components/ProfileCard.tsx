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
  const dob = new Date(userProfile.dateOfBirth!);
  return (
    <div className="card bg-neutral shadow-xl max-w-md  p-6 ">
      <div className="flex justify-between items-center gap-3 text-center mb-4">
        <h2 className="text-2xl font-bold">Profile</h2>
        <Link to="/profile/edit" className="btn btn-primary btn-sm">
          <FontAwesomeIcon icon={faEdit} />
          Edit Profile
        </Link>
      </div>
      <div className="space-y-2 justify-center flex flex-col mx-auto">
        <div>
          <span className="font-semibold">First Name:</span>{" "}
          {userProfile?.firstName ?? ""}
        </div>
        <div>
          <span className="font-semibold">Last Name:</span>{" "}
          {userProfile?.lastName}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {userEmail}
        </div>
        <div>
          <span className="font-semibold">Date of Birth:</span>{" "}
          {dob.toLocaleDateString()}
        </div>
        <div>
          <span className="font-semibold">Phone Number:</span>{" "}
          {userProfile?.phoneNumber}
        </div>
        <div>
          <span className="font-semibold">Billing Address:</span>
          <div className="ml-2">
            {userProfile?.billingAddress?.street1}
            <br />
            {userProfile?.billingAddress?.city}
            {", "}
            {userProfile?.billingAddress?.state}{" "}
            {userProfile?.billingAddress?.postalCode}
          </div>
        </div>
        <div>
          <span className="font-semibold">Shipping Address:</span>
          <div className="ml-2">
            {userProfile?.shippingAddress?.street1}
            <br />
            {userProfile?.shippingAddress?.city}
            {", "}
            {userProfile?.shippingAddress?.state}{" "}
            {userProfile?.shippingAddress?.postalCode}
          </div>
        </div>
        <div>
          <span className="font-semibold">Can Contact:</span>{" "}
          {userProfile?.canContact ? "Yes" : "No"}
        </div>
      </div>
    </div>
  );
};
