import React from "react";
import { States } from "../../types";

interface StateZipInputProps {
  state: string;
  zipcode: string;
  onStateChange: (value: string) => void;
  onZipcodeChange: (value: string) => void;
}

const StateZipInput: React.FC<StateZipInputProps> = ({
  state,
  zipcode,
  onStateChange,
  onZipcodeChange,
}) => {
  return (
    <fieldset className="fieldset max-md:grid-cols-4 bg-base-200 border border-primary p-4 rounded-box">
      <legend className="fieldset-legend text-primary ">Find a Terminal</legend>

      <label className="fieldset-label">State</label>
      <select
        className="select "
        value={state}
        onChange={(e) => onStateChange(e.target.value)}
      >
        <option disabled value="">
          Select a State
        </option>
        {Object.entries(States).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>

      <label className="fieldset-label">Zip Code</label>
      <input
        type="text"
        className="input input-bordered text-base-content"
        value={zipcode}
        onChange={(e) => onZipcodeChange(e.target.value)}
      />
    </fieldset>
  );
};

export default StateZipInput;
