const express = require("express");
const Currency = express.Router();
var sql = require("mssql");
const config = require("../database");

const Joi = require("joi");

Currency.get("/", (req, res) => {
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({
          success: false,
          message: error.message
        });
      } else {
        const request = new sql.Request(pool)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip[0])
          .execute("spSelectAllCurrencies", (err, result) => {
            if (err) {
              res.json({
                success: false,
                message: err.message
              });
            } else {
              res.status(200).json(result.recordset);
            }
          });
      }
    });
  })
  .post("/", (req, res) => {
    const schema = Joi.object().keys({
      CurrCode: Joi.string()
        .min(3)
        .max(50)
        .required(),
      CurrDesc: Joi.string()
        .min(3)
        .max(50)
        .required()
    });

    const result = Joi.validate(req.body, schema);
    if (!result.error) {
      const pool = new sql.ConnectionPool(config);
      pool.connect(error => {
        if (error) {
          res.json({
            success: false,
            message: error.message
          });
        } else {
          const request = new sql.Request(pool)
            .input("CurrCode", sql.VarChar, req.body.CurrCode)
            .input("CurrDesc", sql.VarChar, req.body.CurrDesc)
            .input("CurrPrec", sql.Int, 2)
            .input("UserID", sql.VarChar, res.locals.user)
            .input("Terminus", sql.VarChar, Areq.ip[0])

            .execute("spSaveCurrencies", (err, result) => {
              if (err) {
                res.json({
                  success: false,
                  message: err.message
                });
              } else {
                res.json({
                  success: true,
                  message: "saved"
                });
              }
            });
        }
      });
    } else {
      res.json({
        success: false,
        message: result.error.details[0].message
      });
    }
  })
  .delete("/:CurrCode", (req, res) => {
    const CurrCode = req.params.CurrCode;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({
          success: false,
          message: error.message
        });
      } else {
        const request = new sql.Request(pool)
          .input("CurrCode", sql.VarChar, CurrCode)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, Areq.ip[0])
          .execute("spDeleteCurrencies", (err, result) => {
            if (err) {
              res.json({
                success: false,
                message: err.originalError.message
              });
            } else {
              res.json({
                success: true,
                message: "deleted"
              });
            }
          });
      }
    });
  })
  .get("/:CurrCode", (req, res) => {
    const CurrCode = req.params.CurrCode;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({
          success: false,
          message: error.message
        });
      } else {
        const request = new sql.Request(pool)
          .input("CurrCode", sql.VarChar, CurrCode)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, Areq.ip[0])
          .execute("spSelectCurrencies", (err, result) => {
            if (err) {
              res.json({
                success: false,
                message: err.message
              });
            } else {
              res.status(200).json(result.recordset);
            }
          });
      }
    });
  });

module.exports = Currency;