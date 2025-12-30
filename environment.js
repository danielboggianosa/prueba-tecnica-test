import { configDotenv } from "dotenv";
configDotenv();

export const environment = {
  port: process.env.PORT,
  frankFurtherUrl: process.env.FRANKFURTER_BASE_URL,
};
