import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "../providers/auth.provider";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { authState } = useAuth();
  return (
    <div className="border-2 bg-slate-100 py-10">
      <div className="border-4 flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl text-[#bf0a30] font-semibold tracking-tight ">
          Crew Fireworks
          <br />
          Best Quality
          <br />
          Better Prices
        </h1>
        {authState !== "authenticated" && (
          <>
            <p className="text-2xl text-[#002868] mt-1 font-semibold tracking-tight">
              Sign-in for epic deals
              <br /> on premium brands.
            </p>
            <div className="flex mt-3 gap-4 items-center  ">
              <Link
                className="text-lg font-semibold text-[#bf0a30] border-3 border-[#bf0a30] rounded-xs p-2 hover:bg-[#bf0a30] hover:text-slate-100"
                to="/user/register"
              >
                Create Account
              </Link>
              <Link
                className="text-lg font-semibold text-[#002868] border-3 border-[#002868] rounded-xs p-2 hover:bg-[#002868] hover:text-slate-100"
                to="/user/login"
              >
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
console.log(<Link>hello</Link>);
