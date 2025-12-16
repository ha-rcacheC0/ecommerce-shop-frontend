import * as Sentry from "@sentry/react";
import { Component, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	domain: "cart" | "profile" | "products" | "admin" | "general";
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
}

export class DomainErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Log to Sentry with domain tag
		Sentry.withScope((scope) => {
			scope.setTag("domain", this.props.domain);
			scope.setContext("errorInfo", {
				componentStack: errorInfo.componentStack,
			});
			Sentry.captureException(error);
		});
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback || (
					<div className="alert alert-error">
						<div>
							<h3>Something went wrong in the {this.props.domain} section</h3>
							<p>We've been notified and are looking into it.</p>
							<button
								type="button"
								className="btn btn-primary mt-4"
								onClick={() => window.location.reload()}
							>
								Reload Page
							</button>
						</div>
					</div>
				)
			);
		}

		return this.props.children;
	}
}
