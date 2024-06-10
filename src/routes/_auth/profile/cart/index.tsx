import { createFileRoute } from "@tanstack/react-router";
import Cart from "../../../../components/cart";

export const Route = createFileRoute("/_auth/profile/cart/")({
  component: CartPage,
});

function CartPage() {
  const items = [
    { name: "Product 1", sku: "12345", price: 29.99 },
    { name: "Product 2", sku: "67890", price: 59.99 },
    { name: "Product 2", sku: "67890", price: 59.99 },
    { name: "Product 2", sku: "67890", price: 59.99 },
    { name: "Product 2", sku: "67890", price: 59.99 },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const shipping = 5.99;
  const grandTotal = subtotal + shipping;
  return (
    <div className="p-8">
      <Cart
        items={items}
        subtotal={subtotal}
        shipping={shipping}
        grandTotal={grandTotal}
      />
    </div>
  );
}
