import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { TAddress, TApprovedTerminal, TCartProduct } from "../types";
import {
  calculateShipping,
  checkOrderType,
  calculateStateTax,
} from "../utils/utils";
import CartItem from "./component-parts/cart-item";
import HelcimPayButton from "./component-parts/helcimPayButton";
import { isObjectEmpty, validateAddress } from "../utils/validationUtils";
import { useAuth } from "../providers/auth.provider";
import StateZipInput from "./component-parts/state-zip-input";
import TerminalSelection from "./component-parts/terminal-selection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faShoppingBag,
  faStore,
  faStopCircle,
  faTheaterMasks,
  faTruck,
  faWarehouse,
  faTShirt,
} from "@fortawesome/free-solid-svg-icons";
import { getOneTerminalQueryOptions } from "../api/terminals/terminalQueries";
import TosModal from "./component-parts/tos-Modal";
import {
  userInfoQueryOptions,
  useUserInfoPostMutation,
} from "../api/users/userQueryOptions.api";

const Cart = ({
  products,
  shippingAddress,
}: {
  products: TCartProduct[];
  shippingAddress: TAddress;
}) => {
  const [isTerminalDestination, setIsTerminalDestination] = useState(false);
  const [needLiftGate, setNeedLiftGate] = useState(false);
  const [isShippableState, setIsShippableState] = useState(true);
  const [currentShippingAddress, setCurrentShippingAddress] = useState<
    TAddress | undefined
  >(shippingAddress);
  const [terminalDestination, setTerminalDestination] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [isTosModalOpen, setIsTosModalOpen] = useState(false);
  const [isCartUpdating, setIsCartUpdating] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();

  // Track cart updates with debouncing
  useEffect(() => {
    setIsCartUpdating(true);

    // Clear existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Set new timeout to mark cart as stable after 1 second of no changes
    updateTimeoutRef.current = setTimeout(() => {
      setIsCartUpdating(false);
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [products]); // Trigger when products array changes

  const { data: userProfile } = useQuery(userInfoQueryOptions(user!.token!));
  const { mutate } = useUserInfoPostMutation(
    user!.token!,
    () => {
      setIsTosModalOpen(false);
    },
    (error) => {
      console.error("Error updating user info:", error);
    }
  );

  // Calculate all values using useMemo for better performance and consistency
  const calculations = useMemo(() => {
    let caseSubtotal = 0;
    let unitSubtotal = 0;
    let _apparelSubtotal = 0;

    const subtotal = products.reduce((acc, elm) => {
      if (elm.product.isApparel) {
        const itemSubtotal =
          parseFloat(elm.variant?.unitPrice || "0") * elm.unitQuantity;
        _apparelSubtotal += itemSubtotal;
        return acc + itemSubtotal;
      } else {
        const itemCaseSubtotal =
          parseFloat(elm.product.casePrice) * elm.caseQuantity;
        const itemUnitSubtotal =
          parseFloat(elm.product.unitProduct?.unitPrice || "0") *
          elm.unitQuantity;
        const itemSubtotal = itemCaseSubtotal + itemUnitSubtotal;

        caseSubtotal += itemCaseSubtotal;
        unitSubtotal += itemUnitSubtotal;

        return acc + itemSubtotal;
      }
    }, 0);

    const hasShow = !!products.find((elm) => elm.product.isShow);
    const onlyApparel = !!products.every((elm) => elm.product.isApparel);

    const orderType = checkOrderType(
      caseSubtotal,
      unitSubtotal,
      hasShow,
      onlyApparel
    );

    // Calculate shipping
    const shipping = calculateShipping({
      orderAmount: subtotal,
      orderType: orderType,
      destination: isTerminalDestination ? "terminal" : "anywhere",
      needLiftGate: false,
    });

    // Calculate tax
    let tax = 0;
    let shippableState = true;

    if (currentShippingAddress && !isObjectEmpty(currentShippingAddress)) {
      try {
        tax = calculateStateTax(currentShippingAddress.state, subtotal);
        shippableState = true;
      } catch (error) {
        if (error instanceof Error && error.message.includes("don't ship")) {
          shippableState = false;
          tax = 0;
        } else {
          console.error("Tax calculation error:", error);
          tax = 0;
        }
      }
    }

    const liftGateFee = needLiftGate ? 100 : 0;
    const grandTotal = subtotal + shipping + tax + liftGateFee;

    return {
      subtotal,
      shipping,
      tax,
      liftGateFee,
      grandTotal,
      orderType,
      hasShow,
      shippableState,
      caseSubtotal,
      unitSubtotal,
    };
  }, [products, isTerminalDestination, needLiftGate, currentShippingAddress]);

  // Update isShippableState when calculations change
  useEffect(() => {
    setIsShippableState(calculations.shippableState);
  }, [calculations.shippableState]);

  const { data: terminalData }: { data: TApprovedTerminal | undefined } =
    useQuery(
      getOneTerminalQueryOptions({
        id: terminalDestination,
        isTerminalDest: !!terminalDestination,
      })
    );

  useEffect(() => {
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
      setCurrentShippingAddress(
        isObjectEmpty(shippingAddress) ? undefined : shippingAddress
      );
    }
  }, [isTerminalDestination, terminalData, shippingAddress]);

  const isToSAccepted = userProfile?.acceptedTerms || false;

  const handleTosAccept = async () => {
    try {
      mutate({
        token: user!.token!,
        body: { userId: user!.userInfo!.profile!.userId, acceptedTerms: true },
      });
    } catch (error) {
      console.error("Failed to update TOS acceptance:", error);
    }
  };

  const getCheckoutValidation = (
    currentShippingAddress: TAddress | undefined,
    isShippableState: boolean,
    isToSAccepted: boolean,
    isCartUpdating: boolean
  ) => {
    const addressValidation = validateAddress(currentShippingAddress);

    const conditions = {
      hasValidAddress: addressValidation.isComplete,
      canShipToState: isShippableState,
      hasAcceptedTerms: isToSAccepted,
      cartNotUpdating: !isCartUpdating,
    };

    const canCheckout = Object.values(conditions).every(Boolean);

    return { canCheckout, conditions, addressValidation };
  };

  const addressValidation = validateAddress(currentShippingAddress);
  const isShippingAddressSet = addressValidation.isComplete;
  const validation = getCheckoutValidation(
    currentShippingAddress,
    isShippableState,
    isToSAccepted,
    isCartUpdating
  );

  // Create amounts object for HelcimPayButton
  const amounts = {
    subtotal: calculations.subtotal,
    tax: calculations.tax,
    liftGateFee: calculations.liftGateFee,
    shipping: calculations.shipping,
    grandTotal: calculations.grandTotal,
  };

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
              <CartItem key={index} product={product} />
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
                    We currently don't ship to {currentShippingAddress!.state}.
                    Please select a different shipping address.
                  </div>
                </div>
              </div>
            ) : (
              // Only show free shipping banner if state is shippable
              calculations.hasShow && (
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
                  <p>
                    {currentShippingAddress!.street1}
                    {currentShippingAddress!.street2 && (
                      <span>
                        <br />
                        {currentShippingAddress!.street2}
                      </span>
                    )}
                  </p>
                  <p>
                    {currentShippingAddress!.city},{" "}
                    {currentShippingAddress!.state}{" "}
                    {currentShippingAddress!.postalCode}
                  </p>
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
                <span className="font-medium">
                  ${calculations.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  {calculations.orderType === "show" && (
                    <>
                      <FontAwesomeIcon
                        icon={faTheaterMasks}
                        className="text-success"
                      />
                      <span>Show Package Shipping</span>
                      <span className="badge badge-success badge-sm">FREE</span>
                    </>
                  )}
                  {calculations.orderType === "retail" && (
                    <>
                      <FontAwesomeIcon icon={faShoppingBag} />
                      <span>Retail Shipping</span>
                    </>
                  )}
                  {calculations.orderType === "wholesale" && (
                    <>
                      <FontAwesomeIcon icon={faWarehouse} />
                      <span>Wholesale Shipping</span>
                    </>
                  )}
                  {calculations.orderType === "combo" && (
                    <>
                      <FontAwesomeIcon icon={faStore} />
                      <span>Combo Shipping</span>
                    </>
                  )}
                  {calculations.orderType === "apparelOnly" && (
                    <>
                      <FontAwesomeIcon icon={faTShirt} />
                      <span>Apparel Shipping</span>
                    </>
                  )}
                </span>
                <span className="font-medium flex items-center">
                  {calculations.shipping > 0 ? (
                    `$${calculations.shipping.toFixed(2)}`
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
                  <span className="font-medium">
                    ${calculations.liftGateFee.toFixed(2)}
                  </span>
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
                <span className="font-medium">
                  ${calculations.tax.toFixed(2)}
                </span>
              </div>

              <div className="h-px bg-base-300 my-2"></div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold">
                  ${calculations.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <HelcimPayButton
                cartId={user!.userInfo!.Cart!.id}
                amounts={amounts}
                btnDisabled={!validation.canCheckout}
                userId={user!.userInfo!.Cart!.userId!}
                shippingAddressId={
                  isShippingAddressSet ? currentShippingAddress!.id : ""
                }
                isCartUpdating={isCartUpdating}
              />

              {isCartUpdating && (
                <div className="mt-3 text-info text-sm">
                  Updating cart totals...
                </div>
              )}

              {!isShippingAddressSet && !addressValidation.isEmpty && (
                <div className="mt-3 text-warning text-sm">
                  {addressValidation.message ||
                    "Please complete your shipping address"}
                </div>
              )}

              {addressValidation.isEmpty && (
                <div className="mt-3 text-warning text-sm">
                  Please set your shipping address in the user profile to
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
