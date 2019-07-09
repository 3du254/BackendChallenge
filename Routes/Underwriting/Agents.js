 const express = require("express");
 const Agents = express.Router();
 const Joi = require("joi");
 var sql = require("mssql");
 const config = require("../../database");

 Agents.get("/", (req, res) => {
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
                     .execute('spSelectAllAgents', (err, result) => {

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
             AgentCode: Joi.string().required(),
             AgentName: Joi.string().required(),
             AgentAddress: Joi.string().required(),
             City: Joi.string().required(),
             Telephone: Joi.string().required(),
             Mobile: Joi.string().required(),
             Email: Joi.string().required(),
             Occupation: Joi.string().required(),
             ContactPerson: Joi.string().required(),
             Group: Joi.string().required()
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
                     .input("AgentCode", sql.VarChar, req.body.AgentCode)
                     .input("AgentName", sql.VarChar, req.body.AgentName)
                     .input("AgentAddress", sql.VarChar, req.body.AgentAddress)
                     .input("City", sql.VarChar, req.body.City)
                     .input("Telephone", sql.VarChar, req.body.Telephone)
                     .input("Mobile", sql.VarChar, req.body.Mobile)
                     .input("Email", sql.VarChar, req.body.Email)
                     .input("Occupation", sql.VarChar, req.body.Occupation)
                     .input("ContactPerson", sql.VarChar, req.body.ContactPerson)
                     .input("Group", sql.VarChar, req.body.Group)
                     .input("UserID", sql.VarChar, res.locals.user)
                     .input("Terminus", sql.VarChar, req.ip)
                     .execute('spSaveAgents', (err, result) => {
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
     .delete("/:AgentCode", (req, res) => {
         const AgentCode = req.params.AgentCode;
         const pool = new sql.ConnectionPool(config);
         pool.connect(error => {
             if (error) {
                 res.json({
                     success: false,
                     message: error.message
                 });
             } else {
                 new sql.Request(pool)
                     .input("AgentCode", sql.VarChar, AgentCode)
                     .input("UserID", sql.VarChar, res.locals.user)
                     .input("Terminus", sql.VarChar, req.ip)
                     .execute("spDeleteAgents", (err, result) => {
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
     .get("/:AgentCode", (req, res) => {
         const AgentCode = req.params.AgentCode;
         const pool = new sql.ConnectionPool(config);
         pool.connect(error => {
             if (error) {
                 res.json({
                     success: false,
                     message: error.message
                 });
             } else {
                 new sql.Request(pool)
                     .input("AgentCode", sql.VarChar, AgentCode)
                     .input("UserID", sql.VarChar, res.locals.user)
                     .input("Terminus", sql.VarChar, req.ip)
                     .execute("spSelectAgents", (err, result) => {
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
 module.exports = Agents;