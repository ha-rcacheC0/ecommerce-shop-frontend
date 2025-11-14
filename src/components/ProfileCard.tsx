import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";
import { type ThemeType, useThemeProvider } from "../providers/theme.provider";
import type { UserProfile } from "../types";

export const ProfileCard = ({
	userProfile,
	userEmail,
}: {
	userProfile: UserProfile;
	userEmail: string;
}) => {
	const { theme, updateTheme } = useThemeProvider();
	const dob = userProfile.dateOfBirth
		? new Date(userProfile.dateOfBirth)
		: null;

	// Theme options for the dropdown
	const themeOptions: { label: string; value: ThemeType }[] = [
		{ label: "Light", value: "light" },
		{ label: "Dark", value: "dark" },
		{ label: "Cupcake", value: "cupcake" },
		{ label: "Bumblebee", value: "bumblebee" },
		{ label: "Emerald", value: "emerald" },
		{ label: "Corporate", value: "corporate" },
		{ label: "Synthwave", value: "synthwave" },
		{ label: "Retro", value: "retro" },
		{ label: "Cyberpunk", value: "cyberpunk" },
		{ label: "Valentine", value: "valentine" },
		{ label: "Halloween", value: "halloween" },
		{ label: "Garden", value: "garden" },
		{ label: "Forest", value: "forest" },
		{ label: "Aqua", value: "aqua" },
		{ label: "Lofi", value: "lofi" },
		{ label: "Pastel", value: "pastel" },
		{ label: "Fantasy", value: "fantasy" },
		{ label: "Wireframe", value: "wireframe" },
		{ label: "Black", value: "black" },
		{ label: "Luxury", value: "luxury" },
		{ label: "Dracula", value: "dracula" },
		{ label: "Cmyk", value: "cmyk" },
		{ label: "Autumn", value: "autumn" },
		{ label: "Business", value: "business" },
		{ label: "Acid", value: "acid" },
		{ label: "Lemonade", value: "lemonade" },
		{ label: "Night", value: "night" },
		{ label: "Winter", value: "winter" },
	];

	return (
		<div className="card bg-base-100 shadow-xl w-full max-w-lg overflow-hidden">
			{/* Card Header */}
			<div className="bg-primary text-primary-content p-4">
				<div className="flex justify-between items-center">
					<h2 className="text-2xl font-bold">Profile</h2>
					<Link to="/profile/edit" className="btn btn-sm btn-ghost">
						<FontAwesomeIcon icon={faEdit} className="mr-2" /> Edit
					</Link>
				</div>
			</div>

			{/* Card Content */}
			<div className="p-6">
				{/* Theme Selector */}
				<div className="form-control w-full mb-6">
					<label className="select font-medium mb-2 sm:mb-0">
						<span className="label">Choose Theme</span>
						<select
							value={theme}
							onChange={(e) => updateTheme(e.target.value as ThemeType)}
						>
							{themeOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</label>
				</div>

				{/* Personal Information */}
				<div className="mb-6">
					<h3 className="text-lg font-semibold border-b pb-2 mb-3">
						Personal Information
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						<ProfileField
							label="Name"
							value={
								userProfile?.firstName || userProfile?.lastName
									? `${userProfile?.firstName || ""} ${userProfile?.lastName || ""}`.trim()
									: undefined
							}
						/>
						<ProfileField label="Email" value={userEmail} />
						<ProfileField
							label="Date of Birth"
							value={dob?.toLocaleDateString("en-US", { timeZone: "UTC" })}
						/>
						<ProfileField
							label="Phone Number"
							value={userProfile?.phoneNumber || ""}
						/>
						<ProfileField
							label="Receive Updates"
							value={userProfile?.canContact ? "Yes" : "No"}
							className="sm:col-span-2"
						/>
					</div>
				</div>

				{/* Addresses */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Billing Address */}
					<AddressField
						label="Billing Address"
						address={userProfile?.billingAddress}
						type="billing"
					/>

					{/* Shipping Address */}
					<AddressField
						label="Shipping Address"
						address={userProfile?.shippingAddress}
						type="shipping"
					/>
				</div>
			</div>
		</div>
	);
};

const ProfileField = ({
	label,
	value,
	className = "",
}: {
	label: string;
	value: string | undefined;
	className?: string;
}) => (
	<div className={`${className}`}>
		<span className="font-semibold text-base-content/80">{label}:</span>
		{value ? (
			<span className="ml-2 block text-base-content"> {value} </span>
		) : (
			<span className="ml-2 block text-warning">Not Provided</span>
		)}
	</div>
);

const AddressField = ({
	label,
	address,
	type,
}: {
	label: string;
	address: UserProfile["billingAddress"];
	type: "billing" | "shipping";
}) => (
	<div className="p-4 bg-base-200 rounded-lg">
		<h3 className="text-lg font-semibold mb-2">{label}</h3>
		{address ? (
			<div className="space-y-1">
				<div>{address.street1}</div>
				{address.street2 && <div>{address.street2}</div>}
				<div>
					{address.city}, {address.state} {address.postalCode}
				</div>
			</div>
		) : (
			<div className="text-warning">Please update your {type} address</div>
		)}
	</div>
);
