const express = require("express");
const FamilyDependants = express.Router();
const Joi = require("joi");
var sql = require("mssql");
const config = require("../../database");

FamilyDependants.get("/", (req, res) => {
  const pool = new sql.ConnectionPool(config);
  pool.connect(error => {
    if (error) {
      res.json({ success: false, essage: error.message });
    } else {
      new sql.Request(pool)
        .input("CompCode", sql.VarChar, res.locals.CompCode)
        .execute("spSelectAllFamilyDependants", (err, result) => {
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
      MemberCode: Joi.string().required(),
      Names: Joi.string().required(),
      DOB: Joi.date().required(),
      Gender: Joi.string().required(),
      Address: Joi.string().required(),
      Mobile: Joi.string().required(),
      Telephone: Joi.string().required(),
      Email: Joi.string().required(),
      Town: Joi.string().required(),
      IDNO: Joi.string().required(),
      PassportNo: Joi.string().required()
    });
    const result = Joi.validate(req.body, schema);

    if (!result.error) {
      const pool = new sql.ConnectionPool(config);
      pool.connect(error => {
        if (error) {
          res.json({
            success: "false",
            message: error.message
          });
        } else {
          const request = new sql.Request(pool);
          request.input("CompCode", sql.VarChar, res.locals.CompCode);
          request.input("MemberCode", sql.VarChar, req.body.MemberCode);
          request.input("Names", sql.VarChar, req.body.Names);
          request.input("DOB", sql.Date, req.body.DOB);
          request.input("Gender", sql.VarChar, req.body.Gender);
          request.input("Address", sql.VarChar, req.body.Address);
          request.input("Mobile", sql.VarChar, req.body.Mobile);
          request.input("Telephone", sql.VarChar, req.body.Telephone);
          request.input("Email", sql.VarChar, req.body.Email);
          request.input("Town", sql.VarChar, req.body.Town);
          request.input("IDNO", sql.VarChar, req.body.IDNO);
          request.input("PassportNo", sql.VarChar, req.body.PassportNo);
          request.input("UserID", sql.VarChar, res.locals.user);
          request.input("Terminus", sql.VarChar, req.ip);

          request.execute("spsaveFamilyDependants", (err, result) => {
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
  .delete("/:DependantCode", (req, res) => {
    const DependantCode = req.params.DependantCode;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({ success: false, message: error.message });
      } else {
        new sql.Request(pool)
          .input("DependantCode", sql.VarChar, DependantCode)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .execute("spDeleteFamilyDependants", (err, result) => {
            if (err) {
              res.json({ success: false, message: err.message });
            } else {
              res.json({ success: true, message: "deleted" });
            }
          });
      }
    });
  })
  .get("/:DependantCode", (req, res) => {
    const DependantCode = req.params.DependantCode;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({ success: false, message: error.message });
      } else {
        new sql.Request(pool)
          .input("DependantCode", sql.VarChar, DependantCode)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .execute("spSelectFamilyDependants", (err, result) => {
            if (err) {
              res.json({ success: false, message: err.message });
            } else {
              res.status(200).send(result.recordset);
            }
          });
      }
    });
  })
  .put("/", (req, res) => {
    const schema = Joi.object().keys({
      DependantCode: Joi.string().required(),
      MemberCode: Joi.string().required(),
      Names: Joi.string().required(),
      DOB: Joi.date().required(),
      Gender: Joi.string().required(),
      Address: Joi.string().required(),
      Mobile: Joi.string().required(),
      Telephone: Joi.string().required(),
      Email: Joi.string().required(),
      Town: Joi.string().required(),
      IDNO: Joi.string().required(),
      PassportNo: Joi.string().required()
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
          .input("MemberCode", sql.VarChar, req.body.MemberCode)
          .input("DependantCode", sql.VarChar, req.body.DependantCode)
          .input("Names", sql.VarChar, req.body.Names)
          .input("DOB", sql.date, req.body.DOB)
          .input("Gender", sql.VarChar, req.body.Gender)
          .input("Address", sql.VarChar, req.body.Address)
          .input("Mobile", sql.VarChar, req.body.Mobile)
          .input("Telephone", sql.VarChar, req.body.Telephone)
          .input("Email", sql.VarChar, req.body.Email)
          .input("Town", sql.VarChar, req.body.Town)
          .input("IDNO", sql.VarChar, req.body.IDNO)
          .input("PassportNo", sql.VarChar, req.body.PassportNo)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .execute("spUpdateFamilyDependants", (err, result) => {
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
  });
module.exports = FamilyDependants;
