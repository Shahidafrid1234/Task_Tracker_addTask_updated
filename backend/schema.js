const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type Task {
        id: ID!
        title: String!
        description: String
        dueDate: String
        priority: String!
        completed: Boolean!
        createdAt: String
    }

    type Query {
        tasks: [Task]
    }

    type Mutation {
        addTask(title: String!, description: String, dueDate: String, priority: String): Task
        updateTask(id: ID!, title: String!, description: String, dueDate: String, priority: String): Task
        deleteTask(id: ID!): String
        toggleTask(id: ID!): Task
    }
`);

module.exports = schema;
