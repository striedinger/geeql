const { GraphQLServerLambda } = require('graphql-yoga');
const typeDefs = require('../src/types');
const resolvers = require('../src/resolvers');

const lambda = new GraphQLServerLambda({ 
  typeDefs,
  resolvers
});

exports.server = lambda.graphqlHandler;
exports.playground = lambda.playgroundHandler;
