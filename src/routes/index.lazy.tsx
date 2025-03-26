import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "../providers/auth.provider";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { authState } = useAuth();
  return (
    <div className="bg-base-100 py-10">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl text-primary leading-14 font-semibold tracking-tight">
          Crew Fireworks
          <br />
          Best Quality
          <br />
          Better Prices
        </h1>
        {authState !== "authenticated" && (
          <>
            <p className="text-2xl text-secondary mt-2 leading-7 font-semibold tracking-tight">
              Sign-in for epic deals on
              <br />
              premium brands.
            </p>
            <div className="flex mt-2 gap-4 items-center  ">
              <Link className="btn btn-primary btn-outline" to="/user/register">
                Create Account
              </Link>
              <Link className="btn btn-secondary btn-outline" to="/user/login">
                Existing User
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
console.log(<Link>hello</Link>);
