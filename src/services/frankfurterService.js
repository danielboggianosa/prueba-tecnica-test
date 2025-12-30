import axios from "axios";
import { environment } from "../../environment.js";

const BASE_URL =
  environment.frankFurtherUrl || "https://api.frankfurter.dev/v1";

export class FrankFurterService {
  static async getForexLatest({ base = "EUR", symbols }) {
    try {
      const params = { base };
      if (symbols) params.symbols = symbols;

      const response = await axios.get(`${BASE_URL}/latest`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getForexHistorical(date, base = "EUR", symbols) {
    try {
      if (!date) {
        return res.status(400).json({
          error: "El parámetro 'date' es requerido",
          statusCode: 400,
        });
      }
      const params = { base };
      if (symbols) params.symbols = symbols;
      const response = await axios.get(`${BASE_URL}/${date}`, { params });
      res.json(response.data);
    } catch (error) {
      throw error;
    }
  }

  static async convert(from, to, amount) {
    try {
      if (!from || !to || !amount) {
        return res.status(400).json({
          error: "Los campos from, to y amount son requeridos",
          statusCode: 400,
        });
      }

      // Obtener tasa de cambio
      const response = await axios.get(`${BASE_URL}/latest`, {
        params: { base: from, symbols: to },
      });

      const rate = response.data.rates[to];
      const result = parseFloat((amount * rate).toFixed(2));

      res.json({
        from,
        to,
        amount,
        rate,
        result,
        date: response.data.date,
      });
    } catch (error) {
      throw error;
    }
  }
}
