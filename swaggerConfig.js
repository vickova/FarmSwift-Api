import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FarmSwift API",
      version: "1.0.0",
      description: "API documentation for FarmSwift",
      contact: {
        name: "FarmSwift Support",
        email: "support@farmswift.com",
      },
    },
    servers: [
      {
        url: "https://farmswift-api.onrender.com", // Replace with your Render API base URL
        description: "Production Server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Adjust this path based on where your routes are defined
};

// Initialize Swagger docs
const swaggerDocs = swaggerJSDoc(swaggerOptions);

export { swaggerUi, swaggerDocs };
