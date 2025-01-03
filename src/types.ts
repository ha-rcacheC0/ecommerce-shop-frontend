import { z } from "zod";

export const EffectsDisplay = {
  STROBES: "Strobes",
  CRACKLES: "Crackles",
  SIZZLES: "Sizzles",
  SNAPS: "Snaps",
  LOUD_BANG: "Loud Bang",
  WHISTLE: "Whistle",
  FAN_EFFECTS: "Fan Effects",
  WILLOWS: "Willows",
  SMOKE: "Smoke",
  BROCADE: "Brocade",
  CHRYSANTHEMUM: "Chrysanthemum",
  COMET: "Comet",
  CROSSETTE: "Crossette",
  PEARLS: "Pearls",
  WATERFALL: "Waterfall",
  FLYING_FISH: "Flying Fish",
  PALM_TREE: "Palm Tree",
  PEONY: "Peony",
  PISTIL: "Pistil",
  RISING_TAIL: "Rising Tail",
  TOURBILLION: "Tourbillion",
  GLOW: "Glow",
  NISHIKI_KAMURO: "Nishiki Kamuro",
  GLITTER: "Glitter",
};

export const ColorsDisplay = {
  GREEN: "Green",
  RED: "Red",
  BLUE: "Blue",
  ORANGE: "Orange",
  YELLOW: "Yellow",
  PURPLE: "Purple",
  PINK: "Pink",
  WHITE: "White",
  SILVER: "Silver",
  BLACK: "Black",
  BROWN: "Brown",
  GOLD: "Gold",
};

export const CategoryDisplay = {
  ASSORTMENT: "Assortment",
  FIRECRACKERS: "Firecrackers",
  SNAKE_SMOKE: "Snake Smoke",
  TOY_NOVELTIES_STROBES: "Toy Novelties & Strobes",
  CONE_FLORAL: "Cone & Floral",
  GROUND: "Ground",
  FLYING_HELICOPTERS: "Flying & Helicopters",
  REPEATERS_200_GRAM: "Repeaters 200 Gram",
  REPEATERS_500_GRAM: "Repeaters 500 Gram",
  TUBES: "Tubes",
  RELOADABLES: "Reloadables",
  PARACHUTES: "Parachutes",
  BOTTLE_ROCKETS: "Bottle Rockets",
  ROCKETS_MISSLES: "Rockets & Missiles",
  SPARKLERS: "Sparklers",
  PINWHEELS: "Pinwheels",
  ROMAN_CANDLES: "Roman Candles",
  FOUNTAINS: "Fountains",
  GENDER_REVEAL: "Gender Reveal",
  FUSE: "Fuse",
  SUPPLIES_VISIBILITY: "Supplies & Visibility",
  CONFETTI_SHOOTERS_AIR_COMPRESSED: "Confetti Shooters (Air Compressed)",
};

export const BrandDisplay = {
  BOOM_WOW: "Boom Wow",
  SKY_SLAM: "Sky Slam",
  STARGET: "Starget",
  SKY_PIONEER: "Sky Pioneer",
  SKY_EAGLE: "Sky Eagle",
  ALPHA_FIREWORKS: "Alpha Fireworks",
  MIGHTY_MAX: "Mighty Max",
  MAD_OX: "Mad Ox",
  T_SKY: "T-Sky",
  MC_FIREWORKS: "MC Fireworks",
  RED_LANTERN: "Red Lantern",
  MIRACLE: "Miracle",
  LEGEND: "Legend",
  TOPGUN: "Topgun",
  WINDA: "Winda",
  SIN_CITY: "Sin City",
  HAPPY_FAMILY: "Happy Family",
  HOP_KEE: "Hop Kee",
  PYRO_DIABLO: "Pyro Diablo",
  GENERIC: "Generic",
  RACCOON: "Raccoon",
  PYRO_MOOI: "Pyro Mooi",
  KRIPTON_FIREWORKS: "Kripton Fireworks",
  BUM_BUM: "Bum Bum",
  SHOGUN: "Shogun",
  WISE_GUY: "Wise Guy",
  BLACK_SCORPION: "Black Scorpion",
  CRZ: "CRZ",
  CSS: "CSS",
  BROTHERS: "Brothers",
  DOMINATOR: "Dominator",
  MUSCLE_PACK: "Muscle Pack",
  SKIES_THE_LIMIT: "Skies the Limit",
  DUCK: "Duck",
};

export enum Effects {
  STROBES = "STROBES",
  CRACKLES = "CRACKLES",
  SIZZLES = "SIZZLES",
  SNAPS = "SNAPS",
  LOUD_BANG = "LOUD_BANG",
  WHISTLE = "WHISTLE",
  FAN_EFFECTS = "FAN_EFFECTS",
  WILLOWS = "WILLOWS",
  SMOKE = "SMOKE",
  BROCADE = "BROCADE",
  CHRYSANTHEMUM = "CHRYSANTHEMUM",
  COMET = "COMET",
  CROSSETTE = "CROSSETTE",
  PEARLS = "PEARLS",
  WATERFALL = "WATERFALL",
  FLYING_FISH = "FLYING_FISH",
  PALM_TREE = "PALM_TREE",
  PEONY = "PEONY",
  PISTIL = "PISTIL",
  RISING_TAIL = "RISING_TAIL",
  TOURBILLION = "TOURBILLION",
  GLOW = "GLOW",
  NISHIKI_KAMURO = "NISHIKI_KAMURO",
  GLITTER = "GLITTER",
}

export enum Colors {
  GREEN = "GREEN",
  RED = "RED",
  BLUE = "BLUE",
  ORANGE = "ORANGE",
  YELLOW = "YELLOW",
  PURPLE = "PURPLE",
  PINK = "PINK",
  WHITE = "WHITE",
  SILVER = "SILVER",
  BLACK = "BLACK",
  BROWN = "BROWN",
  GOLD = "GOLD",
}

export enum Category {
  ASSORTMENT = "ASSORTMENT",
  FIRECRACKERS = "FIRECRACKERS",
  SNAKE_SMOKE = "SNAKE_SMOKE",
  TOY_NOVELTIES_STROBES = "TOY_NOVELTIES_STROBES",
  CONE_FLORAL = "CONE_FLORAL",
  GROUND = "GROUND",
  FLYING_HELICOPTERS = "FLYING_HELICOPTERS",
  REPEATERS_200_GRAM = "REPEATERS_200_GRAM",
  REPEATERS_500_GRAM = "REPEATERS_500_GRAM",
  TUBES = "TUBES",
  RELOADABLES = "RELOADABLES",
  PARACHUTES = "PARACHUTES",
  BOTTLE_ROCKETS = "BOTTLE_ROCKETS",
  ROCKETS_MISSLES = "ROCKETS_MISSLES",
  SPARKLERS = "SPARKLERS",
  PINWHEELS = "PINWHEELS",
  ROMAN_CANDLES = "ROMAN_CANDLES",
  FOUNTAINS = "FOUNTAINS",
  GENDER_REVEAL = "GENDER_REVEAL",
  SHELLS_MINES = "SHELLS_MINES",
  FUSE = "FUSE",
  SUPPLIES_VISIBILITY = "SUPPLIES_VISIBILITY",
  CONFETTI_SHOOTERS_AIR_COMPRESSED = "CONFETTI_SHOOTERS_AIR_COMPRESSED",
}

export enum Brand {
  BOOM_WOW = "BOOM_WOW",
  SKY_SLAM = "SKY_SLAM",
  STARGET = "STARGET",
  SKY_PIONEER = "SKY_PIONEER",
  SKY_EAGLE = "SKY_EAGLE",
  ALPHA_FIREWORKS = "ALPHA_FIREWORKS",
  MIGHTY_MAX = "MIGHTY_MAX",
  MAD_OX = "MAD_OX",
  T_SKY = "T_SKY",
  MC_FIREWORKS = "MC_FIREWORKS",
  RED_LANTERN = "RED_LANTERN",
  MIRACLE = "MIRACLE",
  LEGEND = "LEGEND",
  TOPGUN = "TOPGUN",
  WINDA = "WINDA",
  SIN_CITY = "SIN_CITY",
  HAPPY_FAMILY = "HAPPY_FAMILY",
  HOP_KEE = "HOP_KEE",
  PYRO_DIABLO = "PYRO_DIABLO",
  GENERIC = "GENERIC",
  RACCOON = "RACCOON",
  PYRO_MOOI = "PYRO_MOOI",
  KRIPTON_FIREWORKS = "KRIPTON_FIREWORKS",
  BUM_BUM = "BUM_BUM",
  SHOGUN = "SHOGUN",
  WISE_GUY = "WISE_GUY",
  BLACK_SCORPION = "BLACK_SCORPION",
  CRZ = "CRZ",
  CSS = "CSS",
  BROTHERS = "BROTHERS",
  DOMINATOR = "DOMINATOR",
  MUSCLE_PACK = "MUSCLE_PACK",
  SKIES_THE_LIMIT = "SKIES_THE_LIMIT",
  DUCK = "DUCK",
}

export const States = {
  AL: "AL",
  AK: "AK",
  AZ: "AZ",
  AR: "AR",
  CA: "CA",
  CO: "CO",
  CT: "CT",
  DE: "DE",
  FL: "FL",
  GA: "GA",
  HI: "HI",
  ID: "ID",
  IL: "IL",
  IN: "IN",
  IA: "IA",
  KS: "KS",
  KY: "KY",
  LA: "LA",
  ME: "ME",
  MD: "MD",
  MA: "MA",
  MI: "MI",
  MN: "MN",
  MS: "MS",
  MO: "MO",
  MT: "MT",
  NE: "NE",
  NV: "NV",
  NH: "NH",
  NJ: "NJ",
  NM: "NM",
  NY: "NY",
  NC: "NC",
  ND: "ND",
  OH: "OH",
  OK: "OK",
  OR: "OR",
  PA: "PA",
  RI: "RI",
  SC: "SC",
  SD: "SD",
  TN: "TN",
  TX: "TX",
  UT: "UT",
  VT: "VT",
  VA: "VA",
  WA: "WA",
  WV: "WV",
  WI: "WI",
  WY: "WY",
};
export const TerminalCompany = {
  FEDEX: "FedEx",
};

// Create a Zod enum schema from the states enum
const StateEnum = z.nativeEnum(States);
const TerminalCompanyEnum = z.nativeEnum(TerminalCompany);

const AddressSchema = z.object({
  id: z.string(),
  street1: z.string(),
  street2: z.string().optional(),
  city: z.string(),
  state: StateEnum,
  postalCode: z.string(),
});
// Example of a schema that uses the StateEnum
const UserProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.date().optional(),
  phoneNumber: z.string().optional(),
  billingAddress: AddressSchema.optional(),
  shippingAddress: AddressSchema.optional(),
  canContact: z.boolean().optional(),
  userId: z.string(),
});
const TUserSchema = z.object({
  id: z.string(),
  role: z.enum(["USER", "MANAGER", "ADMIN"]),
  email: z.string().email(),
  lastLogin: z.string().datetime().nullable(),
});

const TUnitProduct = z.object({
  id: z.string(),
  sku: z.string(),
  productId: z.string(),
  unitPrice: z.string(),
  package: z.number().array(),
  availableStock: z.number(),
});

export const TProductSchema = z.object({
  id: z.string(),
  sku: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  casePrice: z.string(),
  Categories: z.object({ id: z.string(), name: z.string() }),
  Brands: z.object({ id: z.string(), name: z.string() }),
  ColorStrings: z
    .object({ id: z.string(), name: z.string() })
    .array()
    .optional(),
  EffectStrings: z
    .object({ id: z.string(), name: z.string() })
    .array()
    .optional(),
  image: z.string(),
  videoUrl: z.string().url().optional(),
  package: z.number().array(),
  UnitProduct: TUnitProduct.optional().nullable(),
});

const CartProductSchema = z.object({
  id: z.string(),
  caseQuantity: z.number(),
  unitQuantity: z.number(),
  cartId: z.string(),
  Product: TProductSchema,
});
const TCartSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  CartProducts: CartProductSchema.array(),
  User: TUserSchema,
});

export const SignInRequestSchema = z.object({
  email: z.string(),
  password: z.string(),
});
export const createUserRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strict();

export const SignInResponseSchema = z.object({
  token: z.string().optional(),
  userInfo: z
    .object({
      email: z.string(),
      role: z.enum(["USER", "MANAGER", "ADMIN"]),
      lastLogin: z.string().datetime().nullable(),
      Cart: TCartSchema,
    })
    .optional(),
  message: z.string().optional(), // Assuming the message might be included in the response
});
const ApprovedTerminalSchema = z.object({
  id: z.string(),
  acceptOutOfStateLicence: z.boolean(),
  terminalName: z.string(),
  businessRequired: z.boolean(),
  Address: AddressSchema,
  addressId: z.string(),
  company: TerminalCompanyEnum,
});

type ProductFilters = {
  page: number;
  pageSize: number;
  searchTitle?: string;
  selectedBrands?: Brand[];
  selectedCategories?: Category[];
  selectedColors?: Colors[];
  selectedEffects?: Effects[];
};

// Define the response type from our API
type ProductsResponse = {
  contents: TProduct[];
  hasMore: boolean;
  totalPages: number;
  currentPage: number;
};

type SignInRequest = z.infer<typeof SignInRequestSchema>;
type SignInResponse = z.infer<typeof SignInResponseSchema>;
type UserCreateRequest = z.infer<typeof createUserRequestSchema>;
type User = z.infer<typeof SignInResponseSchema>;
type UserProfile = z.infer<typeof UserProfileSchema>;
type TProduct = z.infer<typeof TProductSchema>;
type TCartProduct = z.infer<typeof CartProductSchema>;
type TCart = z.infer<typeof TCartSchema>;
type TAddress = z.infer<typeof AddressSchema>;
type TApprovedTerminal = z.infer<typeof ApprovedTerminalSchema>;
export type {
  SignInRequest,
  SignInResponse,
  UserCreateRequest,
  User,
  UserProfile,
  TProduct,
  TCartProduct,
  TCart,
  TAddress,
  TApprovedTerminal,
  ProductsResponse,
  ProductFilters,
};
