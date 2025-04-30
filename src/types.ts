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
  CANNON: "Cannon",
  CODY_B: "Cody B",
  CREW_FIREWORKS: "Crew Fireworks",
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
  HONEY_BOOM: "Honey Boom",
  HOP_KEE: "Hop Kee",
  IRONMAN: "Ironman",
  KEYSTONE_FIREWORKS: "Keystone Fireworks",
  KRIPTON_FIREWORKS: "Kripton Fireworks",
  LEGEND: "Legend",
  MAD_OX: "Mad Ox",
  MC_FIREWORKS: "MC Fireworks",
  MECHA: "Mecha",
  MIGHTY_MAX: "Mighty Max",
  MIRACLE: "Miracle",
  MONKEY_MANIA: "Monkey Mania",
  MUSCLE_PACK: "Muscle Pack",
  PYRO_DIABLO: "Pyro Diablo",
  PYRO_MOOI: "Pyro Mooi",
  PYRO_PIRATE: "Pyro Pirate",
  PYRO_SLUT: "Pyro Slut",
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
  TWO_WINGS: "Two Wings",
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

// Define report status enum
export enum ReportStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

// Define report type enum
export enum ReportType {
  SALES = "SALES",
  INVENTORY = "INVENTORY",
  USER_ACTIVITY = "USER_ACTIVITY",
  FINANCIAL = "FINANCIAL",
  PRODUCT_PERFORMANCE = "PRODUCT_PERFORMANCE",
}

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

export const ShowTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});

interface TProductInterface {
  id: string;
  sku: string;
  title: string;
  description: string | null;
  casePrice: string;
  isShow?: boolean;
  inStock?: boolean;
  isCaseBreakable: boolean;
  showTypeId?: string | null;
  category: { id: string; name: string };
  brand: { id: string; name: string };
  showType?: { id: string; name: string; description: string | null } | null;
  colors?: { id: string; name: string }[];
  effects?: { id: string; name: string }[];
  image: string;
  videoURL?: string | null;
  package: number[];
  unitProduct?: TUnitProductInterface | null;
  showProducts?: ShowProductInterface[];
}

interface ShowProductInterface {
  id: string;
  showId: string;
  productId: string;
  quantity: number;
  notes: string | null;
  isUnit: boolean;
  product: TProductInterface;
}

interface TUnitProductInterface {
  id: string;
  sku: string;
  productId: string;
  unitPrice: string;
  package: number[];
  availableStock: number;
}
interface TInventoryUnitProductInterface {
  id: string;
  sku: string;
  product: TProductInterface;
  productId: string;
  unitPrice: string;
  package: number[];
  availableStock: number;
}

export const TProductSchema: z.ZodType<TProductInterface> = z.lazy(() =>
  z.object({
    id: z.string(),
    sku: z.string(),
    title: z.string(),
    description: z.string().nullable(),
    casePrice: z.string(),
    isShow: z.boolean().optional(),
    isCaseBreakable: z.boolean(),
    inStock: z.boolean(),
    showTypeId: z.string().nullable().optional(),
    category: z.object({ id: z.string(), name: z.string() }),
    brand: z.object({ id: z.string(), name: z.string() }),
    showType: ShowTypeSchema.nullable().optional(),
    colors: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
    effects: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
    image: z.string(),
    videoURL: z.string().url().nullable().optional(),
    package: z.array(z.number()),
    unitProduct: TUnitProductSchema.optional().nullable(),
    showProducts: z.array(ShowProductSchema).optional(),
  })
);

export const ShowProductSchema: z.ZodType<ShowProductInterface> = z.lazy(() =>
  z.object({
    id: z.string(),
    showId: z.string(),
    productId: z.string(),
    quantity: z.number(),
    isUnit: z.boolean(),
    notes: z.string().nullable(),
    product: TProductSchema,
  })
);

export const TUnitProductSchema: z.ZodType<TUnitProductInterface> = z.lazy(() =>
  z.object({
    id: z.string(),
    sku: z.string(),
    productId: z.string(),
    unitPrice: z.string(),
    package: z.array(z.number()),
    availableStock: z.number(),
  })
);
export const TInventoryUnitProductSchema: z.ZodType<TInventoryUnitProductInterface> =
  z.lazy(() =>
    z.object({
      id: z.string(),
      sku: z.string(),
      product: TProductSchema,
      productId: z.string(),
      unitPrice: z.string(),
      package: z.array(z.number()),
      availableStock: z.number(),
    })
  );

// Define the types from the schemas
export type ShowType = z.infer<typeof ShowTypeSchema>;
export type ShowProduct = z.infer<typeof ShowProductSchema>;
export type TUnitProduct = z.infer<typeof TUnitProductSchema>;
export type TProduct = z.infer<typeof TProductSchema>;
export type TInventoryUnitProduct = z.infer<typeof TInventoryUnitProductSchema>;

// Product Types
export type CreateProductData = {
  sku: string;
  title: string;
  description?: string;
  image?: string;
  casePrice: string;
  inStock: boolean;
  package: string; // Comma-separated list
  isCaseBreakable: boolean;
  videoURL?: string;
  brandId: string;
  categoryId: string;
  colors: string[]; // Array of color IDs
  effects: string[]; // Array of effect IDs
};

export type UpdateProductData = Partial<CreateProductData>;

// Show Types
export type CreateShowProductData = {
  productId: string;
  quantity: number;
  isUnit: boolean;
  notes?: string;
};

export type CreateShowData = {
  title: string;
  description?: string;
  casePrice: number;
  image?: string;
  videoURL?: string;
  inStock: boolean;
  showTypeId: string;
  brandId: string;
  categoryId: string;
  products: CreateShowProductData[];
};

export type UpdateShowData = Partial<CreateShowData>;

// Update ProductFilters to include isShow
export interface ProductFilters {
  page: number;
  pageSize: number;
  searchTitle?: string;
  selectedBrands?: string[];
  selectedCategories?: string[];
  selectedColors?: string[];
  selectedEffects?: string[];
  isShow?: boolean;
  inStock?: boolean;
}

// Enhanced type for a product that is a show
export type ShowWithProducts = TProduct & {
  isShow: true;
  showType: ShowType;
  showProducts: ShowProduct[];
};

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

// Zod schema for a report
export const ReportSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(ReportType),
  name: z.string(),
  description: z.string().optional(),
  status: z.nativeEnum(ReportStatus),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  parameters: z.record(z.string(), z.any()).optional(),
  createdBy: z.string(), // userId
  fileUrl: z.string().nullable(),
  errorMessage: z.string().nullable(),
});

// TypeScript type derived from the schema
export type Report = z.infer<typeof ReportSchema>;

// Define report configuration for available report types
export const reportConfigurations = {
  [ReportType.SALES]: {
    name: "Sales Report",
    description: "Overview of sales within a specified time period",
    parameterSchema: z.object({
      startDate: z.string(),
      endDate: z.string(),
      includeShowDetails: z.boolean().optional().default(true),
      includeProductBreakdown: z.boolean().optional().default(true),
    }),
  },
  [ReportType.INVENTORY]: {
    name: "Inventory Report",
    description: "Current inventory levels and product status",
    parameterSchema: z.object({
      includeZeroStock: z.boolean().optional().default(true),
      includeNotes: z.boolean().optional().default(true),
    }),
  },
  [ReportType.USER_ACTIVITY]: {
    name: "User Activity Report",
    description: "User login and activity tracking",
    parameterSchema: z.object({
      startDate: z.string(),
      endDate: z.string(),
      includeAdminActivity: z.boolean().optional().default(true),
    }),
  },
  [ReportType.FINANCIAL]: {
    name: "Financial Report",
    description:
      "Financial overview including revenue, costs, and profit margins",
    parameterSchema: z.object({
      startDate: z.string(),
      endDate: z.string(),
      includeBreakdownByProduct: z.boolean().optional().default(true),
      includeBreakdownByCategory: z.boolean().optional().default(true),
    }),
  },
  [ReportType.PRODUCT_PERFORMANCE]: {
    name: "Product Performance Report",
    description: "Analysis of product sales performance and trends",
    parameterSchema: z.object({
      startDate: z.string(),
      endDate: z.string(),
      topPerformersCount: z.number().optional().default(10),
      includeCategoryAnalysis: z.boolean().optional().default(true),
    }),
  },
};

const ApprovedTerminalSchema = z.object({
  id: z.string(),
  acceptOutOfStateLicence: z.boolean(),
  terminalName: z.string(),
  businessRequired: z.boolean(),
  address: AddressSchema,
  addressId: z.string(),
  company: TerminalCompanyEnum,
});

export interface User {
  id: string;
  role: string;
  email: string;
  hashedPassword: string;
  createdOn: string;
  lastLogin: string | null;
  profile: UserProfile;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export type UsersResponse = PaginatedResponse<User>;

// Define the response type from our API
type ProductsResponse = {
  contents: TProduct[];
  hasMore: boolean;
  totalPages: number;
  totalItems: number;
  currentPage: number;
};

// Types derived from the schemas
type SignInRequest = z.infer<typeof SignInRequestSchema>;
type SignInResponse = z.infer<typeof SignInResponseSchema>;
type UserCreateRequest = z.infer<typeof createUserRequestSchema>;

type UserProfile = z.infer<typeof UserProfileSchema>;
type TCartProduct = z.infer<typeof CartProductSchema>;
type TCart = z.infer<typeof TCartSchema>;
type TAddress = z.infer<typeof AddressSchema>;
type TApprovedTerminal = z.infer<typeof ApprovedTerminalSchema>;

export type {
  SignInRequest,
  SignInResponse,
  UserCreateRequest,
  UserProfile,
  TCartProduct,
  TCart,
  TAddress,
  TApprovedTerminal,
  ProductsResponse,
};
