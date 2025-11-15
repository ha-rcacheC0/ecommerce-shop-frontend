type OrderType = "retail" | "wholesale" | "combo" | "show" | "apparelOnly";
type DestinationType = "terminal" | "anywhere";

interface ShippingOptions {
	orderAmount: number;
	orderType: OrderType;
	destination: DestinationType;
	needLiftGate?: boolean;
}

const retailShippingRates: {
	[amount: number]: { [destination in DestinationType]: number };
} = {
	1500: { anywhere: 0, terminal: 0 },
	1250: { anywhere: 100, terminal: 0 },
	1000: { anywhere: 150, terminal: 150 },
	750: { anywhere: 250, terminal: 200 },
	500: { anywhere: 300, terminal: 250 },
	350: { anywhere: 350, terminal: 300 },
	0: { anywhere: 359, terminal: 359 },
};

const wholesaleShippingRates: {
	[amount: number]: { [destination in DestinationType]: number };
} = {
	7500: { anywhere: 0, terminal: 0 },
	3500: { anywhere: 0, terminal: 0 },
	2500: { anywhere: 100, terminal: 100 },
	2000: { anywhere: 150, terminal: 150 },
	1500: { anywhere: 250, terminal: 250 },
	1250: { anywhere: 300, terminal: 300 },
	0: { anywhere: 358, terminal: 358 },
};

const comboShippingRates: {
	[amount: number]: { [destination in DestinationType]: number };
} = {
	3000: { anywhere: 0, terminal: 0 },
	2000: { anywhere: 0, terminal: 0 },
	1500: { anywhere: 150, terminal: 150 },
	750: { anywhere: 300, terminal: 300 },
	0: { anywhere: 359, terminal: 359 },
};

const getShippingCost = (
	rates: { [amount: number]: { [destination in DestinationType]: number } },
	orderAmount: number,
	destination: DestinationType,
): number => {
	for (const amount of Object.keys(rates)
		.map(Number)
		.sort((a, b) => b - a)) {
		if (orderAmount >= amount) {
			return rates[amount][destination];
		}
	}
	return 0;
};

export function calcUnitPrice(casePrice: number, qty: number): number {
	return Math.ceil((casePrice / 2.016 / qty) * 2.65) - 0.01;
}
function checkOrderType(
	caseSubtotal: number,
	unitSubtotal: number,
	hasShow: boolean,
	onlyApparel: boolean,
): OrderType {
	const combinedSubTotal = caseSubtotal + unitSubtotal;
	if (hasShow) return "show";
	if (onlyApparel) return "apparelOnly";
	if (combinedSubTotal === unitSubtotal) return "retail";
	if (unitSubtotal === 0) return "wholesale";
	if (unitSubtotal / combinedSubTotal < 0.25) return "wholesale";
	return "combo";
}

function calculateShipping(options: ShippingOptions): number {
	const { orderAmount, orderType, destination, needLiftGate } = options;
	let shippingCost = 0;

	switch (orderType) {
		case "show":
			return 0;
		case "apparelOnly":
			return 10;
		case "retail":
			shippingCost = getShippingCost(
				retailShippingRates,
				orderAmount,
				destination,
			);
			break;
		case "wholesale":
			shippingCost = getShippingCost(
				wholesaleShippingRates,
				orderAmount,
				destination,
			);
			break;
		case "combo":
			shippingCost = getShippingCost(
				comboShippingRates,
				orderAmount,
				destination,
			);
			break;
	}

	// Check if the user needs a lift gate
	if (needLiftGate) shippingCost += 100;

	return shippingCost;
}

function calculateStateTax(state: string, subtotal: number): number {
	const stateTaxRates: Record<string, number | null> = {
		AL: 0.04,
		AK: null, // don't ship here
		AZ: 0.056,
		AR: 0.065,
		CA: 0.1,
		CO: 0.029,
		CT: 0.0635,
		DE: 0.0,
		FL: 0.06,
		GA: 0.04,
		HI: null, // don't ship here
		ID: 0.06,
		IL: 0.0625,
		IN: 0.07,
		IA: 0.06,
		KS: 0.065,
		KY: 0.06,
		LA: 0.05,
		ME: 0.055,
		MD: 0.06,
		MA: null, // can't ship here
		MI: 0.06,
		MN: 0.06875,
		MS: 0.07,
		MO: 0.04225,
		MT: 0.0,
		NE: 0.055,
		NV: 0.0685,
		NH: 0.0,
		NJ: 0.06625,
		NM: 0.04875,
		NY: 0.04,
		NC: 0.0475,
		ND: 0.05,
		OH: 0.0575,
		OK: 0.045,
		OR: 0.0,
		PA: 0.06,
		RI: 0.07,
		SC: 0.06,
		SD: 0.042,
		TN: 0.07,
		TX: 0.0625,
		UT: 0.061,
		VT: 0.06,
		VA: 0.053,
		WA: 0.065,
		WV: 0.06,
		WI: 0.05,
		WY: 0.04,
	};

	const stateCode = state.toUpperCase();

	if (!(stateCode in stateTaxRates)) {
		throw new Error(`Invalid state code: ${stateCode}`);
	}

	const taxRate = stateTaxRates[stateCode];

	if (taxRate === null) {
		throw new Error(`We don't ship to ${stateCode}`);
	}

	return subtotal * taxRate;
}

export { calculateShipping, checkOrderType, calculateStateTax };
