import express, { Request, Response } from "express";
import cors from "cors";

import https from "https";
import fs from "fs";

// Instantiate the app.
const app = express();

// Enable CORS.
app.use(cors());

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

// Main rewards endpoint.
app.get("/get/rewards/:address", (req: Request, res: Response) => {
  const { address } = req.params;
  res.json({ message: `Rewards for address: ${address}` });
});

// Start HTTPS server.
https.createServer(sslOptions, app).listen(port, () => {
  console.log(`Server running on https://localhost:${port}`);
});
