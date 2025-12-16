import {
	faEnvelope,
	faLocationDot,
	faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/contact-us")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-center mb-8 text-primary">
				Contact Us
			</h1>

			<div className="max-w-4xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div className="bg-base-100 p-6 rounded-lg shadow-md">
						<h2 className="text-2xl font-semibold mb-6 text-secondary">
							Get In Touch
						</h2>

						<div className="space-y-4 mb-6">
							<div className="flex items-center">
								<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-4">
									<FontAwesomeIcon icon={faPhone} className="text-base-100" />
								</div>
								<div>
									<p className="text-sm text-base-content/70">Phone</p>
									<p className="font-medium">
										<a href="tel:+17012696703">+1 (701) 269-6703</a>
									</p>
								</div>
							</div>

							<div className="flex items-center">
								<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-4">
									<FontAwesomeIcon
										icon={faEnvelope}
										className="text-base-100"
									/>
								</div>
								<div>
									<p className="text-sm text-base-content/70">Email</p>
									<p className="font-medium">
										<a href="mailto:lucas@crewfireworks.com">
											lucas@crewfireworks.com
										</a>
									</p>
								</div>
							</div>

							<div className="flex items-center">
								<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-4">
									<FontAwesomeIcon
										icon={faLocationDot}
										className="text-base-100"
									/>
								</div>
								<div>
									<p className="text-sm text-base-content/70">Location</p>
									<p className="font-medium">North Dakota, USA 🇺🇸</p>
								</div>
							</div>
						</div>

						<div className="bg-base-200 p-4 rounded-lg">
							<h3 className="font-semibold mb-2">Business Hours</h3>
							<p className="text-sm mb-1">
								Monday - Friday: 9:00 AM - 5:00 PM CST
							</p>
							<p className="text-sm">
								Weekends & Holidays: Responses may be delayed
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
