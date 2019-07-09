const express = require("express");
const PaymentModes = express.Router();
var sql = require("mssql");
const config = require("../../database");

const Joi = require("joi");

PaymentModes.get("/", (req, res) => {
  const pool = new sql.ConnectionPool(config);
  pool.connect(error => {
    if (error) {
      res.json({
        success: false,
        message: error.message
      });
    } else {
      const request = new sql.Request(pool).execute(
        "spSelectAllModesOfpayments",
        (err, result) => {
          if (err) {
            res.json({
              success: false,
              message: err.message
            });
          } else {
            res.status(200).json(result.recordset);
          }
        }
      );
    }
  });
})
  .post("/", (req, res) => {
    const schema = Joi.object().keys({
      Code: Joi.string()
        .min(3)
        .max(500)
        .required(),
      Name: Joi.string()
        .min(3)
        .max(500)
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
          const request = new sql.Request(pool);
          request.input("CompCode", sql.VarChar, res.locals.CompCode);
          request.input("Code", sql.VarChar, req.body.Code);
          request.input("Name", sql.VarChar, req.body.Name);
          request.input("UserId", sql.VarChar, res.locals.user);
          request.input("Terminus", sql.VarChar, req.ip[0]);
          request.execute("spSaveModesOfpayments", (err, result) => {
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
  .delete("/:Code", (req, res) => {
    const Code = req.params.Code;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({
          success: false,
          message: error.message
        });
      } else {
        const request = new sql.Request(pool);
        request.input("CompCode", sql.VarChar, res.locals.CompCode);
        request.input("Code", sql.VarChar, Code);
        request.input("UserId", sql.VarChar, res.locals.user);
        request.input("Terminus", sql.VarChar, req.ip[0]);
        request.execute("spDeleteModesOfpayments", (err, result) => {
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
  .get("/:Code", (req, res) => {
    const Code = req.params.Code;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({
          success: false,
          message: error.message
        });
      } else {
        const request = new sql.Request(pool);
        request.input("CompCode", sql.VarChar, res.locals.CompCode);
        request.input("Code", sql.VarChar, Code);
        request.execute("spSelectModesOfpayments", (err, result) => {
          if (err) {
            res.json({
              success: false,
              message: err.message
            });
          } else {
            res.status(200).json(result.recordset);
          }
          sql.close();
        });
      }
    });
  });

module.exports = PaymentModes;
