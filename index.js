const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const config = require("config");
const router = require("./router");
const axios = require("axios");

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(logger("dev"));

const server = app.listen(config.port, () => {
  console.log("Server is running on port " + config.port + ".");
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "PATCH, PUT, GET, POST, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Locale, Access-Control-Allow-Credentials"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

axios.interceptors.request.use(request => {
  console.log("Request was sent");
  console.log(request.data);
  console.log(request.body);
  return request;
}, error => {
  console.log(error)
  return Promise.reject(error)
});

axios.interceptors.response.use(response => {
  console.log("Response was received");
  console.log(response)
  return response;
}, error => {
  console.log(error.response.data)
  return Promise.reject(error)
});

router(app);

module.exports = server;
