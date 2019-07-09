 const express = require("express");
 const PremiumCalculator = express.Router();
 const Joi = require("joi");
 var sql = require("mssql");
 const config = require("../../database");
 PremiumCalculator.get("/", (req, res) => {
     const pool = new sql.ConnectionPool(config);
     pool.connect(error => {
       if (error) {
         res.json({
           success: false,
           essage: error.message
         });
       } else {
         new sql.Request(pool)

           .input("UserID", sql.VarChar, res.locals.user)
           .input("Terminus", sql.VarChar, req.ip)
           .execute('spSelectAllPremiumCalculator', (err, result) => {
             if (err) {
               res.json({
                 success: false,
                 message: err.message
               });
             } else {
               res.status(200).json(result.recordset);
             }
           })
       }
     });
   })
   .post("/", (req, res) => {
     const schema = Joi.object().keys({
       CalcCode: Joi.string().required(),
       CalcName: Joi.string().required(),
       Description: Joi.string().required(),
       Item: Joi.string().required(),
       AddBrokerRate: Joi.boolean(),
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

           .input("CalcCode", sql.VarChar, req.body.CalcCode)
           .input("CalcName", sql.VarChar, req.body.CalcName)
           .input("Description", sql.VarChar, req.body.Description)
           .input("Item", sql.VarChar, req.body.Item)
           .input("AddBrokerRate", sql.Bit, req.body.AddBrokerRate)
           .input("UserID", sql.VarChar, res.locals.user)
           .input("Terminus", sql.VarChar, req.ip)
           .execute('spSavePremiumCalculator', (err, result) => {
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
   .delete("/:CalcCode/:Item", (req, res) => {
     const CalcCode = req.params.CalcCode;
     const Item = req.params.Item;
     const pool = new sql.ConnectionPool(config);
     pool.connect(error => {
       if (error) {
         res.json({
           success: false,
           message: error.message
         });
       } else {
         new sql.Request(pool)
           .input("CalcCode", sql.VarChar, CalcCode).input("Item", sql.VarChar, Item)
           .input("UserID", sql.VarChar, res.locals.user)
           .input("Terminus", sql.VarChar, req.ip)
           .execute("spDeletePremiumCalculator", (err, result) => {
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
   .get("/:CalcCode/:Item", (req, res) => {
     const CalcCode = req.params.CalcCode;
     const Item = req.params.Item;
     const pool = new sql.ConnectionPool(config);
     pool.connect(error => {
       if (error) {
         res.json({
           success: false,
           message: error.message
         });
       } else {
         new sql.Request(pool)
           .input("CalcCode", sql.VarChar, CalcCode).input("Item", sql.VarChar, Item)
           .input("UserID", sql.VarChar, res.locals.user)
           .input("Terminus", sql.VarChar, req.ip)
           .execute("spSelectPremiumCalculator", (err, result) => {
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
 module.exports = PremiumCalculator;