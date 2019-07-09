const express = require("express");
const ClaimsRegister = express.Router();
const Joi = require("joi");
var sql = require("mssql");
const config = require("../../database");
ClaimsRegister.get("/", (req, res) => {
  const pool = new sql.ConnectionPool(config);
  pool.connect(error => {
    if (error) {
      res.json({ success: false, essage: error.message });
    } else {
      new sql.Request(pool)
        .input("CompCode", sql.VarChar, res.locals.CompCode)
        .input("UserID", sql.VarChar, res.locals.user)
        .input("Terminus", sql.VarChar, req.ip)
        .execute("spSelectAllClaimsRegister", (err, result) => {
          if (err) {
            res.json({ success: false, message: err.message });
          } else {
            res.status(200).json(result.recordset);
          }
        });
    }
  });
})
  .post("/", (req, res) => {
    const schema = Joi.object().keys({
      CostCenter: Joi.string().required(),
      Client: Joi.string().required(),
      Claimant: Joi.string().required(),
      ClaimNo: Joi.string().required(),
      InsurerClaimNo: Joi.string().required(),
      ClaimType: Joi.string().required(),
      DateOfLoss: Joi.date().required(),
      DateReportedToBroker: Joi.date().required(),
      DateReportedToInsurer: Joi.date().required(),
      InsuredItems: Joi.string().required(),
      ProposalNo: Joi.string().required(),
      PolicyNo: Joi.string().required(),
      SumInsured: Joi.number().required(),
      Narration: Joi.string().required()
    });
    const result = Joi.validate(req.body, schema);
    if (!result.error) {
      const pool = new sql.ConnectionPool(config);
      pool.connect(error => {
        if (error) {
          res.json({ success: false, message: error.message });
        }
        new sql.Request(pool)
          .input("CompCode", sql.VarChar, res.locals.CompCode)
          .input("CostCenter", sql.VarChar, req.body.CostCenter)
          .input("Client", sql.VarChar, req.body.Client)
          .input("Claimant", sql.VarChar, req.body.Claimant)
          .input("ClaimNo", sql.VarChar, req.body.ClaimNo)
          .input("InsurerClaimNo", sql.VarChar, req.body.InsurerClaimNo)
          .input("ClaimType", sql.VarChar, req.body.ClaimType)
          .input("DateOfLoss", sql.Date, req.body.DateOfLoss)
          .input(
            "DateReportedToBroker",
            sql.Date,
            req.body.DateReportedToBroker
          )
          .input(
            "DateReportedToInsurer",
            sql.Date,
            req.body.DateReportedToInsurer
          )
          .input("InsuredItems", sql.VarChar, req.body.InsuredItems)
          .input("ProposalNo", sql.VarChar, req.body.ProposalNo)
          .input("PolicyNo", sql.VarChar, req.body.PolicyNo)
          .input("SumInsured", sql.Float, req.body.SumInsured)
          .input("Narration", sql.VarChar, req.body.Narration)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .execute("spSaveClaimsRegister", (err, result) => {
            if (err) {
              res.json({ success: false, message: err.message });
            } else {
              res.json({ success: true, message: "saved" });
            }
          });
      });
    } else {
      res.json({ success: false, message: result.error.details[0].message });
    }
  })
  .delete("", (req, res) => {
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({ success: false, message: error.message });
      } else {
        new sql.Request(pool)

          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .execute("spDeleteClaimsRegister", (err, result) => {
            if (err) {
              res.json({ success: false, message: err.message });
            } else {
              res.json({ success: true, message: "deleted" });
            }
          });
      }
    });
  })
  .get("", (req, res) => {
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({ success: false, message: error.message });
      } else {
        new sql.Request(pool)

          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .execute("spSelectClaimsRegister", (err, result) => {
            if (err) {
              res.json({ success: false, message: err.message });
            } else {
              res.status(200).send(result.recordset);
            }
          });
      }
    });
  });
module.exports = ClaimsRegister;
