import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, expect } from "vitest";
import { server } from "./mocks/server";

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

// Reset handlers after each test
afterEach(() => {
	cleanup();
	server.resetHandlers();
});

// Stop MSW server after all tests
afterAll(() => server.close());
