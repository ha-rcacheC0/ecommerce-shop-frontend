import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/fireworks-safety")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-center mb-8 text-primary">
				Fireworks Safety
			</h1>

			<div className="max-w-4xl mx-auto bg-base-100 p-6 rounded-lg shadow-md">
				<p className="mb-6 text-lg">
					Please view the videos below as there are certain safety standards we
					like to practice to help keep everyone safe.
				</p>

				<p className="mb-8 text-lg">
					Although there's many factors unique to everyone's situation taking
					some basic safety precautions can help ensure everyone is safe while
					also having a good time.
				</p>

				<div className="bg-base-200 p-6 rounded-lg mb-8">
					<h2 className="text-2xl font-semibold mb-4 text-secondary">
						Essential Safety Guidelines
					</h2>

					<ul className="space-y-4 list-disc pl-6">
						<li>
							First and foremost make sure all fireworks are facing right side
							up and on a solid foundation that has a good base.
						</li>

						<li>
							Ensure there are no wires above you or things to the sides of
							performance based cakes with audience indicators, better know as
							"Fan Effects" on our website.
						</li>

						<li>
							When you've ensured the fireworks foundation is secure and nothing
							is above you we recommend putting a few bricks or blocks on the
							sides to ensure products don't tip when they fire.
						</li>

						<li>
							Don't let a products small size deceive you as these can cause the
							most trouble as they contain the fire power but don't always have
							enough weight to secure itself to the ground and they can even
							jump and tip.
						</li>

						<li>
							Through the years we've done quality control to not reorder those
							products but it's always good to take precautions.
						</li>
					</ul>
				</div>

				<div className="mb-12">
					<h2 className="text-2xl font-semibold mb-6 text-secondary">
						Safety Videos
					</h2>

					<p className="mb-4">
						We recommend watching these safety videos before handling and using
						fireworks:
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Video placeholders - in a real implementation, these would be actual embedded videos */}
						<div className="aspect-video bg-base-300 flex items-center justify-center rounded-lg">
							<div className="text-center p-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-12 w-12 mx-auto mb-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<p>Fireworks Safety Basics</p>
							</div>
						</div>

						<div className="aspect-video bg-base-300 flex items-center justify-center rounded-lg">
							<div className="text-center p-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-12 w-12 mx-auto mb-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								<p>Safe Fireworks Setup Guide</p>
							</div>
						</div>
					</div>
				</div>

				<div className="mb-12">
					<h2 className="text-2xl font-semibold mb-4 text-secondary">
						Additional Safety Tips
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="card bg-base-200">
							<div className="card-body">
								<h3 className="card-title">Before the Show</h3>
								<ul className="list-disc pl-4 space-y-2">
									<li>
										Check your local laws and regulations regarding fireworks
									</li>
									<li>Keep a bucket of water or garden hose nearby</li>
									<li>Clear the area of flammable materials</li>
									<li>Keep spectators at a safe distance</li>
									<li>Never allow children to handle fireworks</li>
								</ul>
							</div>
						</div>

						<div className="card bg-base-200">
							<div className="card-body">
								<h3 className="card-title">During and After</h3>
								<ul className="list-disc pl-4 space-y-2">
									<li>Light one firework at a time</li>
									<li>Never relight a "dud" firework</li>
									<li>Wear eye protection when lighting fireworks</li>
									<li>Wait 20 minutes before handling used fireworks</li>
									<li>Dispose of spent fireworks by soaking in water</li>
								</ul>
							</div>
						</div>
					</div>
				</div>

				<div className="alert alert-warning">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="stroke-current shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
					<div>
						<h3 className="font-bold">Important Safety Reminder</h3>
						<div className="text-sm">
							Fireworks are designed for outdoor use only and should always be
							handled with care. Never attempt to modify, disassemble, or make
							your own fireworks. Always follow all safety instructions on the
							packaging.
						</div>
					</div>
				</div>

				<div className="mt-8 text-center">
					<Link
						to="/products"
						className="btn btn-primary"
						search={{ page: 1, pageSize: 25 }}
					>
						Browse Our Products
					</Link>
				</div>
			</div>
		</div>
	);
}
