import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <div className="flex w-4/5 flex-col  text-center p-6 mx-auto rounded-lg">
        <h1 className="text-7xl text-primary-content">
          Crew Fireworks
          <br />
          Best Quality
          <br />
          Better Prices
        </h1>
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
      </div>
    </>
  );
}
