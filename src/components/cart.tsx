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
    const parsed = TProductSchema.parse(elm.Product);

    const productCaseSubtotal = parseFloat(parsed.casePrice) * elm.caseQuantity;
    const productUnitSubtotal =
      parseFloat(parsed.UnitProduct?.unitPrice || "0") * elm.unitQuantity;

    caseSubtotal += productCaseSubtotal;
    unitSubtotal += productUnitSubtotal;

    return acc + productCaseSubtotal + productUnitSubtotal;
  }, 0);

  const orderType = checkOrderType(caseSubtotal, unitSubtotal);

  const grandTotal = subtotal + shipping;

  useEffect(() => {
    const newShipping = calculateShipping({
      orderAmount: subtotal,
      orderType: orderType,
      destination: isTerminalDestination ? "terminal" : "anywhere",
      needLiftGate,
    });
    setShipping(newShipping);
  }, [
    subtotal,
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
    if (isTerminalDestination && terminalData) {
      setCurrentShippingAddress({
        id: terminalData.Address.id,
        street1: terminalData.Address.street1,
        street2: terminalData.Address.street2 || "",
        city: terminalData.Address.city,
        state: terminalData.Address.state,
        postalCode: terminalData.Address.postalCode,
      });
    } else if (!isTerminalDestination) {
      // When switching from terminal to user address
      setCurrentShippingAddress(
        isObjectEmpty(shippingAddress) ? undefined : shippingAddress
      );
    }
  }, [isTerminalDestination, terminalData, shippingAddress]);

  const isShippingAddressSet =
    currentShippingAddress && !isObjectEmpty(currentShippingAddress);

  if (products.length === 0) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-4">Add some items to your cart to get started.</p>
        <Link
          to="/products"
          className="mt-4 inline-block text-blue-500 underline"
        >
          Go to Product Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="card bg-white shadow-xl mx-auto p-6 text-gray-800">
      <h2 className="text-2xl text-center font-bold">Shopping Cart</h2>

      <div className="overflow-x-auto mx-4 ">
        <table className="table-auto w-full border-b-2">
          <thead>
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">Case Price</th>
              <th className="px-4 py-2">Case Quantity</th>
              <th className="px-4 py-2">Unit Price</th>
              <th className="px-4 py-2">Unit Quantity</th>
              <th className="px-4 py-2">Subtotal</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="p-6">
            {products.map((product, index) => (
              <CartItem key={index} product={product} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-4 justify-around ">
        <div className="w-1/2 bg-neutral-200 p-4 rounded-md text-center">
          <div>
            <h3 className="text-lg font-semibold">Shipping Address:</h3>
            {!isShippingAddressSet ? (
              <>
                <p>Please set your Address or Select a Terminal to ship to</p>
              </>
            ) : (
              <>
                <p>{currentShippingAddress!.street1}</p>
                <p>{currentShippingAddress!.street2}</p>
                <p>
                  {currentShippingAddress!.city},{" "}
                  {currentShippingAddress!.state}
                </p>
                <p>{currentShippingAddress!.postalCode}</p>
              </>
            )}
          </div>
          <div className="mt-4 flex flex-col items-start gap-2">
            <label className="ml-4">
              <input
                type="checkbox"
                checked={isTerminalDestination}
                className="mr-2"
                onChange={(e) => {
                  setIsTerminalDestination(e.target.checked);
                  setTerminalDestination(""); // Reset terminal destination if unchecked
                }}
              />
              Ship to terminal
            </label>

            {isTerminalDestination && (
              <>
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
              </>
            )}
            <label className="ml-4">
              <input
                type="checkbox"
                checked={needLiftGate}
                className="mr-2"
                onChange={(e) => setNeedLiftGate(e.target.checked)}
              />
              Need lift gate
            </label>
          </div>
        </div>

        <table className="table-auto w-full">
          <tfoot className="">
            <tr className="h-12 border-b border-gray-300 ">
              <td className="text-right font-semibold">Subtotal: </td>
              <td className="text-lg font-semibold">${subtotal.toFixed(2)}</td>
            </tr>
            <tr className="h-12 ">
              <td className="text-right font-semibold">
                {" "}
                {orderType} Shipping:{" "}
              </td>
              <td className="text-lg font-semibold">${shipping.toFixed(2)}</td>
            </tr>
            <tr className="h-12 border-y-4 border-double border-black ">
              <td className="text-right font-bold">Grand Total: </td>
              <td className="text-lg font-bold">${grandTotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 text-center flex flex-col gap-4 justify-center items-center">
        <HelcimPayButton
          cartId={user!.userInfo!.Cart.id}
          amount={grandTotal}
          btnDisabled={!isShippingAddressSet}
          userId={user!.userInfo!.Cart.userId!}
          shippingAddressId={
            isShippingAddressSet ? currentShippingAddress!.id : ""
          }
        />
        {!isShippingAddressSet && (
          <div role="alert" className=" alert alert-warning">
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
