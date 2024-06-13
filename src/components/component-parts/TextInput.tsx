import { ComponentProps } from "react";
import { useThemeProvider } from "../../providers/theme.provider";

export const TextInput = ({
  labelText,
  inputAttr,
}: {
  labelText: string;
  inputAttr: ComponentProps<"input">;
}) => {
  const { theme } = useThemeProvider();
  return (
    <div className="form-control w-full max-w-sm">
      <label className="input input-bordered flex items-center gap-2 text-primary-content">
        {labelText}
        <input
          type="text"
          className={"placeholder-primary-content/50 text-primary-content  "}
          {...inputAttr}
        />
      </label>
    </div>
  );
};
