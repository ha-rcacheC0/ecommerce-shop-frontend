import { describe, expect, it, vi } from "vitest";
import {
	createMockApparelProduct,
	createMockCartProduct,
	createMockProduct,
	createMockShowProduct,
} from "@/test/mocks/handlers";
import { render, screen } from "@/test/utils/testUtils";
import type { TAddress, TCartProduct } from "../types";
import Cart from "./cart";

// Mock main.tsx to avoid DOM issues
vi.mock("../main", () => ({
	queryClient: {
		invalidateQueries: vi.fn(),
	},
}));

// Mock the auth provider
vi.mock("../providers/auth.provider", () => ({
	useAuth: () => ({
		user: {
			token: "test-token",
			userInfo: {
				profile: {
					userId: "test-user-id",
				},
				cart: {
					id: "test-cart-id",
					userId: "test-user-id",
				},
			},
		},
	}),
}));

// Mock the router
vi.mock("@tanstack/react-router", async (importOriginal) => {
	const actual = (await importOriginal()) as Record<string, unknown>;
	return {
		...actual,
		Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
			<a href={to}>{children}</a>
		),
		useNavigate: () => vi.fn(),
	};
});

// Helper to create test addresses
const createTestAddress = (overrides: Partial<TAddress> = {}): TAddress => ({
	id: "test-address-id",
	street1: "123 Main St",
	city: "Springfield",
	state: "IL",
	postalCode: "62701",
	...overrides,
});

describe("Cart Component", () => {
	describe("Empty Cart State", () => {
		const emptyAddress = createTestAddress();

		it("displays empty cart message when products array is empty", () => {
			const emptyProducts: TCartProduct[] = [];

			render(<Cart products={emptyProducts} shippingAddress={emptyAddress} />);

			expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
		});

		it("displays link to product catalog when cart is empty", () => {
			const emptyProducts: TCartProduct[] = [];

			render(<Cart products={emptyProducts} shippingAddress={emptyAddress} />);

			const link = screen.getByRole("link", { name: /go to product catalog/i });
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute("href", "/products");
		});

		it("does not display cart table when cart is empty", () => {
			const emptyProducts: TCartProduct[] = [];

			render(<Cart products={emptyProducts} shippingAddress={emptyAddress} />);

			expect(screen.queryByRole("table")).not.toBeInTheDocument();
		});

		it("does not display shipping options when cart is empty", () => {
			const emptyProducts: TCartProduct[] = [];

			render(<Cart products={emptyProducts} shippingAddress={emptyAddress} />);

			expect(screen.queryByText(/shipping options/i)).not.toBeInTheDocument();
		});

		it("does not display order summary when cart is empty", () => {
			const emptyProducts: TCartProduct[] = [];

			render(<Cart products={emptyProducts} shippingAddress={emptyAddress} />);

			expect(screen.queryByText(/order summary/i)).not.toBeInTheDocument();
		});
	});

	describe("Populated Cart State", () => {
		it("displays cart table when products are present", () => {
			const products = [createMockCartProduct() as TCartProduct];
			const address = createTestAddress();

			render(<Cart products={products} shippingAddress={address} />);

			expect(screen.getByRole("table")).toBeInTheDocument();
		});

		it("displays product information in cart table", () => {
			const products = [createMockCartProduct() as TCartProduct];
			const address = createTestAddress();

			render(<Cart products={products} shippingAddress={address} />);

			// Check table headers
			expect(screen.getByText("Product")).toBeInTheDocument();
			expect(screen.getByText("SKU")).toBeInTheDocument();
			expect(screen.getByText("Quantity")).toBeInTheDocument();
			expect(screen.getByText("Subtotal")).toBeInTheDocument();
			expect(screen.getByText("Remove")).toBeInTheDocument();
		});

		it("displays shipping options section", () => {
			const products = [createMockCartProduct() as TCartProduct];
			const address = createTestAddress();

			render(<Cart products={products} shippingAddress={address} />);

			expect(screen.getByText(/shipping options/i)).toBeInTheDocument();
		});

		it("displays order summary section", () => {
			const products = [createMockCartProduct() as TCartProduct];
			const address = createTestAddress();

			render(<Cart products={products} shippingAddress={address} />);

			expect(screen.getByText(/order summary/i)).toBeInTheDocument();
		});

		it("displays subtotal in order summary", () => {
			const products = [
				createMockCartProduct({
					caseQuantity: 2,
					unitQuantity: 0,
					product: createMockProduct({ casePrice: "50.00" }),
				}) as TCartProduct,
			];
			const address = createTestAddress();

			render(<Cart products={products} shippingAddress={address} />);

			// Subtotal should be 2 cases * $50 = $100
			expect(screen.getByText("Subtotal:")).toBeInTheDocument();
			// Price appears in cart item AND order summary, use getAllByText
			const priceElements = screen.getAllByText("$100.00");
			expect(priceElements.length).toBeGreaterThanOrEqual(1);
		});

		it("displays shipping address when set", () => {
			const products = [createMockCartProduct() as TCartProduct];
			const address = createTestAddress({
				street1: "456 Test Street",
				city: "Chicago",
				state: "IL",
				postalCode: "60601",
			});

			render(<Cart products={products} shippingAddress={address} />);

			expect(screen.getByText("456 Test Street")).toBeInTheDocument();
			expect(screen.getByText(/Chicago, IL 60601/)).toBeInTheDocument();
		});
	});

	describe("Show Package in Cart", () => {
		it("displays free shipping banner for show packages", () => {
			const showProduct = createMockShowProduct();
			const products = [
				createMockCartProduct({
					product: showProduct,
					productId: showProduct.id,
				}) as TCartProduct,
			];
			const address = createTestAddress();

			render(<Cart products={products} shippingAddress={address} />);

			// Multiple elements match "free shipping", check at least one exists
			const freeShippingElements = screen.getAllByText(/free shipping/i);
			expect(freeShippingElements.length).toBeGreaterThanOrEqual(1);
		});

		it("shows FREE shipping in order summary for shows", () => {
			const showProduct = createMockShowProduct();
			const products = [
				createMockCartProduct({
					product: showProduct,
					productId: showProduct.id,
				}) as TCartProduct,
			];
			const address = createTestAddress();

			render(<Cart products={products} shippingAddress={address} />);

			// Should show "Show Package Shipping" with FREE badge
			expect(screen.getByText(/show package shipping/i)).toBeInTheDocument();
		});
	});

	describe("Apparel Products in Cart", () => {
		it("calculates variant pricing correctly for apparel", () => {
			const apparelProduct = createMockApparelProduct() as ReturnType<
				typeof createMockApparelProduct
			> & {
				variants: Array<{
					id: string;
					sku: string;
					productId: string;
					size: string;
					gender: "UNISEX";
					colorId: string;
					color: { id: string; name: string };
					unitPrice: string;
					availableStock: number;
					isActive: boolean;
				}>;
			};
			const variant = apparelProduct.variants[0];
			const products = [
				createMockCartProduct({
					product: apparelProduct,
					productId: apparelProduct.id,
					caseQuantity: 0,
					unitQuantity: 2,
					variantId: variant.id,
					variant: variant,
				}) as TCartProduct,
			];
			const address = createTestAddress();

			render(<Cart products={products} shippingAddress={address} />);

			// 2 units * $25 = $50 subtotal
			// Price appears in cart item AND order summary, use getAllByText
			const priceElements = screen.getAllByText("$50.00");
			expect(priceElements.length).toBeGreaterThanOrEqual(1);
		});
	});

	describe("Shipping Options", () => {
		it("shows ship to terminal checkbox", () => {
			const products = [createMockCartProduct() as TCartProduct];
			const address = createTestAddress();

			render(<Cart products={products} shippingAddress={address} />);

			expect(screen.getByText(/ship to terminal/i)).toBeInTheDocument();
			expect(
				screen.getByRole("checkbox", { name: /ship to terminal/i }),
			).toBeInTheDocument();
		});

		it("shows liftgate option when not shipping to terminal", () => {
			const products = [createMockCartProduct() as TCartProduct];
			const address = createTestAddress();

			render(<Cart products={products} shippingAddress={address} />);

			expect(screen.getByText(/need a liftgate/i)).toBeInTheDocument();
		});

		it("shows update profile link in shipping section", () => {
			const products = [createMockCartProduct() as TCartProduct];
			const address = createTestAddress();

			render(<Cart products={products} shippingAddress={address} />);

			expect(
				screen.getByRole("link", { name: /update profile info/i }),
			).toBeInTheDocument();
		});
	});

	describe("Missing Shipping Address", () => {
		it("displays warning when shipping address is not set", () => {
			const products = [createMockCartProduct() as TCartProduct];
			// All values must be empty strings for isObjectEmpty to return true
			const emptyAddress = {
				id: "",
				street1: "",
				city: "",
				state: "" as TAddress["state"],
				postalCode: "",
			};

			render(<Cart products={products} shippingAddress={emptyAddress} />);

			expect(
				screen.getByText(/please set your address or select a terminal/i),
			).toBeInTheDocument();
		});

		it("shows checkout warning when address missing", () => {
			const products = [createMockCartProduct() as TCartProduct];
			// All values must be empty strings for isObjectEmpty to return true
			const emptyAddress = {
				id: "",
				street1: "",
				city: "",
				state: "" as TAddress["state"],
				postalCode: "",
			};

			render(<Cart products={products} shippingAddress={emptyAddress} />);

			expect(
				screen.getByText(/please update your shipping address/i),
			).toBeInTheDocument();
		});
	});

	describe("Order Summary Calculations", () => {
		it("displays tax row with state abbreviation", () => {
			const products = [createMockCartProduct() as TCartProduct];
			const address = createTestAddress({ state: "IL" });

			render(<Cart products={products} shippingAddress={address} />);

			expect(screen.getByText(/Tax \(IL\):/)).toBeInTheDocument();
		});

		it("displays total row", () => {
			const products = [createMockCartProduct() as TCartProduct];
			const address = createTestAddress();

			render(<Cart products={products} shippingAddress={address} />);

			expect(screen.getByText("Total:")).toBeInTheDocument();
		});

		it("calculates multiple products correctly", () => {
			const products = [
				createMockCartProduct({
					id: "cart-1",
					caseQuantity: 1,
					unitQuantity: 0,
					product: createMockProduct({ id: "prod-1", casePrice: "100.00" }),
				}) as TCartProduct,
				createMockCartProduct({
					id: "cart-2",
					productId: "prod-2",
					caseQuantity: 2,
					unitQuantity: 0,
					product: createMockProduct({ id: "prod-2", casePrice: "50.00" }),
				}) as TCartProduct,
			];
			const address = createTestAddress();

			render(<Cart products={products} shippingAddress={address} />);

			// $100 + (2 * $50) = $200 subtotal
			// Price appears in order summary
			const priceElements = screen.getAllByText("$200.00");
			expect(priceElements.length).toBeGreaterThanOrEqual(1);
		});
	});
});
