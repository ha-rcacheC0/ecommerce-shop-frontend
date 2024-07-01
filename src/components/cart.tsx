import { Link } from "@tanstack/react-router";
import { TAddress, TCartProduct, TProductSchema } from "../types";
import { calculateShipping } from "../utils/utils";
import CartItem from "./component-parts/cart-item";
import HelcimPayButton from "./component-parts/helcimPayButton";
import { useEffect, useState } from "react";

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

  const subtotal = products.reduce((acc, elm) => {
    const parsed = TProductSchema.parse(elm.Product);
    return acc + parseFloat(parsed.casePrice) * elm.quantity;
  }, 0);

  useEffect(() => {
    const newShipping = calculateShipping({
      orderAmount: subtotal,
      orderType: "retail",
      destination: isTerminalDestination ? "terminal" : "anywhere",
      needLiftGate,
    });
    setShipping(newShipping);
  }, [subtotal, isTerminalDestination, needLiftGate]);

  const grandTotal = subtotal + shipping;

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
              <th className="px-4 py-2">Quantity</th>
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
        <div className="w-1/2 bg-neutral-200 p-4 rounded-md text-center  ">
          <div>
            <h3 className="text-lg font-semibold">Shipping Address:</h3>
            <p>{shippingAddress.street1}</p>
            <p>{shippingAddress.street2}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.state}
            </p>
            <p>{shippingAddress.postalCode}</p>
          </div>
          <div className="mt-4 flex flex-col items-start gap-2">
            <label className="ml-4">
              <input
                type="checkbox"
                checked={isTerminalDestination}
                className="mr-2"
                onChange={(e) => setIsTerminalDestination(e.target.checked)}
              />
              Ship to terminal
            </label>
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
              <td className="text-lg  font-semibold">${subtotal.toFixed(2)}</td>
            </tr>
            <tr className="h-12 ">
              <td className="text-right font-semibold">Shipping: </td>
              <td className="text-lg   font-semibold">
                ${shipping.toFixed(2)}
              </td>
            </tr>
            <tr className="h-12 border-y-4 border-double border-black ">
              <td className="text-right font-bold">Grand Total: </td>
              <td className="text-lg   font-bold">${grandTotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 text-center">
        <HelcimPayButton cartId={products[0].cartId} amount={grandTotal} />
      </div>
    </div>
  );
};

export default Cart;
