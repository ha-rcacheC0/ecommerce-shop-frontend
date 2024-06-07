import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useMutation } from "@tanstack/react-query";
import { TextInput } from "./component-parts/TextInput";
import { useState } from "react";
import { ErrorMessage } from "./component-parts/ErrorMessage";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  validatePasswordInput,
  validateEmailInput,
} from "../utils/validationUtils";
import {
  faEye,
  faEyeSlash,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { UserCreateRequest } from "../types";
import { createUser } from "../api/users/auth.api";

export const RegisterUser = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverMessage, setServerMessage] = useState(""); // Use this state to hold server messages
  const passwordValidState = validatePasswordInput(password);
  const confirmedPassword = password === confirmPassword;
  const emailValidState = validateEmailInput(email);
  const navigate = useNavigate();

  const passwordErrorMessage =
    passwordValidState.error?.flatten().formErrors[0];
  const emailErrorMessage = emailValidState.error?.flatten().formErrors[0];

  const mutation = useMutation({
    mutationKey: ["createUser"],
    mutationFn: (body: UserCreateRequest) => createUser(body),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (_data) => {
      setIsSubmitted(false);
      navigate({ to: "/user/login" });
    },
    onError: (error) => {
      // Handle error state, e.g., show error message from server
      setServerMessage(error.message || "An error occurred");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitted(true);
    setServerMessage(""); // Clear previous messages

    const requestBody: UserCreateRequest = { password, email };
    if (
      emailValidState.success &&
      passwordValidState.success &&
      confirmedPassword
    ) {
      mutation.mutate(requestBody);
    }
  };

  return (
    <div className=" flex flex-col content-center">
      <img
        src="/imgs/crew-logo.png"
        className="w-128 my-5 self-center"
        alt="Crew Fireworks Logo"
      />
      {serverMessage && <div>{serverMessage}</div>}
      <form
        onSubmit={handleSubmit}
        className="card gap-4 bg-base-200 text-primary p-8 my-5 w-1/2 mx-auto items-center"
      >
        <TextInput
          labelText={"Email"}
          inputAttr={{
            name: "email",
            placeholder: "email",
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
          }}
        />
        <ErrorMessage
          message={emailErrorMessage || ""}
          show={isSubmitted && !emailValidState.success}
        />
        <div className="form-control w-full max-w-sm">
          <label className="input input-bordered flex items-center gap-2 text-primary-content">
            Password
            <input
              type={!showPassword ? "password" : "text"}
              className="grow"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordIconSwap
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </label>
        </div>
        <ErrorMessage
          message={passwordErrorMessage || ""}
          show={isSubmitted && !passwordValidState.success}
        />

        <div className="form-control w-full max-w-sm">
          <label className="input input-bordered flex items-center gap-2 text-primary-content">
            Confirm Password
            <input
              type={!showPassword ? "password" : "text"}
              className="grow"
              placeholder="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <PasswordIconSwap
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
          </label>
        </div>
        <ErrorMessage
          message={"Passwords must match exactly"}
          show={isSubmitted && !confirmedPassword}
        />

        <button
          type="submit"
          className="btn btn-primary text-slate-100 font-semibold  hover:bg-slate-800 disabled:bg-gray-600"
        >
          {"Register"} <FontAwesomeIcon icon={faRightToBracket} />{" "}
        </button>
        <Link to={"/user/login"} className="text-primary-content underline">
          Login to your Account
        </Link>
      </form>
    </div>
  );
};

const PasswordIconSwap = ({
  showPassword,
  setShowPassword,
}: {
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <FontAwesomeIcon
      icon={showPassword ? faEyeSlash : faEye}
      onClick={() => setShowPassword(!showPassword)}
    />
  );
};
