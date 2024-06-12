import { z } from "zod";

const States = {
  Alabama: "Alabama",
  Alaska: "Alaska",
  Arizona: "Arizona",
  Arkansas: "Arkansas",
  California: "California",
  Colorado: "Colorado",
  Connecticut: "Connecticut",
  Delaware: "Delaware",
  Florida: "Florida",
  Georgia: "Georgia",
  Hawaii: "Hawaii",
  Idaho: "Idaho",
  Illinois: "Illinois",
  Indiana: "Indiana",
  Iowa: "Iowa",
  Kansas: "Kansas",
  Kentucky: "Kentucky",
  Louisiana: "Louisiana",
  Maine: "Maine",
  Maryland: "Maryland",
  Massachusetts: "Massachusetts",
  Michigan: "Michigan",
  Minnesota: "Minnesota",
  Mississippi: "Mississippi",
  Missouri: "Missouri",
  Montana: "Montana",
  Nebraska: "Nebraska",
  Nevada: "Nevada",
  New_Hampshire: "New_Hampshire",
  New_Jersey: "New_Jersey",
  New_Mexico: "New_Mexico",
  New_York: "New_York",
  North_Carolina: "North_Carolina",
  North_Dakota: "North_Dakota",
  Ohio: "Ohio",
  Oklahoma: "Oklahoma",
  Oregon: "Oregon",
  Pennsylvania: "Pennsylvania",
  Rhode_Island: "Rhode_Island",
  South_Carolina: "South_Carolina",
  South_Dakota: "South_Dakota",
  Tennessee: "Tennessee",
  Texas: "Texas",
  Utah: "Utah",
  Vermont: "Vermont",
  Virginia: "Virginia",
  Washington: "Washington",
  West_Virginia: "West_Virginia",
  Wisconsin: "Wisconsin",
  Wyoming: "Wyoming",
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
