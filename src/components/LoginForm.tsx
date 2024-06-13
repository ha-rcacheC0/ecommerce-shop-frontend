import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { flushSync } from "react-dom";
import { signInUser } from "../api/users/auth.api";
import { SignInRequest } from "../types";
import { ErrorMessage } from "./component-parts/ErrorMessage";
import { TextInput } from "./component-parts/TextInput";
import {
  validateEmailInput,
  validatePasswordInput,
} from "../utils/validationUtils";
import { useAuth } from "../providers/auth.provider";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverMessage, setServerMessage] = useState(""); // Use this state to hold server messages
  const emailValidState = validateEmailInput(email);
  const passwordValidState = validatePasswordInput(password);
  const navigate = useNavigate();
  const authContext = useAuth();

  const usernameErrorMessage = emailValidState.error?.flatten().formErrors[0];
  const passwordErrorMessage =
    passwordValidState.error?.flatten().formErrors[0];

  const mutation = useMutation({
    mutationKey: ["signInUser"],
    mutationFn: (body: SignInRequest) => signInUser(body),
    onSuccess: (data) => {
      if (!data.token && !data.userInfo) {
        console.log("am I here?");
        throw new Error(data.message);
      } else {
        flushSync(() => {
          if (data.token && data.userInfo) {
            localStorage.setItem("user", JSON.stringify(data));

            authContext.login(data);
          }
        });
      }
      setIsSubmitted(false);
      navigate({ to: "/products" });
    },
    onError: (error) => {
      setServerMessage(error.message || "An error occurred");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    setServerMessage(""); // Clear previous messages
    if (emailValidState.success && passwordValidState.success) {
      const requestBody: SignInRequest = { email, password };
      console.log(requestBody);
      mutation.mutate(requestBody);
    } else {
      console.log("Something isn't sending correctly");
    }
  };

  return (
    <div className=" flex flex-col content-center">
      <img
        src="/imgs/crew-logo.png"
        className="w-128 my-5 self-center"
        alt="Crew Fireworks Logo"
      />

      <form
        onSubmit={handleSubmit}
        className="bg-base-200 text-primary p-8 card gap-4 form-control shadow-2xl my-6 w-1/2 mx-auto flex flex-col items-center"
      >
        {serverMessage && (
          <ErrorMessage
            message={serverMessage}
            show={serverMessage.length > 0}
          />
        )}
        <TextInput
          labelText={"Email"}
          inputAttr={{
            name: "email",
            placeholder: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
          }}
        />
        <ErrorMessage
          message={usernameErrorMessage || ""}
          show={isSubmitted && !emailValidState.success}
        />

        <TextInput
          labelText={"Password"}
          inputAttr={{
            name: "password",
            placeholder: "password",
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
          }}
        />
        <ErrorMessage
          message={passwordErrorMessage || ""}
          show={isSubmitted && !passwordValidState.success}
        />

        <button
          type="submit"
          className="btn btn-primary text-slate-100 font-semibold  hover:bg-slate-800 disabled:bg-gray-600"
        >
          {"Login"} <FontAwesomeIcon icon={faRightToBracket} />{" "}
        </button>
        <Link to={"/user/register"} className="text-primary-content underline">
          Create a New Account
        </Link>
      </form>
    </div>
  );
  4;
};
