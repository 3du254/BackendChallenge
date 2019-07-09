const express = require("express");
const Insurer = express.Router();
var sql = require("mssql");
const Joi = require("joi");
const config = require("../../database");
Insurer.get("/", (req, res) => {
  const pool = new sql.ConnectionPool(config);
  pool.connect(error => {
    if (error) {
      res.json({ success: false, essage: error.message });
    } else {
      const request = new sql.Request(pool);
      request.input("UserID", sql.VarChar, res.locals.user);
      request.input("Terminus", sql.VarChar, req.ip[0]);
      request.execute("spSelectAllInsurer", (err, result) => {
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
      InsurerCode: Joi.string().required(),
      InsurerName: Joi.string().required(),
      Address: Joi.string().required(),
      City: Joi.string().required(),
      Telephone: Joi.string().required(),
      Mobile: Joi.string().required(),
      Email: Joi.string()
        .email()
        .required(),
      Rate: Joi.number().required(),
      Active: Joi.boolean()
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
        }
        new sql.Request(pool)
          .input("InsurerCode", sql.VarChar, req.body.InsurerCode)
          .input("InsurerName", sql.VarChar, req.body.InsurerName)
          .input("Address", sql.VarChar, req.body.Address)
          .input("City", sql.VarChar, req.body.City)
          .input("Telephone", sql.VarChar, req.body.Telephone)
          .input("Mobile", sql.VarChar, req.body.Mobile)
          .input("Email", sql.VarChar, req.body.Email)
          .input("Rate", sql.Float, req.body.Rate)
          .input("Active", sql.Bit, req.body.Active)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .execute("spSaveInsurer", (err, result) => {
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
      });
    } else {
      res.json({
        success: false,
        message: result.error.details[0].message
      });
    }
  })
  .delete("/:InsurerCode", (req, res) => {
    const InsurerCode = req.params.InsurerCode;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({
          success: false,
          message: error.message
        });
      } else {
        new sql.Request(pool)
          .input("InsurerCode", sql.VarChar, InsurerCode)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .execute("spDeleteInsurer", (err, result) => {
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
  .get("/:InsurerCode", (req, res) => {
    const InsurerCode = req.params.InsurerCode;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({
          success: false,
          message: error.message
        });
      } else {
        new sql.Request(pool)
          .input("InsurerCode", sql.VarChar, InsurerCode)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip[0])
          .execute("spSelectInsurer", (err, result) => {
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

module.exports = Insurer;
