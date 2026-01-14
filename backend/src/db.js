import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool, types } = pkg;

// OID 1082 = DATE (returns string YYYY-MM-DD, without TZ)
types.setTypeParser(1082, (value) => value);

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool
  .query('select 1')
  .then(() => console.log('DB connected'))
  .catch(console.error);

// const { rows } = await pool.query("SELECT current_database()");

// if (rows[0].current_database !== "todo_test") {
//   throw new Error("❌ Wrong database for tests");
// }
