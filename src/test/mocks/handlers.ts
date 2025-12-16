import { HttpResponse, http } from "msw";

const API_BASE_URL = "http://localhost:4000/api";

// Mock data factories for reusable test data
export const createMockProduct = (overrides = {}) => ({
	id: "product-1",
	sku: "FW-001",
	title: "Test Firework Product",
	description: "A test firework product",
	image: "https://example.com/image.jpg",
	casePrice: "100.00",
	isCaseBreakable: true,
	inStock: true,
	package: [4, 1],
	brandId: "brand-1",
	categoryId: "cat-1",
	brand: { id: "brand-1", name: "Test Brand" },
	category: { id: "cat-1", name: "Test Category" },
	colors: [{ id: "color-1", name: "Red" }],
	effects: [{ id: "effect-1", name: "Crackles" }],
	unitProduct: {
		id: "unit-1",
		sku: "FW-001-U",
		productId: "product-1",
		unitPrice: "30.00",
		package: [1, 1],
		availableStock: 100,
	},
	isShow: false,
	isApparel: false,
	...overrides,
});

export const createMockCartProduct = (overrides = {}) => ({
	id: "cart-product-1",
	caseQuantity: 1,
	unitQuantity: 0,
	cartId: "test-cart-id",
	productId: "product-1",
	variantId: null,
	variant: null,
	product: createMockProduct(),
	...overrides,
});

export const createMockApparelProduct = (overrides = {}) =>
	createMockProduct({
		id: "apparel-1",
		sku: "APP-001",
		title: "Test T-Shirt",
		description: "A test apparel product",
		casePrice: "0",
		isApparel: true,
		isCaseBreakable: false,
		package: [1, 1],
		unitProduct: null,
		variants: [
			{
				id: "variant-1",
				sku: "APP-001-M-BLK",
				productId: "apparel-1",
				size: "M",
				gender: "UNISEX" as const,
				colorId: "color-black",
				color: { id: "color-black", name: "Black" },
				unitPrice: "25.00",
				availableStock: 50,
				isActive: true,
			},
		],
		...overrides,
	});

export const createMockShowProduct = (overrides = {}) =>
	createMockProduct({
		id: "show-1",
		sku: "SHOW-001",
		title: "Test Show Package",
		description: "A test show package",
		casePrice: "500.00",
		isShow: true,
		isCaseBreakable: false,
		package: [1, 1],
		showTypeId: "show-type-1",
		showType: { id: "show-type-1", name: "Family Show", description: null },
		showProducts: [
			{
				id: "show-product-1",
				showId: "show-1",
				productId: "product-1",
				quantity: 5,
				notes: null,
				isUnit: false,
				product: createMockProduct(),
			},
		],
		...overrides,
	});

export const createMockTerminal = (overrides = {}) => ({
	id: "terminal-1",
	acceptOutOfStateLicence: true,
	terminalName: "FedEx Terminal Springfield",
	businessRequired: false,
	addressId: "terminal-addr-1",
	company: "FEDEX",
	address: {
		id: "terminal-addr-1",
		street1: "456 Terminal Road",
		street2: null,
		city: "Springfield",
		state: "IL",
		postalCode: "62702",
	},
	...overrides,
});

export const handlers = [
	// Cart endpoints
	http.get(`${API_BASE_URL}/cart/:cartId`, () => {
		return HttpResponse.json({
			id: "test-cart-id",
			userId: "test-user-id",
			cartProducts: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
	}),

	// User profile endpoints - userInfo endpoint
	http.get(`${API_BASE_URL}/user/userInfo`, () => {
		return HttpResponse.json({
			id: "test-profile-id",
			userId: "test-user-id",
			firstName: "Test",
			lastName: "User",
			email: "test@example.com",
			phoneNumber: "555-1234",
			acceptedTerms: true,
			billingAddress: {
				id: "test-billing-id",
				street1: "123 Billing St",
				city: "Springfield",
				state: "IL",
				postalCode: "62701",
			},
			shippingAddress: {
				id: "test-shipping-id",
				street1: "123 Shipping St",
				city: "Springfield",
				state: "IL",
				postalCode: "62701",
			},
		});
	}),

	// Legacy user-profile endpoint
	http.get(`${API_BASE_URL}/user-profile`, () => {
		return HttpResponse.json({
			id: "test-profile-id",
			userId: "test-user-id",
			firstName: "Test",
			lastName: "User",
			email: "test@example.com",
			phone: "555-1234",
			addresses: [],
		});
	}),

	// Terminal endpoints
	http.get(`${API_BASE_URL}/terminals`, () => {
		return HttpResponse.json([
			createMockTerminal(),
			createMockTerminal({
				id: "terminal-2",
				terminalName: "FedEx Terminal Chicago",
				address: {
					id: "terminal-addr-2",
					street1: "789 Terminal Ave",
					street2: null,
					city: "Chicago",
					state: "IL",
					postalCode: "60601",
				},
			}),
		]);
	}),

	http.get(`${API_BASE_URL}/terminals/:terminalId`, ({ params }) => {
		return HttpResponse.json(createMockTerminal({ id: params.terminalId }));
	}),

	// Products endpoints
	http.get(`${API_BASE_URL}/products`, () => {
		return HttpResponse.json({
			contents: [createMockProduct()],
			hasMore: false,
			totalPages: 1,
			totalItems: 1,
			currentPage: 1,
		});
	}),

	http.get(`${API_BASE_URL}/products/:productId`, ({ params }) => {
		return HttpResponse.json(createMockProduct({ id: params.productId }));
	}),

	// Cart purchase/checkout endpoint
	http.post(`${API_BASE_URL}/cart/:cartId/purchase`, () => {
		return HttpResponse.json({
			checkoutToken: "test-checkout-token",
			secretToken: "test-secret-token",
		});
	}),

	// Add more handlers as needed for each domain
];
