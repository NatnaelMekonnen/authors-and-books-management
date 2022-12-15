import * as Dynamoose from "dynamoose";
import Author from "./Author";

const { Schema, model } = Dynamoose;

const bookSchema = new Schema({
  _id: {
    type: String,
    hashKey: true,
    required: true,
  },
  title: {
    type: String,
  },
  author: Author,
});

const Book = model("Book", bookSchema);
export default Book;
