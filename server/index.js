const express = require("express");
const bodyParser = require('body-parser');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServer } = require("@apollo/server");
const cors = require('cors');
const axios = require("axios");

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `
            type Todos{
                id : ID!
                name : String!
                completed : String!
            }
            type Query{
                getTodos : [Todos]
            }
        `,
        resolvers: {
            Query: {
                getTodos: () => [
                    {
                        id: 1,
                        name: "Piyush Panchabhai",
                        completed: "False",
                    },
                ]
            }
        }
    });

    await server.start();

    app.use(bodyParser.json());
    app.use(cors());
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => ({}) // Passing an empty context if not needed
    }));

    app.listen(8000, () => {
        console.log("Server is running on http://localhost:8000/graphql");
    });
}

startServer();
