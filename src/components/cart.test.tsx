import { describe, expect, it, vi } from "vitest";
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

describe("Cart Component", () => {
	describe("Empty Cart State", () => {
		const emptyAddress: TAddress = {
			id: "test-address-id",
			street1: "123 Main St",
			city: "Springfield",
			state: "IL",
			postalCode: "62701",
		};

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
});
