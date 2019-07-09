const express = require("express");
const Roles = express.Router();
var sql = require("mssql");
const config = require("../database");

const Joi = require("joi");

Roles.get("/", (req, res) => {
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
        .execute("spSelectAllSecurityGroups", (err, result) => {
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
      GroupCode: Joi.string()
        .min(3)
        .max(50)
        .required(),
      GroupName: Joi.string()
        .min(3)
        .max(50)
        .required(),
      Narration: Joi.string()
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
          const request = new sql.Request(pool)
            .input("GroupCode", sql.VarChar, req.body.GroupCode)
            .input("GroupName", sql.VarChar, req.body.GroupName)
            .input("Narration", sql.VarChar, req.body.Narration)
            .input("UserID", sql.VarChar, res.locals.user)
            .input("Terminus", sql.VarChar, req.ip[0])
            .execute("spSaveSecurityGroups", (err, result) => {
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
  .delete("/:GroupCode", (req, res) => {
    const GroupCode = req.params.GroupCode;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({
          success: false,
          message: error.message
        });
      } else {
        const request = new sql.Request(pool)
          .input("GroupCode", sql.VarChar, GroupCode)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip[0])
          .execute("spDeleteSecurityGroups", (err, result) => {
            if (err) {
              res.json({
                success: false,
                message: err.message
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
  .get("/:GroupCode", (req, res) => {
    const GroupCode = req.params.GroupCode;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({
          success: false,
          message: error.message
        });
      } else {
        const request = new sql.Request(pool)
          .input("GroupCode", sql.VarChar, GroupCode)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip[0])
          .execute("spSelectSecurityGroups", (err, result) => {
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

module.exports = Roles;
