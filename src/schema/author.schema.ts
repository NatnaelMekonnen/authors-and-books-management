import gql from "graphql-tag";

const Author = gql`
  # Input #################

  input AuthorInput {
    firstName: String!
    lastName: String!
  }

  input UpdateAuthorInput {
    firstName: String
    lastName: String
  }

  # Type ##################

  type Author {
    _id: String!
    firstName: String!
    lastName: String!
    createdAt: String!
    books: [Book]
  }

  type AuthorList {
    authors: [Author]
    total: Int
    limit: Int
    page: Int
  }

  type Query {
    getAuthor(authorId: ID!): Author
    getAuthors(limit: Int, offset: Int): AuthorList
  }
  type Mutation {
    createAuthor(AuthorInput: AuthorInput): Author
    updateAuthor(UpdateAuthorInput: UpdateAuthorInput): Author
    deleteAuthor(authorId: ID!): Author
  }
`;

export default Author;
