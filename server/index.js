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
            type Todos {
                id: ID!
                title: String!
                completed: Boolean!
                user: GetUser
            }

            type Address {
                street: String!
                city: String!
            }

            type GetUser {
                id: ID!
                name: String!
                username: String!
                email: String!
                address: Address!
            }

            type Query {
                getTodos: [Todos]
                getUsers: [GetUser]
                getUserById(id:ID!) : GetUser
            }
        `,
        resolvers: {
            Todos: {
                user: async (todo) => (
                    await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)
                ).data
            },
            Query: {
                getTodos: async () => (
                    await axios.get("https://jsonplaceholder.typicode.com/todos")
                ).data,
                getUsers: async () => (
                    await axios.get("https://jsonplaceholder.typicode.com/users")
                ).data,
                getUserById: async (parent, { id }) => (
                    await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)
                ).data
            }
        }
    });

    await server.start();

    app.use(bodyParser.json());
    app.use(cors());
    app.use('/graphql', expressMiddleware(server, {
        context: async ({ req }) => ({})
    }));

    app.listen(8000, () => {
        console.log("Server is running on http://localhost:8000/graphql");
    });
}

startServer();
