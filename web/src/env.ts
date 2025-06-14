import { z } from "zod";

const envSchema = z.object({
  MODE: z.enum(["production", "development", "test"]).default("development"),
  VITE_API_URL: z.string(),
  VITE_ENABLE_API_DELAY: z.string().transform((value) => value === "true"),
  VITE_CLOUD_URL: z.string().url(),
});

export const env = envSchema.parse(import.meta.env);
