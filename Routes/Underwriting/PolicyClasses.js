const express = require("express");
const PolicyClasses = express.Router();
var sql = require("mssql");
const config = require("../../database");

const Joi = require("joi");

PolicyClasses.get("/", (req, res) => {
  const pool = new sql.ConnectionPool(config);
  pool.connect(error => {
    if (error) {
      res.json({
        success: false,
        message: error.message
      });
    } else {
      const request = new sql.Request(pool);
      request.input("UserID", sql.VarChar, res.locals.user);
      request.input("CompCode", sql.VarChar, res.locals.CompCode);
      request.input("Terminus", sql.VarChar, req.ip[0]);
      request.execute("spSelectAllPolicyClasses", (err, result) => {
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
      PolicyCode: Joi.string()
        .min(1)
        .max(50)
        .required(),
      PolicyName: Joi.string()
        .min(3)
        .max(200)
        .required(),
      Category: Joi.string()
        .min(1)
        .max(50)
        .required(),
      InsuranceCompany: Joi.string()
        .allow("")
        .allow(null),
      STDPolicyNo: Joi.string()
        .allow("")
        .allow(null),
      SpecificDates: Joi.boolean(),
      Renewable: Joi.boolean(),
      AllowMoreThan1Yr: Joi.boolean(),
      PolicyDetails: Joi.string(),
      CoverDates: Joi.string(),
      AdminFee: Joi.number().required(),
      CommisionRate: Joi.number().required()
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

          request.input("PolicyCode", sql.VarChar, req.body.PolicyCode);
          request.input("CompCode", sql.VarChar, res.locals.CompCode);
          request.input("PolicyName", sql.VarChar, req.body.PolicyName);
          request.input("Category", sql.VarChar, req.body.Category);
          request.input("CommisionRate", sql.Float, req.body.CommisionRate);
          request.input("AdminFee", sql.Float, req.body.AdminFee);
          request.input("CoverDates", sql.VarChar, req.body.CoverDates);

          request.input("Specificdates", sql.Bit, req.body.SpecificDates);
          request.input("Renewable", sql.Bit, req.body.Renewable);
          request.input("AllowMoreThan1Yr", sql.Bit, req.body.AllowMoreThan1Yr);
          request.input("PolicyDetails", sql.VarChar, req.body.PolicyDetails);
          request.input(
            "InsuranceCompany",
            sql.VarChar,
            req.body.InsuranceCompany
          );

          request.input("STDPolicyNo", sql.VarChar, req.body.STDPolicyNo);
          request.input("UserID", sql.VarChar, res.locals.user);
          request.input("Terminus", sql.VarChar, req.ip[0]);
          request.execute("spSavePolicyClasses", (err, result) => {
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
  .delete("/:PolicyCode", (req, res) => {
    const PolicyCode = req.params.PolicyCode;
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
        request.input("PolicyCode", sql.VarChar, PolicyCode);
        request.input("UserID", sql.VarChar, res.locals.user);
        request.input("Terminus", sql.VarChar, req.ip[0]);
        request.execute("spDeletePolicyClasses", (err, result) => {
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
  .get("/:PolicyCode", (req, res) => {
    const PolicyCode = req.params.PolicyCode;
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
        request.input("UserID", sql.VarChar, res.locals.user);
        request.input("PolicyCode", sql.VarChar, PolicyCode);
        request.input("Terminus", sql.VarChar, req.ip[0]);
        request.execute("spSelectPolicyClasses", (err, result) => {
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

module.exports = PolicyClasses;
