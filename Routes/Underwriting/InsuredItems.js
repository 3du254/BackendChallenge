const express = require("express");
const InsuredItems = express.Router();
const Joi = require("joi");
var sql = require("mssql");
const config = require("../../database");
InsuredItems.get("/", (req, res) => {
  const pool = new sql.ConnectionPool(config);
  pool.connect(error => {
    if (error) {
      res.json({ success: false, essage: error.message });
    } else {
      new sql.Request(pool)
        .input("CompCode", sql.VarChar, res.locals.CompCode)

        .execute("spSelectAllInsuredItems", (err, result) => {
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
      MemberNo: Joi.string().required(),
      ItemType: Joi.string().required(),
      ItemReffNo: Joi.string().required(),
      ItemDesc: Joi.string().required(),
      Narration: Joi.string().required(),
      TotalSumInsured: Joi.number().required(),
      DMSDocRef: Joi.string().required(),
      principleMember: Joi.string()
        .allow("")
        .allow(null),
      MotorVehicle: Joi.string()
        .allow("")
        .allow(null)
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
          .input("MemberNo", sql.VarChar, req.body.MemberNo)
          .input("ItemType", sql.VarChar, req.body.ItemType)
          .input("ItemReffNo", sql.VarChar, req.body.ItemReffNo)
          .input("ItemDesc", sql.VarChar, req.body.ItemDesc)
          .input("Narration", sql.VarChar, req.body.Narration)
          .input("TotalSumInsured", sql.Float, req.body.TotalSumInsured)
          .input("DMSDocRef", sql.VarChar, req.body.DMSDocRef)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .input("principleMember", sql.VarChar, req.body.principleMember)
          .input("MotorVehicle", sql.VarChar, req.body.MotorVehicle)
          .execute("spSaveInsuredItems", (err, result) => {
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
  .delete("/:MemberNo/:ItemReffNo", (req, res) => {
    const MemberNo = req.params.MemberNo;
    const ItemReffNo = req.params.ItemReffNo;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({ success: false, message: error.message });
      } else {
        new sql.Request(pool)
          .input("CompCode", sql.VarChar, res.locals.CompCode)
          .input("MemberNo", sql.VarChar, MemberNo)
          .input("ItemReffNo", sql.VarChar, ItemReffNo)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)

          .execute("spDeleteInsuredItems", (err, result) => {
            if (err) {
              res.json({ success: false, message: err.message });
            } else {
              res.json({ success: true, message: "deleted" });
            }
          });
      }
    });
  })
  .get("/:MemberNo/:ItemReffNo", (req, res) => {
    const MemberNo = req.params.MemberNo;
    const ItemReffNo = req.params.ItemReffNo;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({ success: false, message: error.message });
      } else {
        new sql.Request(pool)
          .input("MemberNo", sql.VarChar, MemberNo)
          .input("ItemReffNo", sql.VarChar, ItemReffNo)
          .input("UserID", sql.VarChar, res.locals.user)
          .input("Terminus", sql.VarChar, req.ip)
          .execute("spSelectInsuredItems", (err, result) => {
            if (err) {
              res.json({ success: false, message: err.message });
            } else {
              res.status(200).send(result.recordset);
            }
          });
      }
    });
  });
module.exports = InsuredItems;
