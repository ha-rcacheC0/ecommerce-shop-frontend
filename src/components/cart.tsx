import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { TAddress, TApprovedTerminal, TCartProduct } from "../types";
import { calculateShipping, checkOrderType } from "../utils/utils";
import CartItem from "./component-parts/cart-item";
import HelcimPayButton from "./component-parts/helcimPayButton";
import { isObjectEmpty } from "../utils/validationUtils";
import { useAuth } from "../providers/auth.provider";
import StateZipInput from "./component-parts/state-zip-input";
import TerminalSelection from "./component-parts/terminal-selection";
import { getOneTerminalQueryOptions } from "../api/terminals/terminalQueries";

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
  const [currentShippingAddress, setCurrentShippingAddress] = useState<
    TAddress | undefined
  >(shippingAddress);
  const [terminalDestination, setTerminalDestination] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const { user } = useAuth();
  let caseSubtotal = 0;
  let unitSubtotal = 0;

  const subtotal = products.reduce((acc, elm) => {
    const productCaseSubtotal =
      parseFloat(elm.product.casePrice) * elm.caseQuantity;
    const productUnitSubtotal =
      parseFloat(elm.product.unitProduct?.unitPrice || "0") * elm.unitQuantity;

    caseSubtotal += productCaseSubtotal;
    unitSubtotal += productUnitSubtotal;

    return acc + productCaseSubtotal + productUnitSubtotal;
  }, 0);

  const orderType = checkOrderType(caseSubtotal, unitSubtotal);

  const grandTotal = subtotal + shipping;

  useEffect(() => {
    setIsUpdatingValues(true);
    const newShipping = calculateShipping({
      orderAmount: subtotal,
      orderType: orderType,
      destination: isTerminalDestination ? "terminal" : "anywhere",
      needLiftGate,
    });
    setShipping(newShipping);
    setIsUpdatingValues(false);
  }, [
    subtotal,
    shipping,
    isTerminalDestination,
    needLiftGate,
    orderType,
    terminalDestination,
  ]);

  const { data: terminalData }: { data: TApprovedTerminal | undefined } =
    useQuery(
      getOneTerminalQueryOptions({
        id: terminalDestination,
        isTerminalDest: !!terminalDestination,
      })
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
        isObjectEmpty(shippingAddress) ? undefined : shippingAddress
      );
    }
    setIsUpdatingValues(false);
  }, [isTerminalDestination, terminalData, shippingAddress]);

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
        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Shipping Options</h3>

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

        {/* Order Summary */}
        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>{orderType} Shipping:</span>
              <span className="font-medium">${shipping.toFixed(2)}</span>
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
              cartId={user!.userInfo!.Cart.id}
              amount={grandTotal}
              btnDisabled={!isShippingAddressSet && !isUpdatingValues}
              userId={user!.userInfo!.Cart.userId!}
              shippingAddressId={
                isShippingAddressSet ? currentShippingAddress!.id : ""
              }
            />

            {!isShippingAddressSet && (
              <div className="mt-3 text-warning text-sm">
                Please update your shipping address to proceed to checkout
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
