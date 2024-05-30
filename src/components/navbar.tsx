import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
  SignUpButton,
} from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";

export const Navbar = () => {
  const MenuButton = () => {
    return (
      <div tabIndex={0} role="button" className="btn btn-ghost md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>
      </div>
    );
  };

  return (
    <>
      <div className="navbar bg-base-300">
        <div className="nav-start flex-1">
          <div className="dropdown">
            <MenuButton />
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to={"/products"}>Fireworks</Link>
                <ul className="p-2">
                  <li>
                    <Link to={"/products/shows"}>Shows</Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to={"/events"}>Events</Link>
                <ul className="p-2">
                  <li>
                    <Link to={"/events/new-years"}>New Years</Link>
                  </li>
                  <li>
                    <Link to={"/events/fourth-july"}>Fourth of July</Link>
                  </li>
                  <li>
                    <Link to={"/events/gender-reveal"}>Gender Reveal</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <Link to={"/"} className="btn btn-link ">
            <img
              className="w-40"
              src="/imgs/crew-logo.png"
              alt="company logo"
            ></img>
          </Link>
        </div>
        <div className="navbar-center hidden md:flex flex-1 justify-center">
          <ul tabIndex={0} className="menu menu-horizontal  mt-3 px-1">
            <li>
              <details>
                <summary>
                  <Link to={"/products"}>Fireworks</Link>
                </summary>
                <ul className="p-2">
                  <li>
                    <Link to={"/products/shows"}>Shows</Link>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <details>
                <summary>
                  <Link to={"/events"}>Events</Link>
                </summary>
                <ul className="p-2">
                  <li>
                    <Link to={"/events/new-years"}>New Years</Link>
                  </li>
                  <li>
                    <Link to={"/events/fourth-july"}>Fourth of July</Link>
                  </li>
                  <li>
                    <Link to={"/events/gender-reveal"}>Gender Reveal</Link>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
        <div className="navbar-end flex gap-2 flex-1 ">
          <SignedOut>
            <SignInButton>
              <button className="btn btn-success">Sign In</button>
            </SignInButton>
            <SignUpButton>
              <button className="btn btn-primary">Create Account</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </>
  );
};
