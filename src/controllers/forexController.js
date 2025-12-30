import { FrankFurterService } from "../services/frankfurterService.js";

export class ForexController {
  static async getForexLatest(req, res) {
    try {
      const { base = "EUR", symbols } = req.query;
      const result = await FrankFurterService.getForexLatest(base, symbols);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: "Error al consultar tipos de cambio" + error,
        statusCode: 500,
      });
    }
  }

  static async getForexHistorical(req, res) {
    try {
      const { date, base = "EUR", symbols } = req.query;
      const result = await FrankFurterService.getForexHistorical(
        date,
        base,
        symbols
      );

      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: "Error al consultar datos históricos" + error,
        statusCode: 500,
      });
    }
  }

  static async convert(req, res) {
    try {
      const { from, to, amount } = req.body;
      const result = await FrankFurterService.convert(from, to, amount);
      return result;
    } catch (error) {
      res.status(500).json({
        error: "Error al convertir divisas" + error,
        statusCode: 500,
      });
    }
  }
}
