const { GraphQLServerLambda } = require('graphql-yoga');
const typeDefs = require('../src/types');
const resolvers = require('../src/resolvers');

const lambda = new GraphQLServerLambda({ 
  typeDefs,
  resolvers
});

module.exports = lambda.graphqlHandler;
