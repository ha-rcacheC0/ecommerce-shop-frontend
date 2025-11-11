import { TAddress } from "@/types";
import { ZodError, ZodSchema, z } from "zod";

type ValidationResult<T> = { success: boolean; data?: T; error?: ZodError<T> };

// Generic validation function
const validateInput = <T>(
  schema: ZodSchema<T>,
  input: T
): ValidationResult<T> => {
  const result = schema.safeParse(input);
  if (!result.success) {
    return { success: false, error: result.error };
  } else {
    return { success: true, data: input };
  }
};

// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export const validationSchema = z.object({
  username: z.string().min(3, { message: "Must have at least 3 characters" }),
  email: z
    .string()
    .min(4, { message: "Must have at least 4 characters" })
    .email({
      message: "Must be a valid email",
    }),
  password: z
    .string()
    .min(1, { message: "Must have at least 1 character" })
    .regex(passwordValidation, {
      message: "Your password is not valid",
    }),
});

const validateUsernameSchema = z
  .string()
  .min(3, { message: "Must have at least 3 characters" });
const validatePasswordSchema = z
  .string()
  .min(1, { message: "Must have at least 1 character" })
  .regex(passwordValidation, {
    message:
      "Your password must contain at least 1 capital, lowercase, number & special character #?!@$%^&*-",
  });
const validateEmailSchema = z.string().email("invalid email");

export const validateUsernameInput = (username: string) =>
  validateInput(validateUsernameSchema, username);
export const validatePasswordInput = (password: string) =>
  validateInput(validatePasswordSchema, password);
export const validateEmailInput = (email: string) =>
  validateInput(validateEmailSchema, email);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isObjectEmpty(obj: any) {
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key) && obj[key] !== "") {
      return false;
    }
  }
  return true;
}

export function isAddressComplete(
  address: TAddress | undefined | null
): boolean {
  if (!address) return false;

  // Check that all required fields are present and not empty
  return !!(
    address.street1?.trim() &&
    address.city?.trim() &&
    address.state?.trim() &&
    address.postalCode?.trim()
  );
}

// Zod schema for complete address validation
export const completeAddressSchema = z.object({
  id: z.string(),
  street1: z.string().min(1, "Street address is required"),
  street2: z.string().nullable().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(5, "Postal code is required"),
});

export function isAddressEmpty(address: TAddress | undefined | null): boolean {
  if (!address) return true;

  // Address is considered empty if all required fields are empty or just whitespace
  return !(
    address.street1?.trim() ||
    address.city?.trim() ||
    address.postalCode?.trim()
  );
  // Note: We don't check state here since it might have a default value
}

// Check if address has partial data (some fields filled, others empty)
export function isAddressPartial(
  address: TAddress | undefined | null
): boolean {
  if (!address) return false;

  const hasStreet = !!address.street1?.trim();
  const hasCity = !!address.city?.trim();
  const hasPostal = !!address.postalCode?.trim();

  // Partial if some but not all required fields are filled
  const filledFields = [hasStreet, hasCity, hasPostal].filter(Boolean).length;
  return filledFields > 0 && filledFields < 3;
}

// Comprehensive address validation
export function validateAddress(address: TAddress | undefined | null): {
  isValid: boolean;
  isEmpty: boolean;
  isPartial: boolean;
  isComplete: boolean;
  message?: string;
} {
  const isEmpty = isAddressEmpty(address);
  const isPartial = isAddressPartial(address);
  const isComplete = isAddressComplete(address);

  if (isEmpty) {
    return {
      isValid: true,
      isEmpty: true,
      isPartial: false,
      isComplete: false,
    };
  }

  if (isPartial) {
    return {
      isValid: false,
      isEmpty: false,
      isPartial: true,
      isComplete: false,
      message:
        "Please complete all required address fields (street, city, postal code)",
    };
  }

  if (isComplete) {
    return {
      isValid: true,
      isEmpty: false,
      isPartial: false,
      isComplete: true,
    };
  }

  return {
    isValid: false,
    isEmpty: false,
    isPartial: false,
    isComplete: false,
    message: "Invalid address format",
  };
}
