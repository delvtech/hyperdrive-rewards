import express, { Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import https from "https";
import fs from "fs";
import { Address } from "viem";

import swaggerSpec from "./swagger";
import { getDummyRewardsResponse } from "./rewards";

// Instantiate the app.
const app = express();

// Enable CORS.
app.use(cors());
// Enable Swagger UI.
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

interface RewardsRequest extends Request {
  params: {
    address: Address;
  };
}

app.get("/", (req, res) => {
  res.redirect("/swagger"); // Redirect to the Swagger documentation endpoint
});

// Endpoint to serve the Swagger JSON.
app.get("/swagger.json", (req, res) => {
  res.json(swaggerSpec);
});

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

// Start HTTPS server.
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Server running on https://localhost:${port}`);
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});
