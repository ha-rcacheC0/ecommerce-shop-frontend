import { HttpResponse, http } from "msw";

const API_BASE_URL = "http://localhost:4000/api";

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

	// Add more handlers as needed for each domain
];
