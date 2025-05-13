import {
  faEnvelope,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createLazyFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";

export const Route = createLazyFileRoute("/contact-us")({
  component: RouteComponent,
});

function RouteComponent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    subject: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        subject: "",
      });
    } catch (error) {
      setSubmitError(
        "There was an error submitting your message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        Contact Us
      </h1>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-base-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-secondary">
              Get In Touch
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-4">
                  <FontAwesomeIcon icon={faPhone} className="text-base-100" />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Phone</p>
                  <p className="font-medium">
                    <a href="tel:+17012696703">+1 (701) 269-6703</a>
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-4">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-base-100"
                  />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Email</p>
                  <p className="font-medium">
                    <a href="mailto:lucas@crewfireworks.com">
                      lucas@crewfireworks.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-4">
                  <FontAwesomeIcon
                    icon={faLocationDot}
                    className="text-base-100"
                  />
                </div>
                <div>
                  <p className="text-sm text-base-content/70">Location</p>
                  <p className="font-medium">North Dakota, USA 🇺🇸</p>
                </div>
              </div>
            </div>

            <div className="bg-base-200 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Business Hours</h3>
              <p className="text-sm mb-1">
                Monday - Friday: 9:00 AM - 5:00 PM CST
              </p>
              <p className="text-sm">
                Weekends & Holidays: Responses may be delayed
              </p>
            </div>
          </div>

          <div className="bg-base-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-6 text-secondary">
              Send Us a Message
            </h2>

            {submitSuccess ? (
              <div className="bg-success/20 text-success p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Message Sent!</h3>
                <p>
                  Thank you for contacting us. We'll get back to you as soon as
                  possible.
                </p>
                <button
                  className="btn btn-outline btn-success mt-4"
                  onClick={() => setSubmitSuccess(false)}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="bg-error/20 text-error p-4 rounded-lg mb-4">
                    {submitError}
                  </div>
                )}

                <label className="floating-label">
                  <span className="label-text">Name</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </label>

                <label className="floating-label">
                  <span className="label-text">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </label>

                <label className="floating-label">
                  <span className="label-text">Phone</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input input-bordered"
                  />
                </label>

                <label className="floating-label">
                  <span className="label-text">Subject</span>

                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="select select-bordered "
                    required
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>
                    <option value="order">Order Question</option>
                    <option value="shipping">Shipping Question</option>
                    <option value="products">Product Information</option>
                    <option value="returns">Returns & Refunds</option>
                    <option value="other">Other</option>
                  </select>
                </label>

                <label className="floating-label">
                  <span className="label-text">Message</span>

                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="textarea textarea-bordered h-24"
                    required
                  ></textarea>
                </label>

                <div className="form-control mt-6">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="loading loading-spinner"></span>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
