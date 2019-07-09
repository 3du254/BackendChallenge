const express = require("express");
const ClaimTypes = express.Router();
const Joi = require("joi");
var sql = require("mssql");
const config = require("../../database");

ClaimTypes.get("/", (req, res) => {
  const pool = new sql.ConnectionPool(config);
  pool.connect(error => {
    if (error) {
      res.json({ success: false, essage: error.message });
    } else {
      new sql.Request(pool)

        .input("UserID", sql.VarChar, res.locals.user)
        .input("Terminus", sql.VarChar, req.ip)
        .execute("spSelectAllClaimTypes", (err, result) => {
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
      TypeCode: Joi.string().required(),
      Category: Joi.string().required(),
      TypeName: Joi.string().required()
    });
    const result = Joi.validate(req.body, schema);
    if (!result.error) {
      const pool = new sql.ConnectionPool(config);
      pool.connect(error => {
        if (error) {
          res.json({ success: false, message: error.message });
        }
        new sql.Request(pool)

          .input("TypeCode", sql.VarChar, req.body.TypeCode)
          .input("Category", sql.VarChar, req.body.Category)
          .input("TypeName", sql.VarChar, req.body.TypeName)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .execute("spSaveClaimTypes", (err, result) => {
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
  .delete("/:TypeCode", (req, res) => {
    const TypeCode = req.params.TypeCode;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({ success: false, message: error.message });
      } else {
        new sql.Request(pool)
          .input("TypeCode", sql.VarChar, TypeCode)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .execute("spDeleteClaimTypes", (err, result) => {
            if (err) {
              res.json({ success: false, message: err.message });
            } else {
              res.json({ success: true, message: "deleted" });
            }
          });
      }
    });
  })
  .get("/:TypeCode", (req, res) => {
    const TypeCode = req.params.TypeCode;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({ success: false, message: error.message });
      } else {
        new sql.Request(pool)
          .input("TypeCode", sql.VarChar, TypeCode)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .execute("spSelectClaimTypes", (err, result) => {
            if (err) {
              res.json({ success: false, message: err.message });
            } else {
              res.status(200).send(result.recordset);
            }
          });
      }
    });
  });
module.exports = ClaimTypes;
