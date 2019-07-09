 const express = require("express");
 const DamagedCertificates = express.Router();
 const Joi = require("joi");
 var sql = require("mssql");
 const config = require("../../database");

 DamagedCertificates.get("/", (req, res) => {
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
                     .execute('spSelectAllDamagedCertificates', (err, result) => {
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
             CostCenter: Joi.string().required(),
             CerNo: Joi.string().required(),
             Insurer: Joi.string().required(),
             Category: Joi.string().required(),
             BatchNo: Joi.string().required(),
             IsDamaged: Joi.boolean(),
             Remarks: Joi.string().required(),
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
                     .input("CostCenter", sql.VarChar, req.body.CostCenter)
                     .input("CerNo", sql.VarChar, req.body.CerNo)
                     .input("Insurer", sql.VarChar, req.body.Insurer)
                     .input("Category", sql.VarChar, req.body.Category)
                     .input("BatchNo", sql.VarChar, req.body.BatchNo)
                     .input("IsDamaged", sql.Bit, req.body.IsDamaged)
                     .input("Remarks", sql.VarChar, req.body.Remarks)
                     .input("UserID", sql.VarChar, res.locals.user)
                     .input("Terminus", sql.VarChar, req.ip)
                     .execute('spSaveDamagedCertificates', (err, result) => {
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
     .delete("/:CerNo", (req, res) => {
         const CerNo = req.params.CerNo;
         const pool = new sql.ConnectionPool(config);
         pool.connect(error => {
             if (error) {
                 res.json({
                     success: false,
                     message: error.message
                 });
             } else {
                 new sql.Request(pool)
                     .input("CerNo", sql.VarChar, CerNo)
                     .input("UserID", sql.VarChar, res.locals.user)
                     .input("Terminus", sql.VarChar, req.ip)
                     .execute("spDeleteDamagedCertificates", (err, result) => {
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
     .get("/:CerNo", (req, res) => {
         const CerNo = req.params.CerNo;
         const pool = new sql.ConnectionPool(config);
         pool.connect(error => {
             if (error) {
                 res.json({
                     success: false,
                     message: error.message
                 });
             } else {
                 new sql.Request(pool)
                     .input("CerNo", sql.VarChar, CerNo)
                     .input("UserID", sql.VarChar, res.locals.user)
                     .input("Terminus", sql.VarChar, req.ip)
                     .execute("spSelectDamagedCertificates", (err, result) => {
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
 module.exports = DamagedCertificates;