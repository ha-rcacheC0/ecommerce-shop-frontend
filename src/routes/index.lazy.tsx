import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@providers/auth.provider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFireFlameCurved,
  faStarOfLife,
  faRocket,
  faArrowRight,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { authState } = useAuth();

  return (
    <div className="bg-base-100 min-h-screen">
      {/* Main Hero Section */}
      <div className="bg-gradient-to-br from-primary via-secondary to-accent py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center text-center text-primary-content">
            <h1 className="text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="block">Crew Fireworks</span>
              <span className="block text-4xl lg:text-5xl font-semibold opacity-90">
                Best Quality • Better Prices
              </span>
            </h1>

            <p className="text-xl lg:text-2xl mb-8 max-w-3xl opacity-90">
              Your premier destination for professional-grade fireworks,
              featuring exclusive collections and unbeatable wholesale prices.
            </p>

            {authState !== "authenticated" && (
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link
                  className="btn btn-lg bg-white text-primary hover:bg-gray-100 border-none shadow-lg"
                  to="/user/register"
                >
                  <FontAwesomeIcon icon={faStarOfLife} className="mr-2" />
                  Create Account
                </Link>
                <Link
                  className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary"
                  to="/user/login"
                >
                  Existing User Sign In
                </Link>
              </div>
            )}

            {/* Quick Navigation */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/products"
                search={{ page: 1, pageSize: 25 }}
                className="btn btn-sm btn-ghost text-primary-content hover:bg-white/20"
              >
                <FontAwesomeIcon icon={faFireFlameCurved} className="mr-1" />
                All Fireworks
              </Link>
              <Link
                to="/shows"
                className="btn btn-sm btn-ghost text-primary-content hover:bg-white/20"
              >
                <FontAwesomeIcon icon={faRocket} className="mr-1" />
                Fireworks Shows
              </Link>
              <Link
                to="/apparel"
                className="btn btn-sm btn-ghost text-primary-content hover:bg-white/20"
              >
                🎽 Apparel
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cody B Banner */}
      <div className="py-16 bg-gradient-to-tr from-primary via-secondary to-accent relative overflow-hidden">
        {/* Animated Background Elements */}

        <div className="container mx-auto px-2 relative z-10 bg-white/30 backdrop-blur-md rounded-lg py-6  shadow-md ">
          <div className="text-center text-white mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-4">
              <FontAwesomeIcon icon={faStar} className="text-yellow-300" />
              <span className="font-semibold">FEATURED COLLECTION</span>
              <FontAwesomeIcon icon={faStar} className="text-yellow-300" />
            </div>

            <h2 className="text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Cody B
              </span>
              <br />
              <span className="text-3xl lg:text-4xl font-semibold">
                Premium Fireworks Collection
              </span>
            </h2>

            <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Discover the exclusive Cody B line featuring premium-grade
              fireworks and spectacular show packages. Quality that
              professionals trust.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Products Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="text-6xl mb-4">🎆</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Cody B Products
                </h3>
                <p className="text-gray-600 mb-6">
                  Premium individual fireworks with unmatched quality and
                  stunning effects. Perfect for creating your own custom
                  displays.
                </p>
                <div className="flex justify-center gap-2 mb-6">
                  <span className="badge badge-primary">Premium Quality</span>
                  <span className="badge badge-secondary">
                    Professional Grade
                  </span>
                </div>
                <Link
                  to="/codyb"
                  search={{ tab: "products" }}
                  className="btn btn-primary btn-wide group"
                >
                  Shop Products
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>

            {/* Shows Card */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <div className="text-center">
                <div className="text-6xl mb-4">🎪</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Cody B Shows
                </h3>
                <p className="text-gray-600 mb-6">
                  Professionally curated fireworks shows designed for maximum
                  impact. Complete packages ready for any celebration.
                </p>
                <div className="flex justify-center gap-2 mb-6">
                  <span className="badge badge-accent">Ready to Fire</span>
                  <span className="badge badge-info">Complete Shows</span>
                </div>
                <Link
                  to="/codyb"
                  search={{ tab: "shows" }}
                  className="btn btn-secondary btn-wide group"
                >
                  Browse Shows
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Special Offer Badge */}
          <div className="text-center mt-12">
            <div className="inline-block bg-yellow-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg shadow-lg transform rotate-2 hover:rotate-0 transition-transform">
              🔥 Wholesale Pricing Available • Professional Discounts 🔥
            </div>
          </div>
        </div>
      </div>

      {/* Quick Features Section */}
      <div className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Crew Fireworks?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold mb-3">Premium Brands</h3>
              <p className="text-gray-600">
                Featuring exclusive collections from top experts like Cody B,
                ensuring quality and reliability in every product.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-3">Wholesale Pricing</h3>
              <p className="text-gray-600">
                Get professional-grade fireworks at unbeatable wholesale prices.
                Volume discounts available for larger orders.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-3">Fast Shipping</h3>
              <p className="text-gray-600">
                Quick and secure shipping nationwide with specialized handling
                for all pyrotechnic products.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      {authState !== "authenticated" && (
        <div className="py-16 bg-primary text-primary-content">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers and unlock exclusive pricing
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                className="btn btn-lg bg-white text-primary hover:bg-gray-100 border-none"
                to="/user/register"
              >
                Create Free Account
              </Link>
              <Link
                className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary"
                to="/products"
                search={{ page: 1, pageSize: 25 }}
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
