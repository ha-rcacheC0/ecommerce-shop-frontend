const BASE_URL = import.meta.env.VITE_API_BASE_URL! + "/api/terminal";

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

  return await fetch(`${BASE_URL}?${params}`, {}).then((res) => res.json());
};

export const getOneTerminalQuery = async ({ id }: { id: string }) => {
  return await fetch(`${BASE_URL}/${id}`, {}).then((res) => res.json());
};
