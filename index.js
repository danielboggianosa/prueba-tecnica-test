import express from "express";
import { routes } from "./src/routes/forex.js";
import { environment } from "./environment.js";

const app = express();
const port = environment.port;

app.use(express.json());

app.use("/api", routes);

app.listen(port, () => {
  console.log("server running on port : ", port);
});
