import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faX } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@tanstack/react-router";
import { TCartProduct, TProductSchema } from "../types";

const CartItem = ({ product }: { product: TCartProduct }) => {
  const { title, id, casePrice } = TProductSchema.parse(product.Product);

  return (
    <div className="grid grid-cols-5 gap-4 items-center p-4 border-b">
      <div className="col-span-2">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-400">SKU: {id}</div>
      </div>
      <div className="text-center text-lg font-semibold">
        Case Price: ${casePrice.toFixed(2)}
      </div>
      <div className="text-center font-semibold">Qty: {product.quantity}</div>
      <div className="text-center text-lg font-semibold">
        SubTotal: ${(casePrice * product.quantity).toFixed(2)}
      </div>
      <button className="btn btn-error btn-outline col-start-6 justify-self-center">
        <FontAwesomeIcon icon={faX} />
      </button>
    </div>
  );
};

const Cart = ({ products }: { products: TCartProduct[] }) => {
  const subtotal = products.reduce((acc, elm) => {
    const parsed = TProductSchema.parse(elm.Product);
    return acc + parsed.casePrice * elm.quantity;
  }, 0);

  return (
    <div className="card bg-white shadow-xl mx-auto p-6 text-gray-800  ">
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
