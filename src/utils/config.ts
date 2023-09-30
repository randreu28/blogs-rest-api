import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3001;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;

if (DB_USERNAME === undefined || DB_PASSWORD === undefined) {
  throw Error("Enviroment variables missing");
}

export default { PORT, DB_USERNAME, DB_PASSWORD };
