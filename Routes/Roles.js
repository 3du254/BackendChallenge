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
        .execute("spSelectAllRoles", (err, result) => {
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
      RoleName: Joi.string()
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
          const request = new sql.Request(pool);
          request.input("RoleName", sql.VarChar, req.body.RoleName);
          request.input("Narration", sql.VarChar, req.body.Narration);
          request.input("UserID", sql.VarChar, res.locals.user);
          request.input("Terminus", sql.VarChar, req.ip[0]);
          request.execute("spSaveRoles", (err, result) => {
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
  .delete("/:RoleName", (req, res) => {
    const RoleName = req.params.RoleName;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({
          success: false,
          message: error.message
        });
      } else {
        const request = new sql.Request(pool);
        request.input("RoleName", sql.VarChar, RoleName);
        request.input("UserID", sql.VarChar, res.locals.user);
        request.input("Terminus", sql.VarChar, req.ip[0]);
        request.execute("spDeleteRoles", (err, result) => {
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
  .get("/:RoleName", (req, res) => {
    const RoleName = req.params.RoleName;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({
          success: false,
          message: error.message
        });
      } else {
        const request = new sql.Request(pool);
        request.input("RoleName", sql.VarChar, RoleName);
        request.input("UserID", sql.VarChar, res.locals.user);
        request.input("Terminus", sql.VarChar, req.ip[0]);
        request.execute("spSelectRoles", (err, result) => {
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
