 const express = require("express");
 const PolicyRegister = express.Router();
 const Joi = require("joi");
 var sql = require("mssql");
 const config = require("../../database");

 PolicyRegister.get("/", (req, res) => {
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
                     .execute('spSelectAllPolicyRegister', (err, result) => {
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
             PolicyNo: Joi.string().required(),
             Client: Joi.string().required(),
             Agent: Joi.string().required(),
             PolicyClass: Joi.string().required(),
             InsuredItem: Joi.string().required(),
             Department: Joi.string().required(),
             InsuredPIN: Joi.string().required(),
             Occupation: Joi.string().required(),
             ProposalNo: Joi.string().required(),
             FromDate: Joi.date().required(),
             ToDate: Joi.date().required(),
             DaysOnCover: Joi.number().required(),
             RenewalDate: Joi.date().required(),
             DocRef: Joi.string().required(),
             InsuranceCompany: Joi.string().required(),
             SumInsured: Joi.number().required(),
             Calculator: Joi.string().required(),
             PremiumRateType: Joi.string().required(),
             PremiumRate: Joi.number().required(),
             BasicPremium: Joi.number().required(),
             StampDuty: Joi.number().required(),
             TrainingLevy: Joi.number().required(),
             PolicyHCF: Joi.number().required(),
             OtherCharges: Joi.number().required(),
             PolicyCharges: Joi.number().required(),
             BrokerDiscount: Joi.number().required(),
             CommRate: Joi.number().required(),
             Commission: Joi.number().required(),
             WithholdingTaxRate: Joi.number().required(),
             WithholdingTaxAmount: Joi.number().required(),
             AgentComm: Joi.number().required(),
             AgentCommAmount: Joi.number().required(),
             AdminFeeRate: Joi.number().required(),
             AdminAmount: Joi.number().required(),
             PayableAmount: Joi.number().required(),
             ToInsurer: Joi.number().required(),
             ACBranch: Joi.number().required(),
             PolicyStatus: Joi.string().required(),
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
                     .input("PolicyNo", sql.VarChar, req.body.PolicyNo)
                     .input("Client", sql.VarChar, req.body.Client)
                     .input("Agent", sql.VarChar, req.body.Agent)
                     .input("PolicyClass", sql.VarChar, req.body.PolicyClass)
                     .input("InsuredItem", sql.VarChar, req.body.InsuredItem)
                     .input("Department", sql.VarChar, req.body.Department)
                     .input("InsuredPIN", sql.VarChar, req.body.InsuredPIN)
                     .input("Occupation", sql.VarChar, req.body.Occupation)
                     .input("ProposalNo", sql.VarChar, req.body.ProposalNo)
                     .input("FromDate", sql.Date, req.body.FromDate)
                     .input("ToDate", sql.Date, req.body.ToDate)
                     .input("DaysOnCover", sql.Float, req.body.DaysOnCover)
                     .input("RenewalDate", sql.Date, req.body.RenewalDate)
                     .input("DocRef", sql.VarChar, req.body.DocRef)
                     .input("InsuranceCompany", sql.VarChar, req.body.InsuranceCompany)
                     .input("SumInsured", sql.Float, req.body.SumInsured)
                     .input("Calculator", sql.VarChar, req.body.Calculator)
                     .input("PremiumRateType", sql.VarChar, req.body.PremiumRateType)
                     .input("PremiumRate", sql.Float, req.body.PremiumRate)
                     .input("BasicPremium", sql.Float, req.body.BasicPremium)
                     .input("StampDuty", sql.Float, req.body.StampDuty)
                     .input("TrainingLevy", sql.Float, req.body.TrainingLevy)
                     .input("PolicyHCF", sql.Float, req.body.PolicyHCF)
                     .input("OtherCharges", sql.Float, req.body.OtherCharges)
                     .input("PolicyCharges", sql.Float, req.body.PolicyCharges)
                     .input("BrokerDiscount", sql.Float, req.body.BrokerDiscount)
                     .input("CommRate", sql.Float, req.body.CommRate)
                     .input("Commission", sql.Float, req.body.Commission)
                     .input("WithholdingTaxRate", sql.Float, req.body.WithholdingTaxRate)
                     .input("WithholdingTaxAmount", sql.Float, req.body.WithholdingTaxAmount)
                     .input("AgentComm", sql.Float, req.body.AgentComm)
                     .input("AgentCommAmount", sql.Float, req.body.AgentCommAmount)
                     .input("AdminFeeRate", sql.Float, req.body.AdminFeeRate)
                     .input("AdminAmount", sql.Float, req.body.AdminAmount)
                     .input("PayableAmount", sql.Float, req.body.PayableAmount)
                     .input("ToInsurer", sql.Float, req.body.ToInsurer)
                     .input("ACBranch", sql.Float, req.body.ACBranch)
                     .input("PolicyStatus", sql.VarChar, req.body.PolicyStatus)
                     .input("UserID", sql.VarChar, res.locals.user)
                     .input("Terminus", sql.VarChar, req.ip)
                     .execute('spSavePolicyRegister', (err, result) => {
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
     .delete("/:ProposalNo", (req, res) => {
         const ProposalNo = req.params.ProposalNo;
         const pool = new sql.ConnectionPool(config);
         pool.connect(error => {
             if (error) {
                 res.json({
                     success: false,
                     message: error.message
                 });
             } else {
                 new sql.Request(pool)
                     .input("ProposalNo", sql.VarChar, ProposalNo)
                     .input("UserID", sql.VarChar, res.locals.user)
                     .input("Terminus", sql.VarChar, req.ip)
                     .execute("spDeletePolicyRegister", (err, result) => {
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
     .get("/:ProposalNo", (req, res) => {
         const ProposalNo = req.params.ProposalNo;
         const pool = new sql.ConnectionPool(config);
         pool.connect(error => {
             if (error) {
                 res.json({
                     success: false,
                     message: error.message
                 });
             } else {
                 new sql.Request(pool)
                     .input("ProposalNo", sql.VarChar, ProposalNo)
                     .input("UserID", sql.VarChar, res.locals.user)
                     .input("Terminus", sql.VarChar, req.ip)
                     .execute("spSelectPolicyRegister", (err, result) => {
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
 module.exports = PolicyRegister;