import { SwaggerOptions } from "swagger-ui-express";

export default <SwaggerOptions>{
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Drewar API with Swagger",
            version: "0.1.0",
            description:
                "This is a simple CRUD API application made with Express and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Camilo Barbosa",                
                email: "cab331@hotmail.com",
            },
        },
        servers: [
            {
                url: "http://localhost:8081/api/",
            },
        ],
    },
    apis: ["./src/route/api_docs/*"],
};