import { BookInput } from "./../types/type";
import Book from "../model/Book";

export const BookResolver = {
  Query: {
    getBook: async (_: any, { ctx }, { bookId }) => {
      try {
        const book = await Book.findById(bookId);
        return book;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    createBook: async (
      _: any,
      { ctx },
      { BookInput }: { BookInput: BookInput },
    ) => {
      try {
        const { title, author } = BookInput;

        const book = await Book.create({
          title,
          author,
        });

        return book;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
