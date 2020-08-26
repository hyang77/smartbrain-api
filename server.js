const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");

const database = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "test",
    database: "smart-brain",
  },
});

database
  .select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  });

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = {
  users: [
    {
      id: "123",
      name: "john",
      email: "john@gmail.com",
      password: "cookies",
      entries: "0",
      joined: new Date(),
    },
    {
      id: "123",
      name: "holly",
      email: "holly@gmail.com",
      password: "session",
      entries: "0",
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.send(db.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === db.users[0].email &&
    req.body.password === db.users[0].password
  ) {
    res.json(db.users[0]);
  } else {
    res.json("fail to signin");
  }
});

app.post("/register", (req, res) => {
  const { email, password, name } = req.body;
  database("users")
    .returning("*")
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => {
      res.status(400).json("unable to register");
    });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  database
    .select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found!");
      }
    })
    .catch((err) => res.status(400).json("error getting user"));

  // if (!found) {
  //   res.status(404).json("not found");
  // }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  database('users')
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    }).catch(err => res.status(400).json('unable to get entries'));
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
