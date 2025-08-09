import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { getPort } from "../utils";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Stock API",
      version: "1.0.0",
      description: "API for retrieving and tracking stock prices",
    },
    servers: [
      {
        url: `http://localhost:${getPort()}`,
      },
    ],
  },
  apis: [path.join(__dirname, "../routes/*.ts")],
};

export const swaggerSpec = swaggerJsdoc(options);
