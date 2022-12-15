import { AuthorResolver } from "./authorResolver";
import { BookResolver } from "./bookResolver";
const resolvers = {
  Query: {
    ...AuthorResolver.Query,
    ...BookResolver.Query,
  },
  Mutation: {
    ...AuthorResolver.Mutation,
    ...BookResolver.Mutation,
  },
  // Subscription: {},
};

export default resolvers;
