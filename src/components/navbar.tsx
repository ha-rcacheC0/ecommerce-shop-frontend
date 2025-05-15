import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "../providers/auth.provider";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { cartItemsQueryOptions } from "../api/cart/cartQueries";

export const Navbar = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isExactPath = (path: string): boolean => {
    return currentPath === path;
  };

  const handleLogout = () => {
    auth.logout();
    navigate({ to: "/" });
  };

  const cartId = auth.user?.userInfo?.Cart.id ?? "";

  const { data: cartInfo } = useQuery(cartItemsQueryOptions(cartId, !!cartId));

  const cartQty =
    cartInfo?.cartProducts.reduce(
      (acc, elm) => acc + elm.caseQuantity + elm.unitQuantity,
      0
    ) || 0;

  return (
    <div className="navbar bg-base-100 border-b-2 border-secondary pt-3">
      <div className="navbar-start flex-1">
        <div className="dropdown">
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
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow-sm bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to={"/products"} search={{ page: 1, pageSize: 25 }}>
                Fireworks
              </Link>
            </li>
            <li>
              <Link to={"/shows"} search={{ page: 1, pageSize: 25 }}>
                Shows
              </Link>
            </li>
            <div className="divider divider-secondary"></div>
            {auth.authState === "authenticated" ? (
              <>
                <li className="mt-auto">
                  <Link to="/profile" className="justify-between">
                    Profile
                  </Link>
                </li>

                <li>
                  <Link
                    to={"/profile/cart/$cartId"}
                    params={{ cartId }}
                    className="justify-between"
                  >
                    Cart
                    <span className="badge badge-secondary">{cartQty}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/" onClick={handleLogout}>
                    Logout
                  </Link>
                </li>
                {auth.user?.userInfo?.role === "ADMIN" && (
                  <li>
                    <Link to="/admin">Admin</Link>
                  </li>
                )}
              </>
            ) : (
              <>
                <li>
                  <Link to="/user/register">Sign Up</Link>
                </li>
                <li>
                  <Link to="/user/login">Sign In</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <Link to={"/"} className="btn btn-link">
          <img
            className="w-52 mb-[-10px]"
            src="/imgs/crew-logo.png"
            alt="company logo"
          />
        </Link>
      </div>
      <div className="navbar-center hidden md:flex flex-1 justify-center">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to={"/products"} search={{ page: 1, pageSize: 25 }}>
              Fireworks
            </Link>
          </li>
          <li>
            <Link to={"/shows"} search={{ page: 1, pageSize: 25 }}>
              Shows
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end flex gap-2 flex-1">
        {auth.authState === "authenticated" ? (
          <div className="flex gap-4 items-center">
            {auth.user?.userInfo?.role === "ADMIN" && (
              <Link
                to="/admin"
                className={`btn btn-primary ${isExactPath("/admin") ? "btn-outline" : ""} hidden md:inline-flex`}
              >
                Admin
              </Link>
            )}
            <Link
              to="/profile"
              className={`btn btn-secondary ${isExactPath("/profile") ? "btn-outline" : ""} hidden md:inline-flex`}
            >
              Profile
            </Link>
            <div className="indicator hidden md:inline-flex">
              <span className="indicator-item badge badge-primary">
                {cartQty}
              </span>
              <Link
                to={"/profile/cart/$cartId"}
                params={{ cartId }}
                className={`btn btn-info ${isExactPath(`/profile/cart/${cartId}`) ? "btn-outline" : ""}`}
              >
                Cart <FontAwesomeIcon icon={faCartShopping} />
              </Link>
            </div>
            <div
              onClick={handleLogout}
              className="btn btn-error py-2 px-4 rounded-md max-md:hidden"
            >
              Logout
            </div>
          </div>
        ) : (
          <div className="ml-auto mr-10 flex gap-4">
            <Link
              to="/user/register"
              className="btn btn-primary  max-md:hidden"
            >
              Sign Up
            </Link>
            <Link to="/user/login" className="btn btn-secondary  max-md:hidden">
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
