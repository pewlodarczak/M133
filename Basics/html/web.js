const express = require("express");
const router = express.Router();
const homeController = require("./home");
const uploadController = require("./upl");

let routes = app => {
  router.get("/", homeController.getHome);

  router.post("/upload", uploadController.uploadFile);

  return app.use("/", router);
};

module.exports = routes;
