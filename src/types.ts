import { z } from "zod";

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

// Create a Zod enum schema from the states enum
const StateEnum = z.nativeEnum(States);

// Example of a schema that uses the StateEnum
const UserProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.date().optional(),
  phoneNumber: z.string().optional(),
  billingAddress: z
    .object({
      street1: z.string(),
      street2: z.string().optional(),
      city: z.string(),
      state: StateEnum,
      postalCode: z.string(),
    })
    .optional(),
  shippingAddress: z
    .object({
      street1: z.string(),
      street2: z.string().optional(),
      city: z.string(),
      state: StateEnum,
      postalCode: z.string(),
    })
    .optional(),
  canContact: z.boolean().optional(),
  userId: z.string(),
});
const TUserSchema = z.object({
  id: z.string(),
  role: z.enum(["USER", "MANAGER", "ADMIN"]),
  email: z.string().email(),
  lastLogin: z.string().datetime(),
});

export const TProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  casePrice: z.coerce.number(),
  unitPrice: z.number().nullable(),
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
  package: z.number().array(),
});

const CartProductSchema = z.object({
  id: z.string(),
  quantity: z.number(),
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
      lastLogin: z.string().datetime(),
      Cart: TCartSchema,
    })
    .optional(),
  message: z.string().optional(), // Assuming the message might be included in the response
});

type SignInRequest = z.infer<typeof SignInRequestSchema>;
type SignInResponse = z.infer<typeof SignInResponseSchema>;
type UserCreateRequest = z.infer<typeof createUserRequestSchema>;
type User = z.infer<typeof SignInResponseSchema>;
type UserProfile = z.infer<typeof UserProfileSchema>;
type TProduct = z.infer<typeof TProductSchema>;
type TCartProduct = z.infer<typeof CartProductSchema>;
type TCart = z.infer<typeof TCartSchema>;
export type {
  SignInRequest,
  SignInResponse,
  UserCreateRequest,
  User,
  UserProfile,
  TProduct,
  TCartProduct,
  TCart,
};
