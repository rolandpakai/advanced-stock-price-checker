import { z } from "zod";

export const QuoteSchema = z.object({
  c: z.number().optional(),
  o: z.number().optional(),
  h: z.number().optional(),
  l: z.number().optional(),
  pc: z.number().optional(),
  d: z.number().optional(),
  dp: z.number().optional(),
});