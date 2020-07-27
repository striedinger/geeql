const { GraphQLServer } = require('graphql-yoga');

const typeDefs = require('./src/types');
const resolvers = require('./src/resolvers');

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log('Server is running on localhost:4000'));
