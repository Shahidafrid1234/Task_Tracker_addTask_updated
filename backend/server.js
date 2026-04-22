const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const schema = require("./schema");
const root = require("./resolvers");

const app = express();
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection failed:", err));

app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema: schema,
    rootValue: root,
    graphiql: true,
    context: { req },
  })),
);

app.listen(process.env.PORT || 4000);
