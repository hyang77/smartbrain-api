const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcrypt-nodejs");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

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

app.post("/signin", signin.handleSignin(database, bcrypt));
app.post("/register", register.handleRegister(database, bcrypt));

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, database);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, database);
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
