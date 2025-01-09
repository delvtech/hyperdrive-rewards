import express, { Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import https from "https";
import http from "http";
import fs from "fs";
import { Address } from "viem";
import dotenv from "dotenv";

import swaggerSpec from "./swagger";
import { getDummyRewardsResponse } from "./rewards";

dotenv.config();

const LOCAL_DEVELOPMENT = process.env.NODE_ENV === "development";

// Instantiate the app.
const app = express();

// Enable CORS.
app.use(cors());

console.log("swaggerSpec", swaggerSpec);
// Enable Swagger UI.
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req: Request, res: Response) => {
  res.redirect("/swagger"); // Redirect to the Swagger documentation endpoint
});

// Endpoint to serve the Swagger JSON.
app.get("/swagger.json", (req: Request, res: Response) => {
  res.json(swaggerSpec);
});

interface RewardsRequest extends Request {
  params: {
    address: Address;
  };
}
/**
 * @swagger
 * /get/rewards/{address}:
 *   get:
 *     summary: Get rewards for an address.
 *     description: Returns the rewards associated with a specific address.
 *     parameters:
 *       - in: path
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: The address to retrieve rewards for.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RewardsResponse'
 *       400:
 *         description: Bad request
 */
app.get("/get/rewards/:address", (req: RewardsRequest, res: Response) => {
  const { address } = req.params;
  const rewards = getDummyRewardsResponse(address);
  res.json(rewards);
});

if (LOCAL_DEVELOPMENT) {
  // Use port 8080 for local development.
  const port = 8080;

  // Start HTTP server.
  http.createServer(app).listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Swagger Docs available at http://localhost:${port}/swagger`);
    console.log(
      `Swagger JSON available at http://localhost:${port}/swagger.json`
    );
  });
} else {
  // TODO: Use port 3000 for production.  Nginx will act as a reverse proxy and forward 443 traffic.
  const port = 443;

  // Load SSL Certificates.
  const sslOptions = {
    key: fs.readFileSync(
      "/etc/letsencrypt/live/rewards.hyperdrive.money/privkey.pem"
    ),
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/rewards.hyperdrive.money/fullchain.pem"
    ),
  };

  // Start HTTPS server.
  https.createServer(sslOptions, app).listen(port, '0.0.0.0', () => {
    console.log(`Server running on https://localhost:${port}`);
    console.log(`Swagger Docs available at http://localhost:${port}/swagger`);
    console.log(
      `Swagger JSON available at http://localhost:${port}/swagger.json`
    );
  });
}
