import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "react-toastify";
import {
	type ForgotPasswordRequest,
	forgotPassword,
} from "../api/users/auth.api";
import { validateEmailInput } from "../utils/validationUtils";

export const ForgotPasswordForm = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const emailValidState = validateEmailInput(email);

	const emailErrorMessage =
		isSubmitted && !emailValidState.success
			? emailValidState.error?.flatten().formErrors[0]
			: null;

	const mutation = useMutation({
		mutationKey: ["forgotPassword"],
		mutationFn: (body: ForgotPasswordRequest) => forgotPassword(body),
		onSuccess: () => {
			setEmailSent(true);
			toast.success(
				"If an account exists, a password reset link has been sent.",
			);
		},
		onError: () => {
			// Even on error, show success message to prevent email enumeration
			setEmailSent(true);
			toast.success(
				"If an account exists, a password reset link has been sent.",
			);
		},
	});

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitted(true);

		if (emailValidState.success) {
			mutation.mutate({ email });
		}
	};

	if (emailSent) {
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
							Check Your Email
						</h2>
						<p className="mt-4 text-base-content/70">
							If an account exists with the email <strong>{email}</strong>,
							we've sent a password reset link. The link will expire in 1 hour.
						</p>
						<p className="mt-4 text-sm text-base-content/50">
							Didn't receive the email? Check your spam folder or try again.
						</p>
					</div>

					<div className="space-y-4">
						<button
							onClick={() => {
								setEmailSent(false);
								setIsSubmitted(false);
							}}
							className="btn btn-outline w-full"
						>
							Try Again
						</button>
						<Link to="/user/login" className="btn btn-primary w-full">
							Back to Sign In
						</Link>
					</div>
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
						Forgot Password
					</h2>
					<p className="mt-2 text-sm text-base-content/70">
						Enter your email address and we'll send you a link to reset your
						password.
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
									Sending...
								</>
							) : (
								<>
									Send Reset Link
									<FontAwesomeIcon icon={faEnvelope} />
								</>
							)}
						</button>
					</div>

					<div className="text-center mt-4">
						<span className="text-base-content/70">
							Remember your password?
						</span>
						<Link
							to="/user/login"
							className="ml-2 text-primary hover:underline"
						>
							Sign In
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
};
