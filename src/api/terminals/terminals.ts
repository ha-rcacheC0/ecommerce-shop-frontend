import { API_CONFIG } from "../../utils/config";

const BASE_URL = API_CONFIG.BASE_URL + "/api/terminal";

export const getTerminalsQuery = async ({
  state,
  zipcode,
}: {
  state?: string;
  zipcode?: string;
}) => {
  const params = new URLSearchParams();
  if (state) params.append("state", state);
  if (zipcode) params.append("zipcode", zipcode);

  return await fetch(`${BASE_URL}?${params}`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};

export const getOneTerminalQuery = async ({ id }: { id: string }) => {
  return await fetch(`${BASE_URL}/${id}`, {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
};
