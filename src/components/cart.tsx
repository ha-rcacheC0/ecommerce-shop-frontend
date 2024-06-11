import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faX } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@tanstack/react-router";
type TItem = { name: string; sku: string; price: number };

const CartItem = ({ name, sku, price }: TItem) => (
  <div className="flex justify-between items-center p-4 space-x-2 border-b">
    <div>
      <div className="font-semibold">{name}</div>
      <div className="text-sm text-gray-400">SKU: {sku}</div>
    </div>
    <div className="text-lg font-semibold">${price.toFixed(2)}</div>
    <button className="btn btn-error btn-outline">
      <FontAwesomeIcon icon={faX} />
    </button>
  </div>
);

const Cart = ({
  items,
  subtotal,
  shipping,
  grandTotal,
}: {
  items: TItem[];
  subtotal: number;
  shipping: number;
  grandTotal: number;
}) => (
  <div className="card bg-white shadow-xl  mx-auto p-6 text-gray-800  ">
    <h2 className="text-2xl text-center font-bold">Shopping Cart</h2>
    <div className="space-y-4 ">
      {items.map((item, index) => (
        <CartItem
          key={index}
          name={item.name}
          sku={item.sku}
          price={item.price}
        />
      ))}
    </div>
    <div className="divider"></div>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="font-semibold">Subtotal:</span>
        <span className="font-semibold">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span className="font-semibold">Shipping:</span>
        <span className="font-semibold">${shipping.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-xl font-bold">
        <span>Grand Total:</span>
        <span>${grandTotal.toFixed(2)}</span>
      </div>
    </div>
    <div className="mt-4">
      <Link to="/" className="btn btn-primary btn-block">
        Checkout <FontAwesomeIcon icon={faShoppingCart} />
      </Link>
    </div>
  </div>
);

export default Cart;
