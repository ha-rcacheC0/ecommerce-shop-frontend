/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Apparel: "Apparel",
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
  BRIGHT_STAR: "Bright Star",
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
  DEMON_PYRO: "Demon Pyro",
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
  WORLD_CLASS_FIREWORKS: "World Class Fireworks",
};

// Enums and constants
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
  DHL: "DHL",
};

export enum ReportStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum ReportType {
  SALES = "SALES",
  INVENTORY = "INVENTORY",
  USER_ACTIVITY = "USER_ACTIVITY",
  FINANCIAL = "FINANCIAL",
  PRODUCT_PERFORMANCE = "PRODUCT_PERFORMANCE",
}

// =============================================
// MAIN INTERFACE DEFINITIONS
// =============================================

// Basic entity interfaces
export interface TBrand {
  id: string;
  name: string;
}

export interface TCategory {
  id: string;
  name: string;
}

export interface TColor {
  id: string;
  name: string;
}

export interface TEffect {
  id: string;
  name: string;
}

export interface ShowType {
  id: string;
  name: string;
  description: string | null;
}

export interface ApparelType {
  id: string;
  name: string;
  description: string | null;
}

export interface TAddress {
  id: string;
  street1: string;
  street2?: string | null;
  city: string;
  state: keyof typeof States;
  postalCode: string;
}

// Product Variant Interface
export interface ProductVariant {
  id: string;
  sku: string;
  productId: string;
  size: string;
  gender: "MALE" | "FEMALE" | "UNISEX";
  colorId: string | null;
  color?: TColor | null;
  unitPrice: string;
  availableStock: number;
  additionalSku?: string | null;
  weight?: string | null;
  isActive: boolean;
}

// Unit Product Interface
export interface TUnitProduct {
  id: string;
  sku: string;
  productId: string;
  unitPrice: string;
  package: number[];
  availableStock: number;
}

// Show Product Interface
export interface ShowProduct {
  id: string;
  showId: string;
  productId: string;
  quantity: number;
  notes: string | null;
  isUnit: boolean;
  product: TProduct;
}

// DEPRECATED: Keep for migration compatibility
export interface ApparelProduct {
  id: string;
  productId: string;
  size: string;
  colorId: string;
  unitPrice: string;
  availableStock: number;
}

// Main Product Interface
export interface TProduct {
  id: string;
  sku: string;
  title: string;
  description: string | null;
  image: string;
  videoURL?: string | null;
  casePrice: string;
  isCaseBreakable: boolean;
  inStock: boolean;
  package: number[];

  // Product type flags
  isShow?: boolean;
  isApparel?: boolean;

  // Type-specific IDs
  showTypeId?: string | null;
  apparelTypeId?: string | null;

  // Required relationships
  brandId: string;
  categoryId: string;
  brand: TBrand;
  category: TCategory;

  // Optional relationships
  colors?: TColor[];
  effects?: TEffect[];
  unitProduct?: TUnitProduct | null;
  showType?: ShowType | null;
  apparelType?: ApparelType | null;

  // Product variants (for apparel)
  variants?: ProductVariant[];

  // Show-specific relationships
  showProducts?: ShowProduct[];

  // DEPRECATED: Keep for migration
  apparelProducts?: ApparelProduct[] | null;
}

// User and Auth Interfaces
export interface UserProfile {
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: Date | null;
  phoneNumber?: string | null;
  acceptedTerms: boolean;
  billingAddress?: TAddress;
  shippingAddress?: TAddress;
  canContact?: boolean;
  userId: string;
}

export interface TUser {
  id: string;
  role: "USER" | "MANAGER" | "ADMIN" | "MEMBER";
  email: string;
  lastLogin: string | null;
}

export interface User {
  id: string;
  role: string;
  email: string;
  hashedPassword: string;
  createdOn: string;
  lastLogin: string | null;
  profile: UserProfile;
}

// Cart Interfaces
export interface TCartProduct {
  id: string;
  caseQuantity: number;
  unitQuantity: number;
  cartId: string;
  productId: string;
  variantId?: string | null;
  variant?: ProductVariant | null;
  product: TProduct;
}

export interface TCart {
  id: string;
  userId?: string;
  cartProducts: TCartProduct[];
  user: TUser;
}

// Purchase Interfaces
export interface TPurchaseItem {
  id: string;
  purchaseId: string;
  productId: string;
  quantity: number;
  isUnit: boolean;
  itemSubTotal: number;
  variantId?: string | null;
  variant?: ProductVariant | null;
  product: TProduct;
}

// Report Interface
export interface Report {
  id: string;
  type: ReportType;
  name: string;
  description?: string;
  status: ReportStatus;
  createdAt: string;
  completedAt?: string | null;
  parameters?: Record<string, any>;
  createdBy: string;
  fileUrl?: string | null;
  errorMessage?: string | null;
}

// Terminal Interface
export interface TApprovedTerminal {
  id: string;
  acceptOutOfStateLicence: boolean;
  terminalName: string;
  businessRequired: boolean;
  address: TAddress;
  addressId: string;
  company: keyof typeof TerminalCompany;
}

// =============================================
// API REQUEST/RESPONSE TYPES
// =============================================

// Auth Types
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  token?: string;
  userInfo?: {
    email: string;
    role: "USER" | "MANAGER" | "ADMIN" | "MEMBER";
    profile?: UserProfile;
    Cart?: TCart;
  };
  message?: string;
}

export interface UserCreateRequest {
  email: string;
  password: string;
}

// API Response Types
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

export interface ProductsResponse {
  contents: TProduct[];
  hasMore: boolean;
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

export type UsersResponse = PaginatedResponse<User>;

// =============================================
// CREATE/UPDATE DATA TYPES
// =============================================

// Product Creation Types
export interface CreateProductData {
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
}

export interface UpdateProductData extends Partial<CreateProductData> {}

// Apparel Creation Types
export interface CreateApparelProductData {
  title: string;
  description?: string;
  image?: string;
  casePrice: string;
  inStock: boolean;
  package: string;
  brandId: string;
  categoryId: string;
  apparelTypeId: string;
  colors: string[];
  variants: {
    size: string;
    gender: "MALE" | "FEMALE" | "UNISEX";
    colorId?: string;
    unitPrice: string;
    availableStock?: number;
  }[];
}

export interface UpdateApparelData extends Partial<CreateApparelProductData> {}

// Variant Creation Types
export interface CreateVariantData {
  sku: string;
  productId: string;
  size: string;
  gender: "MALE" | "FEMALE" | "UNISEX";
  colorId?: string;
  unitPrice: string;
  availableStock?: number;
  additionalSku?: string;
  weight?: string;
  isActive?: boolean;
}

export interface UpdateVariantData extends Partial<CreateVariantData> {}

// Show Creation Types
export interface CreateShowProductData {
  productId: string;
  quantity: number;
  isUnit: boolean;
  notes?: string;
}

export interface CreateShowData {
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
}

export interface UpdateShowData extends Partial<CreateShowData> {}

// Cart API Types
export interface AddToCartParams {
  productId: string;
  cartId: string;
  isUnit: boolean;
  variantId?: string;
}

export interface UpdateQuantityParams {
  productId: string;
  cartId: string;
  quantity: number;
  isUnit: boolean;
  variantId?: string;
}

export interface RemoveFromCartParams {
  productId: string;
  cartId: string;
  variantId?: string;
}

// =============================================
// FILTER AND SPECIALIZED TYPES
// =============================================

export interface ProductFilters {
  page: number;
  pageSize: number;
  searchTitle?: string;
  selectedBrands?: string[];
  selectedCategories?: string[];
  selectedColors?: string[];
  selectedEffects?: string[];
  isShow?: boolean;
  isApparel?: boolean;
  inStock?: boolean;
}

export interface ApparelFilter {
  searchTitle: string;
  setSearchTitle: (value: string | []) => void;
  selectedBrands: string[];
  setSelectedBrands: (brand: string | []) => void;
  selectedCategories: string[];
  setSelectedCategories: (category: string | []) => void;
  selectedColors: string[];
  setSelectedColors: (color: string | []) => void;
  selectedApparelTypes: string[];
  setSelectedApparelTypes: (apparelType: string | []) => void;
  selectedGenders: string[];
  setSelectedGenders: (gender: string | []) => void;
  selectedSizes: string[];
  setSelectedSizes: (size: string | []) => void;
  isFetching: boolean;
  isPlaceholderData: boolean;
  showOutOfStock: boolean;
  setShowOutOfStock: (value: boolean) => void;
  setPage: (page: number) => void;
  page: number;
  hasMore: boolean;
  pageSize: number;
  setPageAmount: (amount: number) => void;
}

// Specialized Product Types
export type ShowWithProducts = TProduct & {
  isShow: true;
  showType: ShowType;
  showProducts: ShowProduct[];
};

export type TInventoryUnitProduct = TUnitProduct & {
  product: TProduct;
};

// =============================================
// ZOD SCHEMAS (Keep only for validation)
// =============================================

// Create string-based schemas instead of enums
export const EffectsSchema = z.string();
export const ColorsSchema = z.string();
export const CategorySchema = z.string();
export const BrandSchema = z.string();

// Create a Zod enum schema from the states enum
const StateEnum = z.nativeEnum(States);

const AddressSchema = z.object({
  id: z.string(),
  street1: z.string(),
  street2: z.string().nullable().optional(),
  city: z.string(),
  state: StateEnum,
  postalCode: z.string(),
});

export const UserProfileSchema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  dateOfBirth: z
    .string()
    .transform((str) => (str ? new Date(str) : null))
    .optional(),
  phoneNumber: z.string().nullable().optional(),
  acceptedTerms: z.boolean(),
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

export const ApparelTypeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});

export const TProductSchema = z.object({
  id: z.string(),
  sku: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  casePrice: z.string(),
  isShow: z.boolean().optional(),
  isApparel: z.boolean().optional(),
  apparelTypeId: z.string().nullable().optional(),
  apparelType: ApparelTypeSchema.nullable().optional(),
  isCaseBreakable: z.boolean(),
  inStock: z.boolean().optional(),
  showTypeId: z.string().nullable().optional(),
  category: z.object({ id: z.string(), name: z.string() }),
  brand: z.object({ id: z.string(), name: z.string() }),
  showType: ShowTypeSchema.nullable().optional(),
  colors: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  effects: z.array(z.object({ id: z.string(), name: z.string() })).optional(),
  image: z.string(),
  videoURL: z.string().url().nullable().optional(),
  package: z.array(z.number()),
  // Note: unitProduct, showProducts, variants would need recursive definitions
});

const CartProductSchema = z.object({
  id: z.string(),
  caseQuantity: z.number(),
  unitQuantity: z.number(),
  cartId: z.string(),
  productId: z.string(),
  variantId: z.string().nullable().optional(),
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
      email: z.string().email(),
      role: z.enum(["USER", "MANAGER", "ADMIN", "MEMBER"]),
      profile: UserProfileSchema.optional(),
      Cart: TCartSchema.optional(),
    })
    .optional(),
  message: z.string().optional(),
});

export const ReportSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(ReportType),
  name: z.string(),
  description: z.string().optional(),
  status: z.nativeEnum(ReportStatus),
  createdAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  parameters: z.record(z.string(), z.any()).optional(),
  createdBy: z.string(),
  fileUrl: z.string().nullable(),
  errorMessage: z.string().nullable(),
});

// Report configurations
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
