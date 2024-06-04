import { z } from "zod";

export type TProduct = {
  id: string;
  title: string;
  description: string;
  casePrice: string;
  image: string;
  package: number[];
};

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
    })
    .optional(),
  message: z.string().optional(), // Assuming the message might be included in the response
});

type SignInRequest = z.infer<typeof SignInRequestSchema>;
type SignInResponse = z.infer<typeof SignInResponseSchema>;
type UserCreateRequest = z.infer<typeof createUserRequestSchema>;
type User = z.infer<typeof SignInResponseSchema>;

export type { SignInRequest, SignInResponse, UserCreateRequest, User };
