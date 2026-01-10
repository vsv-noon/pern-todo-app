import { pool } from "../src/db.js";

if (process.env.NODE_ENV !== "test") {
  throw new Error("❌ Tests are not running in test environment");
}

const { rows } = await pool.query("SELECT current_database()");

if (rows[0].current_database !== "todo_test") {
  throw new Error("❌ Wrong database for tests");
}

beforeEach(async () => {
  await pool.query(`
    TRUNCATE TABLE todos
    RESTART IDENTITY
    CASCADE
  `);
});

afterAll(async () => {
  await pool.end();
});
