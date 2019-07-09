const express = require("express");
const FamilyMembers = express.Router();
const Joi = require("joi");
var sql = require("mssql");
const config = require("../../database");
FamilyMembers.get("/", (req, res) => {
  const pool = new sql.ConnectionPool(config);
  pool.connect(error => {
    if (error) {
      res.json({ success: false, essage: error.message });
    } else {
      new sql.Request(pool)
        .input("CompCode", sql.VarChar, res.locals.CompCode)
        .execute("spSelectAllFamilyMember", (err, result) => {
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
      Family: Joi.string().required(),
      Names: Joi.string().required(),
      DOB: Joi.date().required(),
      Gender: Joi.string().required(),
      Address: Joi.string().required(),
      Mobile: Joi.string().required(),
      Telephone: Joi.string().required(),
      Email: Joi.string().required(),
      Town: Joi.string().required(),
      IDNO: Joi.string().required(),
      PassoortNo: Joi.string().required()
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
          request.input("Family", sql.VarChar, req.body.Family);
          request.input("Names", sql.VarChar, req.body.Names);
          request.input("DOB", sql.Date, req.body.DOB);
          request.input("Gender", sql.VarChar, req.body.Gender);
          request.input("Address", sql.VarChar, req.body.Address);
          request.input("Mobile", sql.VarChar, req.body.Mobile);
          request.input("Telephone", sql.VarChar, req.body.Telephone);
          request.input("Email", sql.VarChar, req.body.Email);
          request.input("Town", sql.VarChar, req.body.Town);
          request.input("IDNO", sql.VarChar, req.body.IDNO);
          request.input("PassoortNo", sql.VarChar, req.body.PassoortNo);
          request.input("UserID", sql.VarChar, res.locals.user);
          request.input("Terminus", sql.VarChar, req.ip);

          request.execute("spsaveFamilyMember", (err, result) => {
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
  .delete("/:MemberCode", (req, res) => {
    const MemberCode = req.params.MemberCode;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({ success: false, message: error.message });
      } else {
        new sql.Request(pool)
          .input("MemberCode", sql.VarChar, MemberCode)
          .input("CompCode", sql.VarChar, res.locals.CompCode)

          .execute("spDeleteFamilyMember", (err, result) => {
            if (err) {
              res.json({ success: false, message: err.message });
            } else {
              res.json({ success: true, message: "deleted" });
            }
          });
      }
    });
  })
  .get("/:MemberCode", (req, res) => {
    const MemberCode = req.params.MemberCode;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({ success: false, message: error.message });
      } else {
        new sql.Request(pool)
          .input("MemberCode", sql.VarChar, MemberCode)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .execute("spSelectFamilyMember", (err, result) => {
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
      MemberCode: Joi.string().required(),
      Family: Joi.string().required(),
      Names: Joi.string().required(),
      DOB: Joi.date().required(),
      Gender: Joi.string().required(),
      Address: Joi.string().required(),
      Mobile: Joi.string().required(),
      Telephone: Joi.string().required(),
      Email: Joi.string().required(),
      Town: Joi.string().required(),
      IDNO: Joi.string().required(),
      PassoortNo: Joi.string().required()
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
          .input("Family", sql.VarChar, req.body.Family)
          .input("Names", sql.VarChar, req.body.Names)
          .input("DOB", sql.date, req.body.DOB)
          .input("Gender", sql.VarChar, req.body.Gender)
          .input("Address", sql.VarChar, req.body.Address)
          .input("Mobile", sql.VarChar, req.body.Mobile)
          .input("Telephone", sql.VarChar, req.body.Telephone)
          .input("Email", sql.VarChar, req.body.Email)
          .input("Town", sql.VarChar, req.body.Town)
          .input("IDNO", sql.VarChar, req.body.IDNO)
          .input("PassoortNo", sql.VarChar, req.body.PassoortNo)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .execute("spUpdateFamilyMember", (err, result) => {
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
module.exports = FamilyMembers;
