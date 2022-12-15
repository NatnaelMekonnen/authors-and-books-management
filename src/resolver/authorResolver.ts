import { AuthorInput } from "./../types/type";
import Author from "../model/Author";

export const AuthorResolver = {
  Query: {
    getAuthor: async (_: any, { ctx }, { authorId }) => {
      try {
        const author = await Author.findById(authorId);
        return author;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    createAuthor: async (
      _: any,
      { ctx },
      { AuthorInput }: { AuthorInput: AuthorInput },
    ) => {
      try {
        const { firstName, lastName } = AuthorInput;
        const author = await Author.create({
          firstName,
          lastName,
        });

        return author;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
