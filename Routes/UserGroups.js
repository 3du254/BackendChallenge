const express = require("express");
const Usergroups = express.Router();
var sql = require("mssql");
const config = require("../database");

const Joi = require("joi");

Usergroups.get("/", (req, res) => {
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
      request.input("Terminus", sql.VarChar, req.ip[0]);
      request.execute("spSelectAllUserGroups", (err, result) => {
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
      UserName: Joi.string()
        .min(2)
        .max(50)
        .required(),
      GroupCode: Joi.string()
        .min(3)
        .required(),
      Narration: Joi.string()
        .min(3)
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
          request.input("UserName", sql.VarChar, req.body.UserName);
          request.input("GroupCode", sql.VarChar, req.body.GroupCode);
          request.input("Narration", sql.VarChar, req.body.Narration);
          request.input("Terminus", sql.VarChar, req.ip[0]);
          request.input("UserID", sql.VarChar, res.locals.user);
          request.execute("spSaveUserGroups", (err, result) => {
            if (err) {
              res.json({ success: false, message: err.message });
            } else {
              res.json({ success: true, message: "Saved" });
            }
          });
        }
      });
    } else {
      res.json({ success: false, message: result.error.details[0].message });
    }
  })
  .delete("/:UserName/:GroupCode", (req, res) => {
    const UserName = req.params.UserName;
    const GroupCode = req.params.GroupCode;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({
          success: false,
          message: error.message
        });
      } else {
        const request = new sql.Request(pool);
        request.input("UserName", sql.VarChar, UserName);
        request.input("GroupCode", sql.VarChar, GroupCode);
        request.input("UserID", sql.VarChar, res.locals.user);
        request.input("Terminus", sql.VarChar, req.ip[0]);
        request.execute("spDeleteUserGroups", (err, result) => {
          if (err) {
            res.json({ success: false, message: err.message });
          } else {
            res.json({ success: true, message: "deleted" });
          }
        });
      }
    });
  })
  .get("/:UserName/:GroupCode", (req, res) => {
    let UserName = req.params.UserName;
    let GroupCode = req.params.GroupCode;
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({
          success: false,
          message: error.message
        });
      } else {
        const request = new sql.Request(pool);
        request.input("UserName", sql.VarChar, UserName);
        request.input("GroupCode", sql.VarChar, GroupCode);
        request.input("UserID", sql.VarChar, res.locals.user);
        request.input("Terminus", sql.VarChar, req.ip[0]);
        request.execute("spSelectUserGroups", (err, result) => {
          if (err) {
            res.json({ success: false, message: err.message });
          } else {
            res.status(200).send(result.recordset);
          }
        });
      }
    });
  });

module.exports = Usergroups;
