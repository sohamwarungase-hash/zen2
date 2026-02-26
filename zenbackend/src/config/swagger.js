import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ZenSolve API',
            version: '1.0.0',
            description: 'API documentation for the Municipal Grievance System.',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Local development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/app.js', './src/routes/*.js'], // files containing annotations
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
