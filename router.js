const FIFController = require("./controllers/fif");
const express = require("express");

module.exports = function(app) {
  const apiRoutes = express.Router();
  const fifRoutes = express.Router();

  apiRoutes.use("/fif", fifRoutes);

  fifRoutes.get("/", FIFController.dummy); 
  fifRoutes.post("/", FIFController.generateAccessToken); 
  fifRoutes.get("/branches/:dprn", FIFController.getBranchInfo);
  fifRoutes.get("/extracts/master", FIFController.getMasterExtractData);

  app.use("/api", apiRoutes);
}