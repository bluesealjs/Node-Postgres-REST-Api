const express = require("express");
const bodyParser = require("body-parser");
// const dotenv = require( "dotenv");
require("babel-polyfill");
const reflections = require("./api/v1/reflections.js");
// const ReflectionWithDB2 = require("./api/v1/reflections");
// dotenv.config();
// const Reflection = process.env.TYPE === "db" ? ReflectionWithDB : ReflectionWithDB2;

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res
    .status(200)
    .send({ message: "YAY! Congratulations! Your first endpoint is working" });
});

// Use Routes
app.use("/api/v1/reflections", reflections);

app.listen(3000);
console.log("app running on port ", 3000);

/*
We installed babel-polyfill npm package and imported it -
We need this here so that node runtime will recognise async/await and Promise.
*/
