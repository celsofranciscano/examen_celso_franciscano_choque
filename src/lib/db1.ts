import { createPool } from "./createPool";

export const db1 = createPool({
  host: process.env.DB1_HOST!,
  user: process.env.DB1_USER!,
  password: process.env.DB1_PASSWORD!,
  database: process.env.DB1_NAME!,
  ssl: true, // Supabase siempre SSL
});
