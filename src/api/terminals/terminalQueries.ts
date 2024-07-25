import { queryOptions } from "@tanstack/react-query";
import { getTerminalsQuery, getOneTerminalQuery } from "./terminals";

export const getTerminalsQueryOptions = ({
  state,
  zipcode,
}: {
  state?: string;
  zipcode?: string;
}) =>
  queryOptions({
    queryKey: ["terminals", state, zipcode],
    queryFn: () => getTerminalsQuery({ state, zipcode }),
    placeholderData: [],
  });

export const getOneTerminalQueryOptions = ({
  id,
  isTerminalDest,
}: {
  id: string;
  isTerminalDest: boolean;
}) =>
  queryOptions({
    queryKey: ["terminal", id],
    queryFn: () => getOneTerminalQuery({ id }),
    enabled: isTerminalDest,
  });
