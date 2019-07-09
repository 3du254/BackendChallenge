 const express = require("express");
 const MotorVehicle = express.Router();
 const Joi = require("joi");
 var sql = require("mssql");
 const config = require("../../database");

 MotorVehicle.get("/", (req, res) => {
         const pool = new sql.ConnectionPool(config);
         pool.connect(error => {
             if (error) {
                 res.json({
                     success: false,
                     essage: error.message
                 });
             } else {
                 new sql.Request(pool)
                     .input("CompCode", sql.VarChar, res.locals.CompCode)
                     .input("UserID", sql.VarChar, res.locals.user)
                     .input("Terminus", sql.VarChar, req.ip)
                     .execute('spSelectAllMotorVehicle', (err, result) => {
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
             RegNo: Joi.string().required(),
             CostCenter: Joi.string().required(),
             make: Joi.string().required(),
             Model: Joi.string().required(),
             Body: Joi.string().required(),
             Colour: Joi.string().required(),
             ChasisNo: Joi.string().required(),
             EngineNo: Joi.string().required(),
             Fuel: Joi.string().required(),
             SeatCapacity: Joi.string().required(),
             Rating: Joi.number().required(),
             Tonnage: Joi.string().required(),
             YearMDF: Joi.number().required(),
             vehiclevalue: Joi.number().required(),
             WindScreen: Joi.number().required(),
             RadioSystem: Joi.number().required(),
             Accessories: Joi.string().required(),
             FleatName: Joi.string().required(),
             OtherDetails: Joi.string().required(),
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
                     .input("CompCode", sql.VarChar, res.locals.CompCode)
                     .input("RegNo", sql.VarChar, req.body.RegNo)
                     .input("CostCenter", sql.VarChar, req.body.CostCenter)
                     .input("make", sql.VarChar, req.body.make)
                     .input("Model", sql.VarChar, req.body.Model)
                     .input("Body", sql.VarChar, req.body.Body)
                     .input("Colour", sql.VarChar, req.body.Colour)
                     .input("ChasisNo", sql.VarChar, req.body.ChasisNo)
                     .input("EngineNo", sql.VarChar, req.body.EngineNo)
                     .input("Fuel", sql.VarChar, req.body.Fuel)
                     .input("SeatCapacity", sql.VarChar, req.body.SeatCapacity)
                     .input("Rating", sql.Float, req.body.Rating)
                     .input("Tonnage", sql.VarChar, req.body.Tonnage)
                     .input("YearMDF", sql.Float, req.body.YearMDF)
                     .input("vehiclevalue", sql.Float, req.body.vehiclevalue)
                     .input("WindScreen", sql.Float, req.body.WindScreen)
                     .input("RadioSystem", sql.Float, req.body.RadioSystem)
                     .input("Accessories", sql.VarChar, req.body.Accessories)
                     .input("FleatName", sql.VarChar, req.body.FleatName)
                     .input("OtherDetails", sql.VarChar, req.body.OtherDetails)
                     .input("UserID", sql.VarChar, res.locals.user)
                     .input("Terminus", sql.VarChar, req.ip)
                     .execute('spSaveMotorVehicle', (err, result) => {
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
     .delete("/:RegNo", (req, res) => {
         const RegNo = req.params.RegNo;
         const pool = new sql.ConnectionPool(config);
         pool.connect(error => {
             if (error) {
                 res.json({
                     success: false,
                     message: error.message
                 });
             } else {
                 new sql.Request(pool)
                     .input("RegNo", sql.VarChar, RegNo)
                     .input("UserID", sql.VarChar, res.locals.user)
                     .input("Terminus", sql.VarChar, req.ip)
                     .execute("spDeleteMotorVehicle", (err, result) => {
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
     .get("/:RegNo", (req, res) => {
         const RegNo = req.params.RegNo;
         const pool = new sql.ConnectionPool(config);
         pool.connect(error => {
             if (error) {
                 res.json({
                     success: false,
                     message: error.message
                 });
             } else {
                 new sql.Request(pool)
                     .input("RegNo", sql.VarChar, RegNo)
                     .input("UserID", sql.VarChar, res.locals.user)
                     .input("Terminus", sql.VarChar, req.ip)
                     .execute("spSelectMotorVehicle", (err, result) => {
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
 module.exports = MotorVehicle;