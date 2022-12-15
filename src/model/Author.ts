import * as Dynamoose from "dynamoose";
import Book from "./Book";

const { Schema, model } = Dynamoose;
const authorSchema = new Schema(
  {
    _id: {
      type: String,
      hashKey: true,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    books: [Book],
  },
  { timestamps: true },
);

const Author = model("Author", authorSchema);
export default Author;
