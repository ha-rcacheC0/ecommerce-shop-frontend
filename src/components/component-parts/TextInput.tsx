import { ComponentProps } from "react";

export const TextInput = ({
  labelText,
  inputAttr,
}: {
  labelText: string;
  inputAttr: ComponentProps<"input">;
}) => {
  return (
    <div className="form-control w-full max-w-sm">
      <label className="input input-bordered flex items-center gap-2 text-base-content">
        {labelText}
        <input
          type="text"
          className={"placeholder-base-content/50 text-primary-content"}
          {...inputAttr}
        />
      </label>
    </div>
  );
};
