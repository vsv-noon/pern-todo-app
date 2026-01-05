export default {
  migrationsDir: "migrations",
  direction: "up",
  databaseUrl:
    process.env.NODE_ENV === "test"
      ? process.env.DATABASE_URL
      : process.env.DATABASE_URL,
};