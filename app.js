const fs = require("fs");
const express = require("express");
const { engine } = require("express-handlebars");
const basicAuth = require("express-basic-auth");
const data = require("./data");

const app = express();
app.use(express.static("public"));

const myAuthorizer = (username, password) => {
  let jsonUsers = fs.readFileSync(__dirname + "/userData.json");
  let users = JSON.parse(jsonUsers);
  return users.some((obj) => {
    if (username === obj.username && password === obj.password) {
      return true;
    } else {
      return false;
    }
  });
};

app.use(
  basicAuth({
    authorizer: myAuthorizer,
    challenge: true,
  })
);

app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("home", data);
});

app.get("/about", (req, res) => {
  res.render("about", { layout: "other", name: "claire" });
});

app.listen(3000, () => {
  console.log("Listening to port 3000");
});
