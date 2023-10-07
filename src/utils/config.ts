import dotenv from "dotenv";

dotenv.config();

if (
  process.env.MONGODB_URI === undefined ||
  process.env.TEST_MONGODB_URI === undefined ||
  process.env.SECRET === undefined
) {
  throw Error("Enviroment variables missing");
}

const PORT = process.env.PORT || 3001;
const ENV = process.env.NODE_ENV || "development";
const SECRET = process.env.SECRET;

const URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

export default { PORT, URI, ENV, SECRET };
