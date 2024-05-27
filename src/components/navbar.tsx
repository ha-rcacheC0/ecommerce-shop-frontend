import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
} from "@clerk/clerk-react";

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
                <a href="/products">Fireworks</a>
                <ul className="p-2">
                  <li>
                    <a href="/products/shows">Shows</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="/events">Events</a>
                <ul className="p-2">
                  <li>
                    <a href="/events/new-years">New Years</a>
                  </li>
                  <li>
                    <a href="/events/fourth-july">Fourth of July</a>
                  </li>
                  <li>
                    <a href="/events/gender-reveal">Gender Reveal</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <a href="/" className="btn btn-link ">
            <img
              className="w-40"
              src="/imgs/crew-logo"
              alt="company logo"
            ></img>
          </a>
        </div>
        <div className="navbar-center hidden md:flex flex-1 justify-center">
          <ul tabIndex={0} className="menu menu-horizontal  mt-3 px-1">
            <li>
              <details>
                <summary>
                  <a href="/products">Fireworks</a>
                </summary>
                <ul className="p-2">
                  <li>
                    <a href="/products/shows">Shows</a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <details>
                <summary>
                  <a href="/events">Events</a>
                </summary>
                <ul className="p-2">
                  <li>
                    <a href="/events/new-years">New Years</a>
                  </li>
                  <li>
                    <a href="/events/fourth-july">Fourth of July</a>
                  </li>
                  <li>
                    <a href="/events/gender-reveal">Gender Reveal</a>
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
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </>
  );
};
