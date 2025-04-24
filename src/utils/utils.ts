type OrderType = "retail" | "wholesale" | "combo";
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
  destination: DestinationType
): number => {
  for (const amount of Object.keys(rates)
    .map(Number)
    .sort((a, b) => b - a)) {
    if (orderAmount >= amount) {
      return rates[amount][destination];
    }
  }
  return 0; // Default case, shouldn't reach here.
};

function checkOrderType(caseSubtotal: number, unitSubtotal: number): OrderType {
  const combinedSubTotal = caseSubtotal + unitSubtotal;

  if (combinedSubTotal === unitSubtotal) return "retail";
  if (unitSubtotal === 0) return "wholesale";
  if (unitSubtotal / combinedSubTotal < 0.25) return "wholesale";
  return "combo";
}
export function calcUnitPrice(casePrice: number, qty: number): number {
  return Math.ceil((casePrice / 1.68 / qty) * 2.42) - 0.01; // 2.2*
}

function calculateShipping(options: ShippingOptions): number {
  const { orderAmount, orderType, destination, needLiftGate } = options;
  let shippingCost = 0;

  switch (orderType) {
    case "retail":
      shippingCost = getShippingCost(
        retailShippingRates,
        orderAmount,
        destination
      );
      break;
    case "wholesale":
      shippingCost = getShippingCost(
        wholesaleShippingRates,
        orderAmount,
        destination
      );
      break;
    case "combo":
      shippingCost = getShippingCost(
        comboShippingRates,
        orderAmount,
        destination
      );
      break;
  }

  // Check if the user needs a lift gate
  if (needLiftGate) shippingCost += 100;

  return shippingCost;
}
export { calculateShipping, checkOrderType };
