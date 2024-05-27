import {
  faFacebookF,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons/faLocationArrow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Footer = () => {
  return (
    <>
      <footer className="footer p-10 bg-base-200 items-center justify-around text-base-content">
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Shipping</a>
          <a className="link link-hover">Discounts</a>
          <a className="link link-hover">Reviews</a>
          <a className="link link-hover">Contact Us</a>
        </nav>
        <nav>
          <h6 className="footer-title">Features</h6>
          <a className="link link-hover">Fireworks Safety</a>
          <a className="link link-hover">FAQ</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Fireworks Safety</a>
          <a className="link link-hover">Terms of Use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </footer>
      <footer className="footer px-10 py-4 border-t bg-base-200 text-base-content border-base-300">
        <aside className="items-left grid-flow-col flex flex-col footer-start">
          <a href="/" className="btn btn-link ">
            <img
              className="w-40"
              src="/imgs/crew-logo.png"
              alt="company logo"
            ></img>
          </a>
          <a className="link link-hover">
            <FontAwesomeIcon icon={faLocationArrow} /> 2403 Hwy 281 S Jamestown,
            ND 58401
          </a>
          <a className="link link-hover">
            <FontAwesomeIcon icon={faPhone} /> +1 (701) 269-6703
          </a>
        </aside>
        <div className="footer-center w-1/2 mx-auto">
          <p className="text-center">
            When you visit with our sites, services, or tools, we or our
            authorized service providers may use cookies to store information to
            help provide you with a better, faster and safer browsing experience
            and for marketing purposes.
          </p>
          <p>&copy; Crew Fireworks 2024. All right reserved.</p>
        </div>
        <nav className="md:place-self-center md:justify-self-end">
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
        </nav>
      </footer>
      ;
    </>
  );
};
