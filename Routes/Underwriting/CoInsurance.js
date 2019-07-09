const express = require("express");
const CoInsurance = express.Router();
const Joi = require("joi");
var sql = require("mssql");
const config = require("../../database");
CoInsurance.get("/", (req, res) => {
  const pool = new sql.ConnectionPool(config);
  pool.connect(error => {
    if (error) {
      res.json({ success: false, essage: error.message });
    } else {
      new sql.Request(pool)
        .input("CompCode", sql.VarChar, res.locals.CompCode)
        // .input("UserID", sql.VarChar, res.locals.user)
        // .input("Terminus", sql.VarChar, req.ip)
        .execute("spSelectAllCoInsurance", (err, result) => {
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
      Insurer1: Joi.string().required(),
      Insurer2: Joi.string().required(),
      Insurer1Rate: Joi.number().required(),
      Insurer2Rate: Joi.number().required(),
      AllowStampDuty: Joi.boolean(),
      Deleted: Joi.boolean()
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

          .input("Insurer1", sql.VarChar, req.body.Insurer1)
          .input("Insurer2", sql.VarChar, req.body.Insurer2)
          .input("Insurer1Rate", sql.Float, req.body.Insurer1Rate)
          .input("Insurer2Rate", sql.Float, req.body.Insurer2Rate)
          .input("AllowStampDuty", sql.Bit, req.body.AllowStampDuty)

          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .execute("spSaveCoInsurance", (err, result) => {
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
  .delete("/:CoID", (req, res) => {
    const CoID = req.params.CoID;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({ success: false, message: error.message });
      } else {
        new sql.Request(pool)
          .input("CoID", sql.VarChar, CoID)
          .input("CompCode", sql.VarChar, res.locals.CompCode)
          //   .input("UserID", sql.VarChar, res.locals.user)
          //   .input("Terminus", sql.VarChar, req.ip)
          .execute("spDeleteCoInsurance", (err, result) => {
            if (err) {
              res.json({ success: false, message: err.message });
            } else {
              res.json({ success: true, message: "deleted" });
            }
          });
      }
    });
  })
  .get("/:CoID", (req, res) => {
    const CoID = req.params.CoID;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({ success: false, message: error.message });
      } else {
        new sql.Request(pool)
          .input("CoID", sql.VarChar, CoID)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .execute("spSelectCoInsurance", (err, result) => {
            if (err) {
              res.json({ success: false, message: err.message });
            } else {
              res.status(200).send(result.recordset);
            }
          });
      }
    });
  });
module.exports = CoInsurance;
