import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  TAddress,
  TApprovedTerminal,
  TCartProduct,
  TProductSchema,
} from "../types";
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
    const parsed = TProductSchema.parse(elm.product);

    const productCaseSubtotal = parseFloat(parsed.casePrice) * elm.caseQuantity;
    const productUnitSubtotal =
      parseFloat(parsed.unitProduct?.unitPrice || "0") * elm.unitQuantity;

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
      <div className="text-center mt-10 p-4">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-4">Add some items to your cart to get started.</p>
        <Link
          to="/products"
          search={{ page: 1, pageSize: 25 }}
          className="mt-4 inline-block text-blue-500 underline"
        >
          Go to Product Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl mx-auto p-4 md:p-6 text-base-content">
      <h2 className="text-2xl text-center font-bold mb-4">Shopping Cart</h2>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-b-2 mb-4">
          <thead className="hidden md:table-header-group">
            <tr>
              <th className="px-2 py-2">Product</th>
              <th className="px-2 py-2">SKU</th>
              <th className="px-2 py-2">Case Price</th>
              <th className="px-2 py-2">Case Qty</th>
              <th className="px-2 py-2">Unit Price</th>
              <th className="px-2 py-2">Unit Qty</th>
              <th className="px-2 py-2">Subtotal</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <CartItem key={index} product={product} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col md:flex-row items-start md:items-center gap-4 justify-around">
        <div className="w-full md:w-1/2 bg-base-300 p-4 rounded-md text-center">
          <div>
            <h3 className="text-lg font-semibold ">Shipping Address:</h3>
            {!isShippingAddressSet ? (
              <p>Please set your Address or Select a Terminal to ship to</p>
            ) : (
              <>
                <p className="text-base-content">
                  {currentShippingAddress!.street1}
                </p>
                <p className="text-base-content">
                  {currentShippingAddress!.street2}
                </p>
                <p className="text-base-content">
                  {currentShippingAddress!.city},{" "}
                  {currentShippingAddress!.state}
                </p>
                <p className="text-base-content">
                  {currentShippingAddress!.postalCode}
                </p>
              </>
            )}
          </div>
          <div className="mt-4 flex flex-col items-start gap-2">
            <label className="flex items-center text-base-content">
              <input
                type="checkbox"
                checked={isTerminalDestination}
                className="mr-2"
                onChange={(e) => {
                  setIsTerminalDestination(e.target.checked);
                  setNeedLiftGate(false);
                  setTerminalDestination("");
                }}
              />
              Ship to terminal
            </label>

            {isTerminalDestination && (
              <div className="items-center flex max-md:flex-col gap-4">
                <StateZipInput
                  state={state}
                  zipcode={zipcode}
                  onStateChange={setState}
                  onZipcodeChange={setZipcode}
                />
                <TerminalSelection
                  state={state}
                  zipcode={zipcode}
                  terminalDestination={terminalDestination}
                  onTerminalChange={setTerminalDestination}
                />
              </div>
            )}

            {!isTerminalDestination && (
              <label className={`flex items-center text-base-content`}>
                <input
                  type="checkbox"
                  checked={needLiftGate}
                  className="mr-2"
                  onChange={(e) => setNeedLiftGate(e.target.checked)}
                  disabled={isTerminalDestination}
                />
                Need a liftgate? + $100 shipping.
              </label>
            )}
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <table className="table-auto w-full">
            <tfoot>
              <tr className="h-12 border-b border-base-300">
                <td className="text-right font-semibold">Subtotal:</td>
                <td className="text-lg font-semibold">
                  ${subtotal.toFixed(2)}
                </td>
              </tr>
              <tr className="h-12">
                <td className="text-right font-semibold">
                  {orderType} Shipping:
                </td>
                <td className="text-lg font-semibold">
                  ${shipping.toFixed(2)}
                </td>
              </tr>
              <tr className="h-12 border-y-4 border-double border-base-300">
                <td className="text-right font-bold">Grand Total:</td>
                <td className="text-lg font-bold">${grandTotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="mt-4 text-center flex flex-col gap-4 justify-center items-center">
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
          <div role="alert" className="alert alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>
              Warning: Please update your shipping address to continue to
              Checkout
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
