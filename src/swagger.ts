import swaggerJsdoc, { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hyperdrive Rewards API",
      version: "1.0.0",
      description: "API documentation for Hyperdrive Rewards",
    },
    servers: [
      {
        url: "http://localhost:3000", // Update this with your deployed server URL
      },
    ],
  },
  apis: ["./src/**/*.ts"], // Path to your route files
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
