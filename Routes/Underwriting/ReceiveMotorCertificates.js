const express = require("express");
const ReceiveMotorCertificates = express.Router();
const Joi = require("joi");
var sql = require("mssql");
const config = require("../../database");
ReceiveMotorCertificates.get("/", (req, res) => {
  const pool = new sql.ConnectionPool(config);
  pool.connect(error => {
    if (error) {
      res.json({ success: false, essage: error.message });
    } else {
      new sql.Request(pool)
        .input("CompCode", sql.VarChar, res.locals.CompCode)

        .execute("spSelectAllReceiveMotorCertificates", (err, result) => {
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
      CertType: Joi.string().required(),
      Datereceived: Joi.date().required(),
      Abbreviation: Joi.string().required(),
      InsuranceCompany: Joi.string().required(),
      FirstNo: Joi.number().required(),
      LastNo: Joi.number().required(),
      CostCenter: Joi.string().required()
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
          .input("CertType", sql.VarChar, req.body.CertType)
          .input("Datereceived", sql.Date, req.body.Datereceived)
          .input("Abbreviation", sql.VarChar, req.body.Abbreviation)
          .input("InsuranceCompany", sql.VarChar, req.body.InsuranceCompany)
          .input("FirstNo", sql.Float, req.body.FirstNo)
          .input("LastNo", sql.Float, req.body.LastNo)
          .input("CostCenter", sql.VarChar, req.body.CostCenter)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .execute("spSaveReceiveMotorCertificates", (err, result) => {
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
  .delete("/:CertType/:FirstNo/:LastNo", (req, res) => {
    const CertType = req.params.CertType;
    const FirstNo = req.params.FirstNo;
    const LastNo = req.params.LastNo;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({ success: false, message: error.message });
      } else {
        new sql.Request(pool)
          .input("CompCode", sql.VarChar, res.locals.CompCode)
          .input("CertType", sql.VarChar, CertType)
          .input("FirstNo", sql.Float, FirstNo)
          .input("LastNo", sql.Float, LastNo)
          .execute("spDeleteReceiveMotorCertificates", (err, result) => {
            if (err) {
              res.json({ success: false, message: err.message });
            } else {
              res.json({ success: true, message: "deleted" });
            }
          });
      }
    });
  })
  .get("/:CertType/:FirstNo/:LastNo", (req, res) => {
    const CertType = req.params.CertType;
    const FirstNo = req.params.FirstNo;
    const LastNo = req.params.LastNo;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({ success: false, message: error.message });
      } else {
        new sql.Request(pool)
          .input("CompCode", sql.VarChar, res.locals.CompCode)
          .input("CertType", sql.VarChar, CertType)
          .input("FirstNo", sql.float, FirstNo)
          .input("LastNo", sql.float, LastNo)

          .execute("spSelectReceiveMotorCertificates", (err, result) => {
            if (err) {
              res.json({ success: false, message: err.message });
            } else {
              res.status(200).send(result.recordset);
            }
          });
      }
    });
  });
module.exports = ReceiveMotorCertificates;
