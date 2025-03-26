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
