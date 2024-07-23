import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const PasswordIconSwap = ({
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
