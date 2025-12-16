import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { Link, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "react-toastify";
import {
	type ResetPasswordRequest,
	resetPassword,
} from "../api/users/auth.api";
import { validatePasswordInput } from "../utils/validationUtils";
import { PasswordIconSwap } from "./component-parts/showPasswordSwap";

export const ResetPasswordForm = () => {
	const { token } = useSearch({ from: "/user/reset-password" });
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [resetComplete, setResetComplete] = useState(false);

	const passwordValidState = validatePasswordInput(password);

	const passwordErrorMessage =
		isSubmitted && !passwordValidState.success
			? passwordValidState.error?.flatten().formErrors[0]
			: null;

	const confirmPasswordError =
		isSubmitted && password !== confirmPassword
			? "Passwords do not match"
			: null;

	const mutation = useMutation({
		mutationKey: ["resetPassword"],
		mutationFn: (body: ResetPasswordRequest) => resetPassword(body),
		onSuccess: () => {
			setResetComplete(true);
			toast.success("Password has been reset successfully!");
		},
		onError: (error: Error) => {
			toast.error(
				error.message ||
					"Failed to reset password. The link may be expired or invalid.",
			);
		},
	});

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitted(true);

		if (passwordValidState.success && password === confirmPassword && token) {
			mutation.mutate({ token, newPassword: password });
		}
	};

	// No token provided
	if (!token) {
		return (
			<div className="flex min-h-screen bg-base-200 justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-md space-y-8 bg-base-100 p-8 rounded-lg shadow-lg">
					<div className="text-center">
						<img
							src="/imgs/crew-logo.png"
							className="h-24 mx-auto"
							alt="Crew Fireworks Logo"
						/>
						<h2 className="mt-6 text-3xl font-bold text-error">
							Invalid Reset Link
						</h2>
						<p className="mt-4 text-base-content/70">
							This password reset link is invalid or has expired. Please request
							a new one.
						</p>
					</div>

					<div className="space-y-4">
						<Link to="/user/forgot-password" className="btn btn-primary w-full">
							Request New Link
						</Link>
						<Link to="/user/login" className="btn btn-outline w-full">
							Back to Sign In
						</Link>
					</div>
				</div>
			</div>
		);
	}

	// Password reset complete
	if (resetComplete) {
		return (
			<div className="flex min-h-screen bg-base-200 justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-md space-y-8 bg-base-100 p-8 rounded-lg shadow-lg">
					<div className="text-center">
						<img
							src="/imgs/crew-logo.png"
							className="h-24 mx-auto"
							alt="Crew Fireworks Logo"
						/>
						<h2 className="mt-6 text-3xl font-bold text-success">
							Password Reset Complete
						</h2>
						<p className="mt-4 text-base-content/70">
							Your password has been successfully reset. You can now sign in
							with your new password.
						</p>
					</div>

					<Link to="/user/login" className="btn btn-primary w-full">
						Sign In
					</Link>
				</div>
			</div>
		);
	}

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
						Reset Your Password
					</h2>
					<p className="mt-2 text-sm text-base-content/70">
						Enter your new password below. Make sure it's at least 8 characters.
					</p>
				</div>

				<form onSubmit={handleSubmit} className="mt-8 space-y-6">
					<div className="space-y-4">
						{/* New Password Field */}
						<div>
							<label className="floating-label relative">
								<span>New Password</span>
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
									type={showConfirmPassword ? "text" : "password"}
									autoComplete="new-password"
									className={`input input-bordered w-full pr-10 ${
										confirmPasswordError ? "input-error" : ""
									}`}
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
								/>
								<button
									type="button"
									className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								>
									<PasswordIconSwap
										showPassword={showConfirmPassword}
										setShowPassword={setShowConfirmPassword}
									/>
								</button>
							</label>
							{confirmPasswordError && (
								<p className="validator-hint mt-1">{confirmPasswordError}</p>
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
									Resetting...
								</>
							) : (
								<>
									Reset Password
									<FontAwesomeIcon icon={faKey} />
								</>
							)}
						</button>
					</div>

					<div className="text-center mt-4">
						<Link to="/user/login" className="text-primary hover:underline">
							Back to Sign In
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};
