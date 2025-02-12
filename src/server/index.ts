import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import fs from "fs";
import http from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import https from "https";
import swaggerUi from "swagger-ui-express";

import { initializeDataSource } from "src/server/dataSource";
import { infoRouter } from "src/server/routers/info";
import { rewardsRouter } from "src/server/routers/rewards";
import swaggerSpec from "src/server/swagger";

dotenv.config();

const LOCAL_DEVELOPMENT = process.env.NODE_ENV === "development";
console.log("LOCAL_DEVELOPMENT", LOCAL_DEVELOPMENT);

// Instantiate the app.
export const app = express();

// Enable CORS.
app.use(cors());

// Enable Swagger UI.
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/", (req: Request, res: Response) => {
    res.redirect("/swagger"); // Redirect to the Swagger documentation endpoint
});

// Endpoint to serve the Swagger JSON.
app.get("/swagger.json", (req: Request, res: Response) => {
    res.json(swaggerSpec);
});

// Add routers.
app.use("/get/rewards", rewardsRouter);
app.use("/get/info", infoRouter);

// Proxy all requests to /rpc to the local Anvil node
app.use(
    "/rpc",
    createProxyMiddleware({
        target: "http://127.0.0.1:8545", // Anvil server
        changeOrigin: true,
        pathRewrite: { "^/rpc": "" }, // Remove "/rpc" prefix when forwarding
    }),
);

// app.listen(443, () => {
//     console.log("Server running and forwarding /rpc to Anvil (8545)");
// });

initializeDataSource().then(() => {
    // Start the server.
    if (LOCAL_DEVELOPMENT) {
        // Use port 8080 for local development.
        const port = 8080;

        // Start HTTP server.
        http.createServer(app).listen(port, () => {
            createServerLogs(port);
        });
    } else {
        // TODO: Use port 3000 for production.  Nginx will act as a reverse proxy and forward 443 traffic.
        const port = 443;

        // Load SSL Certificates.
        const sslOptions = {
            key: fs.readFileSync(
                "/etc/letsencrypt/live/rewards.hyperdrive.money/privkey.pem",
            ),
            cert: fs.readFileSync(
                "/etc/letsencrypt/live/rewards.hyperdrive.money/fullchain.pem",
            ),
        };

        // Start HTTPS server.
        https.createServer(sslOptions, app).listen(port, "0.0.0.0", () => {
            createServerLogs(port);
        });
    }
});
function createServerLogs(port: number) {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Swagger Docs available at http://localhost:${port}/swagger`);
    console.log(
        `Swagger JSON available at http://localhost:${port}/swagger.json`,
    );
}
