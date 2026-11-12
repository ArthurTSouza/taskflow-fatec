import "dotenv/config";
import app from "./app";
import { sequelize } from "./config/database";
import "./models/Task";

const port = Number(process.env.PORT) || 3000;

async function start(): Promise<void> {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Conexão com PostgreSQL estabelecida.");

    app.listen(port, "0.0.0.0", () => {
      console.log(`TaskFlow API executando na porta ${port}.`);
    });
  } catch (error) {
    console.error("Não foi possível iniciar a API:", error);
    process.exit(1);
  }
}

void start();
