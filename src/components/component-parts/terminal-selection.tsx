import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTerminalsQueryOptions } from "../../api/terminals/terminalQueries";
import { TApprovedTerminal } from "../../types";

interface TerminalSelectionProps {
  state: string;
  zipcode: string;
  terminalDestination: string;
  onTerminalChange: (value: string) => void;
}

const TerminalSelection: React.FC<TerminalSelectionProps> = ({
  state,
  zipcode,
  terminalDestination,
  onTerminalChange,
}) => {
  const {
    data: filteredTerminals,
    isLoading,
    error,
  } = useQuery(getTerminalsQueryOptions({ state, zipcode }));

  return (
    <fieldset className="fieldset">
      <legend className="label">Pick Terminal to Ship to</legend>
      <select
        className="select"
        value={terminalDestination}
        onChange={(e) => onTerminalChange(e.target.value)}
      >
        <option disabled value="">
          Pick a Terminal
        </option>
        {isLoading && <option>Loading terminals...</option>}
        {error && <option>Error loading terminals</option>}
        {filteredTerminals &&
          filteredTerminals.map((terminal: TApprovedTerminal) => (
            <option key={terminal.id} value={terminal.id}>
              {terminal.terminalName}-{terminal.address.city}
            </option>
          ))}
      </select>
    </fieldset>
  );
};

export default TerminalSelection;
