import gql from "graphql-tag";

const Book = gql`
  # Input #################

  input BookInput {
    title: String!
    author: Author!
  }

  input UpdateBookInput {
    title: String
    author: Author
  }

  # Type ##################

  type Book {
    _id: String
    Title: String
    createdAt: String
    author: Author
  }

  type BookList implements MetaData {
    books: [Book]
    total: Int
    limit: Int
    page: Int
  }

  type Query {
    getBook(bookId: ID!): Book
    getBooks(limit: Int, offset: Int): BookList
  }
  type Mutation {
    createBook(BookInput: BookInput): Book
    updateBook(UpdateBookInput: UpdateBookInput): Book
    deleteBook(bookId: ID!): Book
  }
`;

export default Book;
