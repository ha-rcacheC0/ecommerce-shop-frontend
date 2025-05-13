// import {
//   faFacebookF,
//   faTwitter,
//   faYoutube,
// } from "@fortawesome/free-brands-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons/faLocationArrow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "@tanstack/react-router";

export const Footer = () => {
  return (
    <>
      <footer className="footer flex flex-wrap p-10 bg-base-100 items-base justify-around text-base-content border-t-3 mt-10 border-secondary">
        <nav>
          <h6 className="footer-title underline">Company</h6>
          <Link to="/about" className="link link-hover">
            About us
          </Link>
          <Link to="/shipping-info" className="link link-hover">
            Shipping
          </Link>
          <a className="link link-hover">Discounts</a>
          <a className="link link-hover">Reviews</a>
          <Link to="/contact-us" className="link link-hover">
            Contact Us
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title underline">Features</h6>
          <Link to="/fireworks-safety" className="link link-hover">
            Fireworks Safety
          </Link>
          <Link to="/faq" className="link link-hover">
            FAQ
          </Link>
          <Link to="/privacy-policy" className="link link-hover">
            Privacy policy
          </Link>
          <Link to="/cookie-policy" className="link link-hover">
            Cookie policy
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title underline">Legal</h6>
          <Link to="/fireworks-safety" className="link link-hover">
            Fireworks Safety
          </Link>
          <Link to="/terms-of-use" className="link link-hover">
            Terms of Use
          </Link>
          <Link to="/privacy-policy" className="link link-hover">
            Privacy policy
          </Link>
          <Link to="/cookie-policy" className="link link-hover">
            Cookie policy
          </Link>
        </nav>
      </footer>
      <footer className="flex flex-col items-center justify-center px-8 py-2 border-t bg-base-100 text-base-content border-base-300">
        <aside className="flex flex-col footer-start">
          <a href="/" className="btn btn-link ml-12">
            <img
              className="w-50"
              src="/imgs/crew-logo.png"
              alt="company logo"
            ></img>
          </a>
          <a className="link link-hover text-center text-md">
            <FontAwesomeIcon icon={faLocationArrow} /> North Dakota, USA 🇺🇸
          </a>
          <a className="link link-hover text-center text-md">
            <FontAwesomeIcon icon={faPhone} /> +1 (701) 269-6703
          </a>
        </aside>
        <div className="footer-center w-full mx-auto">
          <p className="text-center text-xs py-2">
            When you visit with our sites, services, or tools, we or our
            authorized service providers may use cookies to store information to
            help provide you with a better, faster and safer browsing experience
            and for marketing purposes.
          </p>
          <p className="text-center text-sm">
            &copy; Crew Fireworks 2025. All right reserved.
          </p>
        </div>
        {/* <nav className="md:place-self-center md:justify-self-end">
          <div className="grid grid-flow-col gap-4">
            <a>
              <FontAwesomeIcon icon={faTwitter} className="w-6 h-6" />
            </a>
            <a>
              <FontAwesomeIcon icon={faYoutube} className="w-6 h-6" />
            </a>
            <a>
              <FontAwesomeIcon icon={faFacebookF} className="w-6 h-6" />
            </a>
          </div>
        </nav> */}
      </footer>
    </>
  );
};
