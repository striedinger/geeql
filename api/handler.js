const { GraphQLServerLambda } = require('graphql-yoga');

const lambda = new GraphQLServerLambda({ 
  typeDefs,
  resolvers
});

exports.server = lambda.graphqlHandler
exports.playground = lambda.playgroundHandler
