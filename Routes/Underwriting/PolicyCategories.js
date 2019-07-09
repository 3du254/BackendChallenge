const express = require("express");
const PolicyCategories = express.Router();
var sql = require("mssql");
const config = require("../../database");

const Joi = require("joi");

PolicyCategories.get("/", (req, res) => {
  const pool = new sql.ConnectionPool(config);
  pool.connect(error => {
    if (error) {
      res.json({
        success: false,
        message: error.message
      });
    } else {
      const request = new sql.Request(pool).execute(
        "spSelectAllPolicyCategories",
        (err, result) => {
          if (err) {
            res.json({
              success: false,
              message: err.message
            });
          } else {
            res.status(200).json(result.recordset);
          }
          sql.close();
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
      Advancemotorins: Joi.boolean().required(),
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
          request.input(
            "Advancemotorins",
            sql.VarChar,
            req.body.Advancemotorins
          );
          request.input("Code", sql.VarChar, req.body.Code);
          request.input("Name", sql.VarChar, req.body.Name);
          request.input("UserID", sql.VarChar, res.locals.user);
          request.input("Terminus", sql.VarChar, req.ip[0]);
          request.execute("spSavePolicyCategories", (err, result) => {
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
            sql.close();
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

        request.input("Code", sql.VarChar, Code);
        request.input("UserId", sql.VarChar, res.locals.user);
        request.input("Terminus", sql.VarChar, req.ip[0]);
        request.execute("spDeletePolicyCategories", (err, result) => {
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

        request.input("Code", sql.VarChar, Code);
        request.execute("spSelectPolicyCategories", (err, result) => {
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

module.exports = PolicyCategories;
