import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@tanstack/react-router";
import { TCartProduct, TProductSchema } from "../types";
import CartItem from "./component-parts/cart-item";

const Cart = ({ products }: { products: TCartProduct[] }) => {
  const subtotal = products.reduce((acc, elm) => {
    const parsed = TProductSchema.parse(elm.Product);
    return acc + parsed.casePrice * elm.quantity;
  }, 0);

  return (
    <div className="card bg-white shadow-xl mx-auto p-6 text-gray-800">
      <h2 className="text-2xl text-center font-bold">Shopping Cart</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full mt-4 ">
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
          <tbody className="p-2">
            {products.map((product, index) => (
              <CartItem key={index} product={product} />
            ))}
          </tbody>
          <tfoot className="border-t border-gray-600">
            <tr className="h-12">
              <td colSpan={6} className="py-4"></td>
            </tr>
            <tr className="h-12 border-b border-gray-300">
              <td colSpan={4}></td>
              <td className="text-right font-semibold">Subtotal:</td>
              <td className="text-lg font-semibold">${subtotal.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-4 text-center">
        <Link to="/" className="btn btn-primary">
          Checkout <FontAwesomeIcon icon={faShoppingCart} />
        </Link>
      </div>
    </div>
  );
};

export default Cart;
