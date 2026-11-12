import { Sequelize } from "sequelize";

const required = ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Variável de ambiente obrigatória não definida: ${key}`);
  }
}

const useSsl = process.env.DB_SSL === "true";

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    dialect: "postgres",
    logging: false,
    dialectOptions: useSsl
      ? { ssl: { require: true, rejectUnauthorized: false } }
      : {}
  }
);
