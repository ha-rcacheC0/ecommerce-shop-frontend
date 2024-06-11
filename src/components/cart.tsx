import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faX } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@tanstack/react-router";
import { TProduct, TProductSchema } from "../types";

const CartItem = ({ product }: { product: TProduct }) => {
  const { title, id, casePrice } = TProductSchema.parse(product);

  return (
    <div className="flex justify-between items-center p-4 space-x-2 border-b">
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-400">SKU: {id}</div>
      </div>
      <div className="text-lg font-semibold">${casePrice.toFixed(2)}</div>
      <button className="btn btn-error btn-outline">
        <FontAwesomeIcon icon={faX} />
      </button>
    </div>
  );
};

const Cart = ({ products }: { products: TProduct[] }) => {
  const subtotal = products.reduce((acc, elm) => {
    const parsed = TProductSchema.parse(elm);
    return acc + parsed.casePrice;
  }, 0);

  return (
    <div className="card bg-white shadow-xl  mx-auto p-6 text-gray-800  ">
      <h2 className="text-2xl text-center font-bold">Shopping Cart</h2>
      <div className="space-y-4 ">
        {products.map((product, index) => (
          <CartItem key={index} product={product} />
        ))}
      </div>
      <div className="divider"></div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="font-semibold">Subtotal:</span>
          <span className="font-semibold">${subtotal.toFixed(2)}</span>
        </div>
      </div>
      <div className="mt-4">
        <Link to="/" className="btn btn-primary btn-block">
          Checkout <FontAwesomeIcon icon={faShoppingCart} />
        </Link>
      </div>
    </div>
  );
};

export default Cart;
