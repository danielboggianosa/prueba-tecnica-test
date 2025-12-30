import { Router } from "express";
import { ForexController } from "../controllers/forexController.js";

class Routes {
  route = Router();
  constructor() {
    this.init();
  }

  init() {
    this.route.get("/forex/latest", ForexController.getForexLatest);
    this.route.get("/forex/historical", ForexController.getForexLatest);
    this.route.post("/forex/convert", ForexController.getForexLatest);
  }
}

export const routes = new Routes().route;
