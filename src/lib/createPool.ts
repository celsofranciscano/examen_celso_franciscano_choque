import { Pool } from "pg";

export function createPool(config: {
  host: string;
  user: string;
  password: string;
  database: string;
  ssl: boolean;
}) {
  return new Pool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: 5432,
    ssl: config.ssl ? { rejectUnauthorized: false } : false,
  });
}
