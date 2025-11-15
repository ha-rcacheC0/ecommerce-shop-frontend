import {
	faEdit,
	faShoppingBag,
	faStopCircle,
	faStore,
	faTheaterMasks,
	faTruck,
	faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { getOneTerminalQueryOptions } from "../api/terminals/terminalQueries";
import {
	userInfoQueryOptions,
	useUserInfoPostMutation,
} from "../api/users/userQueryOptions.api";
import { useAuth } from "../providers/auth.provider";
import type { TAddress, TApprovedTerminal, TCartProduct } from "../types";
import { logger } from "../utils/logger";
import {
	calculateShipping,
	calculateStateTax,
	checkOrderType,
} from "../utils/utils";
import { isObjectEmpty } from "../utils/validationUtils";
import CartItem from "./component-parts/cart-item";
import HelcimPayButton from "./component-parts/helcimPayButton";
import StateZipInput from "./component-parts/state-zip-input";
import TerminalSelection from "./component-parts/terminal-selection";
import TosModal from "./component-parts/tos-Modal";

const Cart = ({
	products,
	shippingAddress,
}: {
	products: TCartProduct[];
	shippingAddress: TAddress;
}) => {
	const [isTerminalDestination, setIsTerminalDestination] = useState(false);
	const [isUpdatingValues, setIsUpdatingValues] = useState(true);
	const [needLiftGate, setNeedLiftGate] = useState(false);
	const [shipping, setShipping] = useState(0);
	const [tax, setTax] = useState(0);
	const [isShippableState, setIsShippableState] = useState(true);
	const [currentShippingAddress, setCurrentShippingAddress] = useState<
		TAddress | undefined
	>(shippingAddress);
	const [terminalDestination, setTerminalDestination] = useState("");
	const [state, setState] = useState("");
	const [zipcode, setZipcode] = useState("");
	const [isTosModalOpen, setIsTosModalOpen] = useState(false);
	const { user } = useAuth();

	const { data: userProfile } = useQuery(
		userInfoQueryOptions(user?.token ?? ""),
	);
	const { mutate } = useUserInfoPostMutation(
		user?.token ?? "",
		() => {
			setIsTosModalOpen(false);
		},
		(error) => {
			console.error("Error updating user info:", error);
		},
	);

	let caseSubtotal = 0;
	let unitSubtotal = 0;

	const subtotal = products.reduce((acc, elm) => {
		const productCaseSubtotal =
			parseFloat(elm.product.casePrice) * elm.caseQuantity;

		// Handle variant pricing for apparel products
		const variant = elm.product.variants?.find((v) => v.id === elm.variantId);
		const unitPrice = variant
			? parseFloat(variant.unitPrice)
			: elm.product.unitProduct
				? parseFloat(elm.product.unitProduct.unitPrice)
				: 0;

		const productUnitSubtotal = unitPrice * elm.unitQuantity;

		caseSubtotal += productCaseSubtotal;
		unitSubtotal += productUnitSubtotal;

		return acc + productCaseSubtotal + productUnitSubtotal;
	}, 0);

	// Check if there's any show product in the cart
	const hasShow = !!products.find((elm) => elm.product.isShow);
	const onlyApparel = !!products.every((elm) => elm.product.isApparel);

	// Pass the hasShow flag to checkOrderType
	const orderType = checkOrderType(
		caseSubtotal,
		unitSubtotal,
		hasShow,
		onlyApparel,
	);

	// Calculate tax and grand total with tax included
	useEffect(() => {
		setIsUpdatingValues(true);

		// Only calculate tax if we have a valid shipping address
		if (currentShippingAddress && !isObjectEmpty(currentShippingAddress)) {
			try {
				const stateTax = calculateStateTax(
					currentShippingAddress.state,
					subtotal,
				);
				setTax(stateTax);
				setIsShippableState(true);
			} catch (error) {
				if (error instanceof Error && error.message.includes("don't ship")) {
					setIsShippableState(false);
					setTax(0);
				} else {
					// Handle other errors
					console.error("Tax calculation error:", error);
					setTax(0);
				}
			}
		} else {
			setTax(0);
		}

		setIsUpdatingValues(false);
	}, [currentShippingAddress, subtotal]);

	// Calculate the lift gate fee
	const liftGateFee = needLiftGate ? 100 : 0;

	const grandTotal = subtotal + shipping + tax + liftGateFee;

	// Memoize amounts object to prevent unnecessary re-fetches of checkout token
	const amounts = useMemo(() => {
		const amountsObj = { subtotal, tax, liftGateFee, shipping, grandTotal };
		logger.debug(amountsObj, "Cart: Amounts calculated");
		return amountsObj;
	}, [subtotal, tax, liftGateFee, shipping, grandTotal]);

	useEffect(() => {
		setIsUpdatingValues(true);
		const newShipping = calculateShipping({
			orderAmount: subtotal,
			orderType: orderType,
			destination: isTerminalDestination ? "terminal" : "anywhere",
			needLiftGate: false, // Don't include lift gate in shipping calculation
		});
		setShipping(newShipping);
		setIsUpdatingValues(false);
	}, [subtotal, isTerminalDestination, orderType]);

	const { data: terminalData }: { data: TApprovedTerminal | undefined } =
		useQuery(
			getOneTerminalQueryOptions({
				id: terminalDestination,
				isTerminalDest: !!terminalDestination,
			}),
		);

	useEffect(() => {
		setIsUpdatingValues(true);
		if (isTerminalDestination && terminalData) {
			setCurrentShippingAddress({
				id: terminalData.address.id,
				street1: terminalData.address.street1,
				street2: terminalData.address.street2 || "",
				city: terminalData.address.city,
				state: terminalData.address.state,
				postalCode: terminalData.address.postalCode,
			});
		} else if (!isTerminalDestination) {
			// When switching from terminal to user address
			setCurrentShippingAddress(
				isObjectEmpty(shippingAddress) ? undefined : shippingAddress,
			);
		}
		setIsUpdatingValues(false);
	}, [isTerminalDestination, terminalData, shippingAddress]);

	const isToSAccepted = userProfile?.acceptedTerms || false;
	const handleTosAccept = async () => {
		try {
			// Update user profile with TOS acceptance
			mutate({
				token: user?.token ?? "",
				body: { userId: user?.userInfo?.profile?.userId, acceptedTerms: true },
			});
		} catch (error) {
			console.error("Failed to update TOS acceptance:", error);
		}
	};

	const isShippingAddressSet =
		currentShippingAddress && !isObjectEmpty(currentShippingAddress);

	if (products.length === 0) {
		return (
			<div className="text-center p-6 bg-base-200 rounded-lg">
				<h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
				<p className="mb-4 text-base-content/70">
					Add some items to your cart to get started.
				</p>
				<Link
					to="/products"
					search={{ page: 1, pageSize: 25 }}
					className="btn btn-primary"
				>
					Go to Product Catalog
				</Link>
			</div>
		);
	}

	return (
		<div className="bg-base-100 p-0 rounded-lg overflow-hidden">
			<TosModal
				isOpen={isTosModalOpen}
				onClose={() => {
					setIsTosModalOpen(false);
				}}
				onAccept={handleTosAccept}
			/>
			{/* Cart table with fixed styling to match design */}
			<div className="overflow-x-auto w-full">
				<table className="w-full table-auto">
					<thead>
						<tr className="bg-base-200 text-base-content">
							<th className=" py-3 px-4 ">Product</th>
							<th className=" py-3 px-4 ">SKU</th>
							<th className=" py-3 px-4 ">Quantity</th>
							<th className=" py-3 px-4 ">Subtotal</th>
							<th className=" py-3 px-4 ">Remove</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product, index) => (
							<CartItem
								key={`${product.productId}-${product.variantId || "default"}`}
								product={product}
							/>
						))}
					</tbody>
				</table>
			</div>

			{/* Cart bottom section with shipping and summary */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 mt-4 bg-base-100">
				{/* Shipping Options */}
				<div className="card bg-base-200 shadow-xl w-full max-w-lg overflow-hidden rounded-lg">
					<div className="bg-primary text-primary-content p-4">
						<div className="flex justify-between items-center">
							<h2 className="text-xl font-bold">Shipping Options</h2>
							<Link to="/profile/edit" className="btn btn-sm btn-ghost">
								<FontAwesomeIcon icon={faEdit} className="mr-2" /> Update
								Profile info
							</Link>
						</div>
					</div>
					<div className="p-6">
						{/* Display non-shippable state error message with priority */}
						{isShippingAddressSet && !isShippableState ? (
							<div className="alert alert-error mb-4">
								<FontAwesomeIcon
									icon={faStopCircle}
									className="shrink-0 h-6 w-6"
								/>
								<div>
									<h3 className="font-bold">Shipping Unavailable</h3>
									<div className="text-sm">
										We currently don't ship to {currentShippingAddress.state}.
										Please select a different shipping address.
									</div>
								</div>
							</div>
						) : (
							// Only show free shipping banner if state is shippable
							hasShow && (
								<div className="alert alert-success mb-4">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="stroke-current shrink-0 h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
									<div>
										<h3 className="font-bold">Free Shipping!</h3>
										<div className="text-sm">
											Your cart contains a show package, so you get free
											shipping!
										</div>
									</div>
									<FontAwesomeIcon
										icon={faTheaterMasks}
										className="ml-auto h-6 w-6 shrink-0"
									/>
								</div>
							)
						)}

						<div className="form-control mb-4">
							<label className="flex items-center cursor-pointer gap-3">
								<input
									type="checkbox"
									className="checkbox checkbox-primary"
									checked={isTerminalDestination}
									onChange={(e) => {
										setIsTerminalDestination(e.target.checked);
										setNeedLiftGate(false);
										setTerminalDestination("");
									}}
								/>
								<span>Ship to terminal</span>
							</label>
						</div>

						{isTerminalDestination ? (
							<div className="space-y-3">
								<StateZipInput
									state={state}
									zipcode={zipcode}
									onStateChange={setState}
									onZipcodeChange={setZipcode}
								/>

								{(state || zipcode) && (
									<TerminalSelection
										state={state}
										zipcode={zipcode}
										terminalDestination={terminalDestination}
										onTerminalChange={setTerminalDestination}
									/>
								)}
							</div>
						) : (
							<div className="form-control mb-4">
								<label className="flex items-center cursor-pointer gap-3">
									<input
										type="checkbox"
										className="checkbox checkbox-primary"
										checked={needLiftGate}
										onChange={(e) => setNeedLiftGate(e.target.checked)}
										disabled={isTerminalDestination}
									/>
									<span>Need a liftgate? (+$100)</span>
								</label>
							</div>
						)}

						<div className="mt-4">
							<h4 className="font-medium mb-2">Shipping Address:</h4>
							{!isShippingAddressSet ? (
								<div className="p-3 bg-base-300 rounded text-warning">
									Please set your address or select a terminal
								</div>
							) : (
								<div className="p-3 bg-base-300 rounded">
									{currentShippingAddress && (
										<>
											<p>
												{currentShippingAddress.street1}
												{currentShippingAddress.street2 && (
													<span>
														<br />
														{currentShippingAddress.street2}
													</span>
												)}
											</p>
											<p>
												{currentShippingAddress.city},{" "}
												{currentShippingAddress.state}{" "}
												{currentShippingAddress.postalCode}
											</p>
										</>
									)}
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Order Summary */}
				<div className="card bg-base-200 shadow-xl w-full max-w-lg overflow-hidden rounded-lg">
					<div className="bg-primary text-primary-content p-4">
						<h3 className="text-lg font-semibold mb-4">Order Summary</h3>
					</div>
					<div className="p-6">
						<div className="space-y-3">
							<div className="flex justify-between items-center">
								<span>Subtotal:</span>
								<span className="font-medium">${subtotal.toFixed(2)}</span>
							</div>
							<div className="flex justify-between items-center">
								<span className="flex items-center gap-2">
									{orderType === "show" && (
										<>
											<FontAwesomeIcon
												icon={faTheaterMasks}
												className="text-success"
											/>
											<span>Show Package Shipping</span>
											<span className="badge badge-success badge-sm">FREE</span>
										</>
									)}
									{orderType === "apparelOnly" && (
										<>
											<span>🎽</span>
											<span>Apparel Shipping</span>
										</>
									)}
									{orderType === "retail" && (
										<>
											<FontAwesomeIcon icon={faShoppingBag} />
											<span>Retail Shipping</span>
										</>
									)}
									{orderType === "wholesale" && (
										<>
											<FontAwesomeIcon icon={faWarehouse} />
											<span>Wholesale Shipping</span>
										</>
									)}
									{orderType === "combo" && (
										<>
											<FontAwesomeIcon icon={faStore} />
											<span>Combo Shipping</span>
										</>
									)}
								</span>
								<span className="font-medium flex items-center">
									{shipping > 0 ? (
										`$${shipping.toFixed(2)}`
									) : (
										<>
											<span className="text-success font-bold">FREE</span>
											<FontAwesomeIcon
												icon={faTruck}
												className="ml-2 text-success"
											/>
										</>
									)}
								</span>
							</div>
							{/* Added Lift Gate Fee row */}
							{needLiftGate && (
								<div className="flex justify-between items-center">
									<span className="flex items-center gap-2">
										<span>Lift Gate Fee</span>
									</span>
									<span className="font-medium">${liftGateFee.toFixed(2)}</span>
								</div>
							)}

							{/* Tax row */}
							<div className="flex justify-between items-center">
								<span>
									Tax ({currentShippingAddress?.state || ""}):
									{/* If state doesn't allow shipping, show a badge */}
									{!isShippableState && currentShippingAddress && (
										<span className="badge badge-error badge-sm ml-2">
											Not Available
										</span>
									)}
								</span>
								<span className="font-medium">${tax.toFixed(2)}</span>
							</div>

							<div className="h-px bg-base-300 my-2"></div>

							<div className="flex justify-between items-center">
								<span className="text-lg font-bold">Total:</span>
								<span className="text-lg font-bold">
									${grandTotal.toFixed(2)}
								</span>
							</div>
						</div>
						<div className="mt-6">
							<HelcimPayButton
								cartId={user?.userInfo?.cart?.id}
								amounts={amounts}
								isUpdatingValues={isUpdatingValues}
								btnDisabled={
									(!isShippingAddressSet && !isUpdatingValues) ||
									!isShippableState ||
									!isToSAccepted
								}
								userId={user?.userInfo?.cart?.userId ?? ""}
								shippingAddressId={
									isShippingAddressSet ? currentShippingAddress?.id : ""
								}
							/>

							{!isShippingAddressSet && (
								<div className="mt-3 text-warning text-sm">
									Please update your shipping address in the user profile to
									proceed to checkout
								</div>
							)}
							{!isToSAccepted && (
								<div className="mt-3 text-warning text-sm">
									Please{" "}
									<button
										className="btn btn-sm btn-link"
										onClick={() => setIsTosModalOpen(true)}
									>
										click here
									</button>
									to accept the Terms of Service before checkout
								</div>
							)}

							{!isShippableState && (
								<div className="mt-3 text-error text-sm">
									We don't ship to {currentShippingAddress?.state}. Please
									choose a different shipping address.
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Cart;
