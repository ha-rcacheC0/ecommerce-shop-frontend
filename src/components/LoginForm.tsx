import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { flushSync } from "react-dom";
import { toast } from "react-toastify";
import { signInUser } from "../api/users/auth.api";
import { useAuth } from "../providers/auth.provider";
import type { SignInRequest } from "../types";
import {
	validateEmailInput,
	validatePasswordInput,
} from "../utils/validationUtils";
import { PasswordIconSwap } from "./component-parts/showPasswordSwap";

export const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const emailValidState = validateEmailInput(email);
	const passwordValidState = validatePasswordInput(password);
	const navigate = useNavigate();
	const authContext = useAuth();

	const emailErrorMessage =
		isSubmitted && !emailValidState.success
			? emailValidState.error?.flatten().formErrors[0]
			: null;

	const passwordErrorMessage =
		isSubmitted && !passwordValidState.success
			? passwordValidState.error?.flatten().formErrors[0]
			: null;

	const mutation = useMutation({
		mutationKey: ["signInUser"],
		mutationFn: (body: SignInRequest) => signInUser(body),
		onSuccess: (data) => {
			if (!data.token && !data.userInfo) {
				throw new Error(data.message);
			} else {
				flushSync(() => {
					if (data.token && data.userInfo) {
						localStorage.setItem("user", JSON.stringify(data));
						authContext.login(data);
					}
				});
			}
			setIsSubmitted(false);
			navigate({ to: "/products", search: { page: 1, pageSize: 25 } });
		},
		onError: (error) => {
			toast.error(
				error.message || "Sign in failed. Please check your credentials.",
			);
		},
	});

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitted(true);

		if (emailValidState.success && passwordValidState.success) {
			const requestBody: SignInRequest = { email, password };
			mutation.mutate(requestBody);
		}
	};

	return (
		<div className="flex min-h-screen bg-base-200 justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8 bg-base-100 p-8 rounded-lg shadow-lg">
				<div className="text-center">
					<img
						src="/imgs/crew-logo.png"
						className="h-24 mx-auto"
						alt="Crew Fireworks Logo"
					/>
					<h2 className="mt-6 text-3xl font-bold text-base-content">
						Sign in to your account
					</h2>
					<p className="mt-2 text-sm text-base-content/70">
						Access your account to view our premium fireworks selection
					</p>
				</div>

				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					<div className="space-y-4">
						{/* Email Field */}
						<div>
							<label className="floating-label">
								<span>Email Address</span>
								<input
									name="email"
									type="email"
									autoComplete="email"
									className={`input input-bordered w-full ${
										emailErrorMessage ? "input-error" : ""
									}`}
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</label>
							{emailErrorMessage && (
								<p className="validator-hint mt-1">{emailErrorMessage}</p>
							)}
						</div>

						{/* Password Field */}
						<div>
							<label className="floating-label relative">
								<span>Password</span>
								<input
									name="password"
									type={showPassword ? "text" : "password"}
									autoComplete="current-password"
									className={`input input-bordered w-full pr-10 ${
										passwordErrorMessage ? "input-error" : ""
									}`}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<button
									type="button"
									className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70"
									onClick={() => setShowPassword(!showPassword)}
								>
									<PasswordIconSwap
										showPassword={showPassword}
										setShowPassword={setShowPassword}
									/>
								</button>
							</label>
							{passwordErrorMessage && (
								<p className="validator-hint mt-1">{passwordErrorMessage}</p>
							)}
							<div className="text-right mt-1">
								<Link
									to="/user/forgot-password"
									className="text-sm text-primary hover:underline"
								>
									Forgot password?
								</Link>
							</div>
						</div>
					</div>

					<div>
						<button
							type="submit"
							className="btn btn-primary w-full"
							disabled={mutation.isPending}
						>
							{mutation.isPending ? (
								<>
									<span className="loading loading-spinner loading-sm"></span>
									Signing In...
								</>
							) : (
								<>
									Sign In
									<FontAwesomeIcon icon={faRightToBracket} />
								</>
							)}
						</button>
					</div>

					<div className="text-center mt-4">
						<span className="text-base-content/70">Don't have an account?</span>
						<Link
							to="/user/register"
							className="ml-2 text-primary hover:underline"
						>
							Create Account
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};
