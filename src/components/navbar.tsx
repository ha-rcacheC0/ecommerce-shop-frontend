import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../providers/auth.provider";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { cartItemsQueryOptions } from "../api/cart/cartQueries";

export const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate({ to: "/" });
  };

  const cartId = auth.user?.userInfo?.Cart.id ?? "";

  const { data: cartInfo } = useQuery(cartItemsQueryOptions(cartId, !!cartId));

  const cartQty =
    cartInfo?.CartProducts.reduce((acc, elm) => acc + elm.quantity, 0) || 0;

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
        <Link to={"/"} className="btn btn-link">
          <img className="w-40" src="/imgs/crew-logo.png" alt="company logo" />
        </Link>
      </div>
      <div className="navbar-center hidden md:flex flex-1 justify-center">
        <ul tabIndex={0} className="menu menu-horizontal mt-3 px-1">
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
      <div className="navbar-end flex gap-2 flex-1">
        {auth.authState === "authenticated" ? (
          <div className="flex gap-4 items-center">
            <Link
              to="/profile"
              className="btn btn-accent [&.active]:btn-primary max-md:hidden"
            >
              Profile
            </Link>
            <div className="indicator">
              <span className="indicator-item badge badge-secondary">
                {cartQty}
              </span>
              <Link
                to={"/profile/cart/$cartId"}
                params={{ cartId }}
                className="btn btn-accent"
              >
                Cart <FontAwesomeIcon icon={faCartShopping} />
              </Link>
            </div>
            <div
              onClick={handleLogout}
              className="btn btn-neutral btn-outline py-2 px-4 rounded-md"
            >
              Logout
            </div>
          </div>
        ) : (
          <div className="ml-auto mr-10 flex gap-4">
            <Link
              to="/user/register"
              className="text-xl btn btn-primary [&.active]:font-bold"
            >
              Sign Up
            </Link>
            <Link
              to="/user/login"
              className="text-xl btn btn-secondary [&.active]:font-bold"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
