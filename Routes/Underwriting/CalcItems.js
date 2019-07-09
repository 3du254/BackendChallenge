 const express = require("express");
 const PremiumCalculatorItem = express.Router();
 const Joi = require("joi");
 var sql = require("mssql");
 const config = require("../../database");

 PremiumCalculatorItem.get("/", (req, res) => {
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
           .execute('spSelectAllPremiumCalculatorItem', (err, result) => {
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
       ItemCode: Joi.string().required(),
       ItemName: Joi.string().required(),
       ItemGroup: Joi.string().required(),
       ControlAcc: Joi.string().required(),
       RateType: Joi.string().required(),
       Method: Joi.string().required(),
       Rate: Joi.number().required(),
       OrderNumber: Joi.number().required(),
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

           .input("ItemCode", sql.VarChar, req.body.ItemCode)
           .input("ItemName", sql.VarChar, req.body.ItemName)
           .input("ItemGroup", sql.VarChar, req.body.ItemGroup)
           .input("ControlAcc", sql.VarChar, req.body.ControlAcc)
           .input("RateType", sql.VarChar, req.body.RateType)
           .input("Method", sql.VarChar, req.body.Method)
           .input("Rate", sql.Float, req.body.Rate)
           .input("OrderNumber", sql.Float, req.body.OrderNumber)
           .input("UserID", sql.VarChar, res.locals.user)
           .input("Terminus", sql.VarChar, req.ip)
           .execute('spSavePremiumCalculatorItem', (err, result) => {
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
   .delete("/:ItemCode", (req, res) => {
     const ItemCode = req.params.ItemCode;
     const pool = new sql.ConnectionPool(config);
     pool.connect(error => {
       if (error) {
         res.json({
           success: false,
           message: error.message
         });
       } else {
         new sql.Request(pool)
           .input("ItemCode", sql.VarChar, ItemCode)
           .input("UserID", sql.VarChar, res.locals.user)
           .input("Terminus", sql.VarChar, req.ip)
           .execute("spDeletePremiumCalculatorItem", (err, result) => {
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
   .get("/:ItemCode", (req, res) => {
     const ItemCode = req.params.ItemCode;
     const pool = new sql.ConnectionPool(config);
     pool.connect(error => {
       if (error) {
         res.json({
           success: false,
           message: error.message
         });
       } else {
         new sql.Request(pool)
           .input("ItemCode", sql.VarChar, ItemCode)
           .input("UserID", sql.VarChar, res.locals.user)
           .input("Terminus", sql.VarChar, req.ip)
           .execute("spSelectPremiumCalculatorItem", (err, result) => {
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
 module.exports = PremiumCalculatorItem;