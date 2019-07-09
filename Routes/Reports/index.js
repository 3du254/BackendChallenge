const express = require("express");
const Report = express.Router();
//const pdfTemplate = require("./TestReport");
const pdfTemplate = require("./testreport2");
var pdf = require("html-pdf");
Report.post("/create-pdf", (req, res) => {
  pdf.create(pdfTemplate(req.body), {}).toFile("p.pdf", err => {
    if (err) {
      return console.log("error");
    }
    res.send(Promise.resolve());
  });
});
Report.get("/fetch-pdf", (req, res) => {
  res.sendFile(`${__dirname / GeneratedReports}/p.pdf`);
  //res.sendFile(`${__dirname / GeneratedReports}/p.pdf`);
});
module.exports = Report;
