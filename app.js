require("dotenv").config();
const path = require("path");
const homeRouter = require("./Routes/homeRouter.js");
const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use('/', homeRouter);

const PORTM = Number(process.env.PORTM);
app.listen(PORTM, console.log("Succesfully Connected to " + PORTM));