import { z } from "zod";

// Display mappings - we'll retain these for UI presentation
export const EffectsDisplay: Record<string, string> = {
  BROCADE: "Brocade",
  CHRYSANTHEMUM: "Chrysanthemum",
  COMET: "Comet",
  CONFETTI: "Confetti",
  CRACKLES: "Crackles",
  CROSSETTE: "Crossette",
  FAN_EFFECTS: "Fan Effects",
  FLYING_FISH: "Flying Fish",
  GLITTER: "Glitter",
  GLOW: "Glow",
  HELICOPTER: "Helicopter",
  LOUD_BANG: "Loud Bang",
  NISHIKI_KAMURO: "Nishiki Kamuro",
  PALM_TREE: "Palm Tree",
  PARACHUTE: "Parachute",
  PEARLS: "Pearls",
  PEONY: "Peony",
  PISTIL: "Pistil",
  REVEAL: "Reveal",
  RISING_TAIL: "Rising Tail",
  SIZZLES: "Sizzles",
  SMOKE: "Smoke",
  SNAKE: "Snake",
  SNAPS: "Snaps",
  SPARKLES: "Sparkles",
  SPINS: "Spins",
  STROBES: "Strobes",
  TOURBILLION: "Tourbillion",
  WATERFALL: "Waterfall",
  WHISTLE: "Whistle",
  WILLOW: "Willow",
};

export const ColorsDisplay: Record<string, string> = {
  BLACK: "Black",
  BLUE: "Blue",
  BROWN: "Brown",
  GOLD: "Gold",
  GREEN: "Green",
  ORANGE: "Orange",
  PINK: "Pink",
  PURPLE: "Purple",
  RED: "Red",
  SILVER: "Silver",
  WHITE: "White",
  YELLOW: "Yellow",
};

export const CategoryDisplay: Record<string, string> = {
  REPEATERS_200_GRAM: "200 Gram Cakes",
  REPEATERS_500_GRAM: "500 Gram Cakes",
  ASSORTMENT: "Assortments",
  BOTTLE_ROCKETS: "Bottle Rockets",
  CONE_FLORAL: "Cone & Floral",
  CONFETTI_SHOOTERS_AIR_COMPRESSED: "Confetti Shooters (Air Compressed)",
  FIRECRACKERS: "Firecrackers",
  FLYING_HELICOPTERS: "Flying & Helicopters",
  FOUNTAINS: "Fountains",
  FUSE: "Fuse",
  GENDER_REVEAL: "Gender Reveal",
  GROUND: "Ground",
  PARACHUTES: "Parachutes",
  PINWHEELS: "Pinwheels",
  RELOADABLES: "Artillery Shells (Reloadables)",
  ROCKETS_MISSLES: "Rockets & Missiles",
  ROMAN_CANDLES: "Roman Candles",
  SHELLS_MINES: "Shells & Mines",
  SNAKE_SMOKE: "Snake & Smoke",
  SPARKLERS: "Sparklers",
  SUPPLIES_VISIBILITY: "Supplies & Visibility",
  TOY_NOVELTIES_STROBES: "Toy Novelties & Strobes",
  TUBES: "Tubes (Finales)",
};

export const BrandDisplay: Record<string, string> = {
  ALPHA_FIREWORKS: "Alpha Fireworks",
  BLACK_SCORPION: "Black Scorpion",
  BLUE_DRAGON: "Blue Dragon",
  BOOM_WOW: "Boom Wow",
  BOOMER: "Boomer",
  BROTHERS: "Brothers",
  BUM_BUM: "Bum Bum",
  CRZ: "CRZ",
  CSS: "CSS",
  DFS: "DFS",
  DEMON_PYRO: "DEMON_PYRO",
  DOMINATOR: "Dominator",
  DUCK: "Duck",
  FIREHAWK: "Firehawk",
  FISHERMAN: "Fisherman",
  FOX_FIREWORKS: "Fox Fireworks",
  GALAXY_FIREWORKS: "Galaxy Fireworks",
  GENERIC: "Generic",
  HAPPY_FAMILY: "Happy Family",
  HOP_KEE: "Hop Kee",
  IRONMAN: "Ironman",
  KRIPTON_FIREWORKS: "Kripton Fireworks",
  LEGEND: "Legend",
  MAD_OX: "Mad Ox",
  MC_FIREWORKS: "MC Fireworks",
  MIGHTY_MAX: "Mighty Max",
  MIRACLE: "Miracle",
  MUSCLE_PACK: "Muscle Pack",
  PYRO_DIABLO: "Pyro Diablo",
  PYRO_MOOI: "Pyro Mooi",
  PYRO_PIRATE: "Pyro Pirate",
  RACCOON: "Raccoon",
  RED_LANTERN: "Red Lantern",
  SHOGUN: "Shogun",
  SIN_CITY: "Sin City",
  SKY_EAGLE: "Sky Eagle",
  SKY_SLAM: "Sky Slam",
  SKY_PAINTER: "Sky Painter",
  SKY_PIONEER: "Sky Pioneer",
  STARGET: "Starget",
  SUNS_FIREWORKS: "Suns Fireworks",
  T_SKY: "T-Sky",
  TOPGUN: "Topgun",
  WINDA: "Winda",
  WISE_GUY: "Wise Guy",
};

// Create string-based schemas instead of enums
export const EffectsSchema = z.string();
export const ColorsSchema = z.string();
export const CategorySchema = z.string();
export const BrandSchema = z.string();

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
  role: z.enum(["USER", "MANAGER", "ADMIN", "MEMBER"]),
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

// Updated to use the new string-based models
export const TProductSchema = z.object({
  id: z.string(),
  sku: z.number(),
  title: z.string(),
  description: z.string().nullable(),
  casePrice: z.string(),
  category: z.object({ id: z.string(), name: z.string() }),
  brand: z.object({ id: z.string(), name: z.string() }),
  colors: z.object({ id: z.string(), name: z.string() }).array().optional(),
  effects: z.object({ id: z.string(), name: z.string() }).array().optional(),
  image: z.string(),
  videoUrl: z.string().url().optional(),
  package: z.number().array(),
  unitProduct: TUnitProduct.optional().nullable(),
});

const CartProductSchema = z.object({
  id: z.string(),
  caseQuantity: z.number(),
  unitQuantity: z.number(),
  cartId: z.string(),
  product: TProductSchema,
});

const TCartSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  cartProducts: CartProductSchema.array(),
  user: TUserSchema,
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
      role: z.enum(["USER", "MANAGER", "ADMIN", "MEMBER"]),
      lastLogin: z.string().datetime().nullable(),
      Cart: TCartSchema,
    })
    .optional(),
  message: z.string().optional(),
});

const ApprovedTerminalSchema = z.object({
  id: z.string(),
  acceptOutOfStateLicence: z.boolean(),
  terminalName: z.string(),
  businessRequired: z.boolean(),
  address: AddressSchema,
  addressId: z.string(),
  company: TerminalCompanyEnum,
});

type ProductFilters = {
  page: number;
  pageSize: number;
  searchTitle?: string;
  selectedBrands?: string[];
  selectedCategories?: string[];
  selectedColors?: string[];
  selectedEffects?: string[];
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
