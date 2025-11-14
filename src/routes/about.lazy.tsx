import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/about")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-center mb-8 text-primary">
				About Crew Fireworks
			</h1>

			<div className="max-w-3xl mx-auto bg-base-100 p-6 rounded-lg shadow-md">
				<p className="mb-6 text-lg">
					CrewFireworks.com is over 12 years in the making of getting you, the
					customer, the overall best quality fireworks at a better price on
					every single order as conveniently as possible. Special thank you to
					everyone that helped get our business this far by supporting Crew
					Fireworks at our physical locations throughout the years.
				</p>

				<p className="mb-6 text-lg">
					In return as a way of showing our appreciation we're offering our
					lowest price to every customer, on every order, every time.
					CrewFireworks.com is online orders only with no more physical
					locations and we will be releasing several new features on our website
					as we continue to grow.
				</p>

				<p className="text-lg text-center font-semibold text-primary">
					Be safe, enjoy responsibly and God bless America.
				</p>

				<div className="flex justify-center mt-8">
					<img
						src="/imgs/crew-logo.png"
						alt="Crew Fireworks"
						className="max-w-xs"
					/>
				</div>

				<div className="mt-8 text-center">
					<Link
						to="/products"
						search={{ page: 1, pageSize: 25 }}
						className="btn btn-primary"
					>
						Shop Our Products
					</Link>
				</div>
			</div>
		</div>
	);
}
