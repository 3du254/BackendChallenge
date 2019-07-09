const express = require("express");
const CostCenter = express.Router();
var sql = require("mssql");
const config = require("../database");

const Joi = require("joi");
CostCenter.get("/", (req, res) => {
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
        .execute("spSelectAllCostCenter", (err, result) => {
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
      CCCode: Joi.string()
        .min(2)
        .max(50)
        .required(),
      CCName: Joi.string()
        .min(3)
        .required(),
      CompCode: Joi.string()
        .min(3)
        .required(),
      Email: Joi.string()
        .min(3)
        .required(),
      Telephone: Joi.string()
        .min(3)
        .required(),
      Mobile: Joi.string()
        .min(3)
        .required(),
      PostalAddress: Joi.string()
        .min(3)
        .required(),
      PhysicalAddress: Joi.string()
        .min(3)
        .required(),
      WebUrl: Joi.string()
        .min(3)
        .required(),
      Status: Joi.bool().required()
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
            .input("CCCode", sql.VarChar, req.body.CCCode)
            .input("CCName", sql.VarChar, req.body.CCName)
            .input("CompCode", sql.VarChar, req.body.CompCode)
            .input("Email", sql.VarChar, req.body.Email)
            .input("Telephone", sql.VarChar, req.body.Telephone)
            .input("Mobile", sql.VarChar, req.body.Mobile)
            .input("PostalAddress", sql.VarChar, req.body.PostalAddress)
            .input("PhysicalAddress", sql.VarChar, req.body.PhysicalAddress)
            .input("WebUrl", sql.VarChar, req.body.WebUrl)
            .input("Status", sql.Bit, req.body.Status)
            .input("Terminus", sql.VarChar, req.ip[0])
            .input("UserID", sql.VarChar, res.locals.user)
            .execute("spSaveCostCenter", (err, result) => {
              if (err) {
                res.json({
                  success: false,
                  message: err.message
                });
              } else {
                res.json({
                  success: true,
                  message: "Saved"
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
  .delete("/:CCCode", (req, res) => {
    const CCCode = req.params.CCCode;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({
          success: false,
          message: error.message
        });
      } else {
        const request = new sql.Request(pool)
          .input("CCCode", sql.VarChar, CCCode)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip[0])
          .execute("spDeleteCostCenter", (err, result) => {
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
  .get("/:CCCode", (req, res) => {
    const CCCode = req.params.CCCode;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({
          success: false,
          message: error.message
        });
      } else {
        const request = new sql.Request(pool)
        .input("CCCode", sql.VarChar, CCCode)
        .input("UserID", sql.VarChar, res.locals.user)
        .input("Terminus", sql.VarChar, req.ip[0])
        .execute("spSelectCostCenter", (err, result) => {
          if (err) {
            res.json({
              success: false,
              message: err.message
            });
          } else {
            res.status(200).send(result.recordset);
          }
          
        });
      }
    });
  });

module.exports = CostCenter;
