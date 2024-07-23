import { createLazyFileRoute } from "@tanstack/react-router";
import { useAuth } from "../providers/auth.provider";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { authState } = useAuth();
  return (
    <div className="h-svh">
      <div className="flex w-4/5 flex-col text-center p-6  mx-auto justify-center items-center rounded-lg">
        <h1 className="text-7xl text-primary-content">
          Crew Fireworks
          <br />
          Best Quality
          <br />
          Better Prices
        </h1>
        {authState !== "authenticated" && (
          <>
            <p className="text-4xl text-secondary-content ">
              Sign-in to get the best deals
              <br /> on the best brands.
            </p>
            <div className="banner-links flex mx-auto mt-4 gap-4 justify-center ">
              <a className="btn btn-primary " href="/user/register">
                Create Account
              </a>
              <a className="btn btn-secondary" href="/user/login">
                Sign In
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
