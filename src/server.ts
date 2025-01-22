import express, { Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import https from "https";
import http from "http";
import fs from "fs";
import dotenv from "dotenv";

import swaggerSpec from "./swagger";
import { walletRouter } from "./wallet";
import { rewardsRouter } from "./rewards";
import { poolRouter } from "./pool";
import { initializeDataSource } from "./dataSource";
import { infoRouter } from "./info";

dotenv.config();

const LOCAL_DEVELOPMENT = process.env.NODE_ENV === "development";

// Instantiate the app.
export const app = express();

// Enable CORS.
app.use(cors());

// Enable Swagger UI.
console.log("swaggerSpec", swaggerSpec);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/", (req: Request, res: Response) => {
  res.redirect("/swagger"); // Redirect to the Swagger documentation endpoint
});

// Endpoint to serve the Swagger JSON.
app.get("/swagger.json", (req: Request, res: Response) => {
  res.json(swaggerSpec);
});

// Add routers.
app.use("/get/wallet", walletRouter);
app.use("/get/rewards", rewardsRouter);
app.use("/get/pool", poolRouter);
app.use("/get/info", infoRouter);

initializeDataSource().then(() => {
  // Start the server.
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
    https.createServer(sslOptions, app).listen(port, "0.0.0.0", () => {
      console.log(`Server running on https://localhost:${port}`);
      console.log(`Swagger Docs available at http://localhost:${port}/swagger`);
      console.log(
        `Swagger JSON available at http://localhost:${port}/swagger.json`
      );
    });
  }
});
