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
    <>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">State</span>
        </div>
        <select
          className="select select-bordered text-white"
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
      </label>
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Zip Code</span>
        </div>
        <input
          type="text"
          className="input input-bordered text-white"
          value={zipcode}
          onChange={(e) => onZipcodeChange(e.target.value)}
        />
      </label>
    </>
  );
};

export default StateZipInput;
