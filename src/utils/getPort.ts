import { DEFAULT_PORT } from "../defaults";

export const getPort = (): number => {
  return Number(process.env.PORT) || DEFAULT_PORT;
};