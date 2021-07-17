const express = require("express");
const { v4: uuidV4 } = require("uuid");
const cors = require("cors");

const app = express();

const users = [];
const todos = [];

app.use(cors());
app.use(express.json());

function checksExistsUserAccount(request, response, next) {
  const { user_id } = request.headers;

  const user = users.find((item) => item.id === user_id);

  if (!user) response.status(400).json({ error: "User not found" });

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const user = { id: uuidV4(), name, username };

  users.push(user);

  response.json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  const todosByUser = todos.filter((item) => item.user_id === user.id);

  response.json(todosByUser);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  const { title, deadline } = request.body;

  const todo = { id: uuidV4(), user_id: user.id, title, deadline };

  todos.push(todo);

  response.json(todo);
});

app.listen(3333, () => {
  console.log("Server is running on port 3333! 🚀");
});
