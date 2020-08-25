const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

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
  db.users.push({
    id: "125",
    name: name,
    email: email,
    entries: "0",
    joined: new Date(),
  });
  res.json(db.users[db.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  db.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }

    if (!found) {
      res.status(404).json("not found");
    }
  });
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  db.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }

    if (!found) {
      res.status(404).json("not found");
    }
  });
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
