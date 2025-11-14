import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "react-toastify";
import { createUser } from "../api/users/auth.api";
import type { UserCreateRequest } from "../types";
import {
	validateEmailInput,
	validatePasswordInput,
} from "../utils/validationUtils";
import { PasswordIconSwap } from "./component-parts/showPasswordSwap";

export const RegisterUser = () => {
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const navigate = useNavigate();

	const passwordValidState = validatePasswordInput(password);
	const confirmedPassword = password === confirmPassword;
	const emailValidState = validateEmailInput(email);

	const passwordErrorMessage =
		isSubmitted && !passwordValidState.success
			? passwordValidState.error?.flatten().formErrors[0]
			: null;

	const emailErrorMessage =
		isSubmitted && !emailValidState.success
			? emailValidState.error?.flatten().formErrors[0]
			: null;

	const confirmPasswordErrorMessage =
		isSubmitted && !confirmedPassword ? "Passwords must match exactly" : null;

	const mutation = useMutation({
		mutationKey: ["createUser"],
		mutationFn: (body: UserCreateRequest) => createUser(body),
		onSuccess: () => {
			setIsSubmitted(false);
			toast.success("Account created successfully! Please log in.");
			navigate({ to: "/user/login" });
		},
		onError: (error) => {
			toast.error(error.message || "Registration failed. Please try again.");
		},
	});

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitted(true);

		const requestBody: UserCreateRequest = { password, email };
		if (
			emailValidState.success &&
			passwordValidState.success &&
			confirmedPassword
		) {
			mutation.mutate(requestBody);
		}
	};

	return (
		<div className="flex min-h-screen bg-base-200 justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8 bg-base-100 p-8 rounded-lg shadow-lg">
				<div className="text-center">
					<img
						src="/imgs/crew-logo-square.png"
						className="h-24 mx-auto"
						alt="Crew Fireworks Logo"
					/>
					<h2 className="mt-6 text-3xl font-bold text-base-content">
						Create your account
					</h2>
					<p className="mt-2 text-sm text-base-content/70">
						Join us to access exclusive deals on premium brands
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
									autoComplete="new-password"
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
						</div>

						{/* Confirm Password Field */}
						<div>
							<label className="floating-label relative">
								<span>Confirm Password</span>
								<input
									name="confirmPassword"
									type={showPassword ? "text" : "password"}
									autoComplete="new-password"
									className={`input input-bordered w-full pr-10 ${
										confirmPasswordErrorMessage ? "input-error" : ""
									}`}
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
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
							{confirmPasswordErrorMessage && (
								<p className="validator-hint mt-1">
									{confirmPasswordErrorMessage}
								</p>
							)}
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
									Creating Account...
								</>
							) : (
								<>
									Create Account
									<FontAwesomeIcon icon={faRightToBracket} />
								</>
							)}
						</button>
					</div>

					<div className="text-center mt-4">
						<span className="text-base-content/70">
							Already have an account?
						</span>
						<Link
							to="/user/login"
							className="ml-2 text-primary hover:underline"
						>
							Sign in
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};
