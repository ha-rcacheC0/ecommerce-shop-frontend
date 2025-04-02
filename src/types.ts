import { z } from "zod";

export const EffectsDisplay = {
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

export const ColorsDisplay = {
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

export const CategoryDisplay = {
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

export const BrandDisplay = {
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

export enum Effects {
  BROCADE = "BROCADE",
  CHRYSANTHEMUM = "CHRYSANTHEMUM",
  COMET = "COMET",
  CONFETTI = "CONFETTI",
  CRACKLES = "CRACKLES",
  CROSSETTE = "CROSSETTE",
  FAN_EFFECTS = "FAN_EFFECTS",
  FLYING_FISH = "FLYING_FISH",
  GLITTER = "GLITTER",
  GLOW = "GLOW",
  HELICOPTER = "HELICOPTER",
  LOUD_BANG = "LOUD_BANG",
  NISHIKI_KAMURO = "NISHIKI_KAMURO",
  PALM_TREE = "PALM_TREE",
  PARACHUTE = "PARACHUTE",
  PEARLS = "PEARLS",
  PEONY = "PEONY",
  PISTIL = "PISTIL",
  REVEAL = "REVEAL",
  RISING_TAIL = "RISING_TAIL",
  SIZZLES = "SIZZLES",
  SMOKE = "SMOKE",
  SNAKE = "SNAKE",
  SNAPS = "SNAPS",
  SPARKLES = "SPARKLES",
  SPINS = "SPINS",
  STROBES = "STROBES",
  TOURBILLION = "TOURBILLION",
  WATERFALL = "WATERFALL",
  WHISTLE = "WHISTLE",
  WILLOW = "WILLOW",
}

export enum Colors {
  BLACK = "BLACK",
  BLUE = "BLUE",
  BROWN = "BROWN",
  GREEN = "GREEN",
  GOLD = "GOLD",
  ORANGE = "ORANGE",
  PINK = "PINK",
  PURPLE = "PURPLE",
  RED = "RED",
  SILVER = "SILVER",
  WHITE = "WHITE",
  YELLOW = "YELLOW",
}

export enum Category {
  REPEATERS_200_GRAM = "REPEATERS_200_GRAM",
  REPEATERS_500_GRAM = "REPEATERS_500_GRAM",
  RELOADABLES = "RELOADABLES",
  ASSORTMENT = "ASSORTMENT",
  BOTTLE_ROCKETS = "BOTTLE_ROCKETS",
  CONE_FLORAL = "CONE_FLORAL",
  CONFETTI_SHOOTERS_AIR_COMPRESSED = "CONFETTI_SHOOTERS_AIR_COMPRESSED",
  FIRECRACKERS = "FIRECRACKERS",
  FLYING_HELICOPTERS = "FLYING_HELICOPTERS",
  FOUNTAINS = "FOUNTAINS",
  FUSE = "FUSE",
  GENDER_REVEAL = "GENDER_REVEAL",
  GROUND = "GROUND",
  PARACHUTE = "PARACHUTE",
  PINWHEELS = "PINWHEELS",
  SHELLS_MINES = "SHELLS_MINES",
  SNAKE_SMOKE = "SNAKE_SMOKE",
  TOY_NOVELTIES_STROBES = "TOY_NOVELTIES_STROBES",
  TUBES = "TUBES",
  ROCKETS_MISSLES = "ROCKETS_MISSLES",
  SPARKLERS = "SPARKLERS",
  ROMAN_CANDLES = "ROMAN_CANDLES",
  SUPPLIES_VISIBILITY = "SUPPLIES_VISIBILITY",
}

export enum Brand {
  ALPHA_FIREWORKS = "ALPHA_FIREWORKS",
  BLACK_SCORPION = "BLACK_SCORPION",
  BLUE_DRAGON = "BLUE_DRAGON",
  BOOM_WOW = "BOOM_WOW",
  BOOMER = "BOOMER",
  BROTHERS = "BROTHERS",
  BUM_BUM = "BUM_BUM",
  CRZ = "CRZ",
  CSS = "CSS",
  DEMON_PYRO = "DEMON_PYRO",
  DFS = "DFS",
  DOMINATOR = "DOMINATOR",
  DUCK = "DUCK",
  FIREHAWK = "FIREHAWK",
  FISHERMAN = "FISHERMAN",
  FOX_FIREWORKS = "FOX_FIREWORKS",
  GALAXY_FIREWORKS = "GALAXY_FIREWORKS",
  GENERIC = "GENERIC",
  HAPPY_FAMILY = "HAPPY_FAMILY",
  HOP_KEE = "HOP_KEE",
  IRONMAN = "IRONMAN",
  KRIPTON_FIREWORKS = "KRIPTON_FIREWORKS",
  LEGEND = "LEGEND",
  MAD_OX = "MAD_OX",
  MC_FIREWORKS = "MC_FIREWORKS",
  MIGHTY_MAX = "MIGHTY_MAX",
  MIRACLE = "MIRACLE",
  MUSCLE_PACK = "MUSCLE_PACK",
  PYRO_DIABLO = "PYRO_DIABLO",
  PYRO_MOOI = "PYRO_MOOI",
  PYRO_PIRATE = "PYRO_PIRATE",
  RACCOON = "RACCOON",
  RED_LANTERN = "RED_LANTERN",
  SHOGUN = "SHOGUN",
  SIN_CITY = "SIN_CITY",
  SKY_SLAM = "SKY_SLAM",
  SKY_PAINTER = "SKY_PAINTER",
  SKY_PIONEER = "SKY_PIONEER",
  SKY_EAGLE = "SKY_EAGLE",
  STARGET = "STARGET",
  SUNS_FIREWORKS = "SUNS_FIREWORKS",
  T_SKY = "T_SKY",
  TOPGUN = "TOPGUN",
  WINDA = "WINDA",
  WISE_GUY = "WISE_GUY",
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
