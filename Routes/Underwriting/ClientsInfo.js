const express = require("express");
const Clients = express.Router();
var sql = require("mssql");
const config = require("../../database");
const Joi = require("joi");
Clients.get("/", (req, res) => {
        const pool = new sql.ConnectionPool(config);
        pool.connect(error => {
            new sql.Request(pool)
                .input("CompCode", sql.VarChar, res.locals.CompCode)
                .input("UserID", sql.VarChar, res.locals.user)
                .input("Terminus", sql.VarChar, req.ip[0])
                .execute("spSelectAllClients", (err, result) => {
                    if (err) {
                        res.json({
                            success: false,
                            message: err.message
                        });
                    } else {
                        res.status(200).json(result.recordset);
                    }
                    sql.close();
                });
        });
    })
    .post("/", (req, res) => {
        const schema = Joi.object().keys({
            ClientCode: Joi.string()
                .min(2)
                .max(50)
                .required(),
            ClientName: Joi.string()
                .min(3)
                .required(),
            ClientAddress: Joi.string()
                .min(3)
                .required(),

            PINNO: Joi.string()
                .min(3)
                .required(),
            DOB: Joi.string()
                .min(3)
                .required(),
            IDNo: Joi.string()
                .min(3)
                .required(),
            Passport: Joi.string()
                .min(3)
                .required(),
            City: Joi.string()
                .min(3)
                .required(),
            Telephone: Joi.string()
                .min(3)
                .required(),
            Mobile: Joi.string()
                .min(3)
                .required(),
            Email: Joi.string()
                .min(3)
                .required(),

            CostCenter: Joi.string()
                .min(3)
                .required(),
            Occupation: Joi.string()
                .min(3)
                .required(),
            Agent: Joi.string()
                .min(3)
                .required(),
            IncorparationNo: Joi.string()
                .required(),
            ContactPerson: Joi.string()
                .min(3)
                .required(),
            PhysicalLocation: Joi.string()
                .min(3)
                .required(),
            Category: Joi.string()
                .min(3)
                .required(),
            Currency: Joi.string()
                .min(1)
                .required(),
            Domant: Joi.boolean()

        });

        const result = Joi.validate(req.body, schema);
        if (!result.error) {
            const pool = new sql.ConnectionPool(config);
            pool.connect(error => {
                new sql.Request(pool)
                    .input("ClientCode", sql.VarChar, req.body.ClientCode)
                    .input("ClientName", sql.VarChar, req.body.ClientName)
                    .input("ClientAddress", sql.VarChar, req.body.ClientAddress)
                    .input("PINNO", sql.VarChar, req.body.PINNO)
                    .input("DOB", sql.Date, req.body.DOB)
                    .input("IDNo", sql.VarChar, req.body.IDNo)
                    .input("Passport", sql.VarChar, req.body.Passport)
                    .input("City", sql.VarChar, req.body.City)
                    .input("Telephone", sql.VarChar, req.body.Telephone)
                    .input("Mobile", sql.VarChar, req.body.Mobile)
                    .input("Email", sql.VarChar, req.body.Email)
                    .input("Company", sql.VarChar, res.locals.CompCode)

                    .input("CostCenter", sql.VarChar, req.body.CostCenter)
                    .input("Occupation", sql.VarChar, req.body.Occupation)
                    .input("Agent", sql.VarChar, req.body.Agent)

                    .input("ContactPerson", sql.VarChar, req.body.ContactPerson)
                    .input("PhysicalLocation", sql.VarChar, req.body.PhysicalLocation)
                    .input("IncorparationNo", sql.VarChar, req.body.IncorparationNo)

                    .input("Currency", sql.VarChar, req.body.Currency)
                    .input("Domant", sql.Bit, req.body.Domant)
                    .input("Category", sql.VarChar, req.body.Category)

                    .input("Terminus", sql.VarChar, req.ip[0])
                    .input("UserID", sql.VarChar, res.locals.user)
                    .execute("spSaveClients", (err, result) => {
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
                        sql.close();
                    });
            });
        } else {
            res.json({
                success: false,
                message: result.error.details[0].message
            });
        }
    })
    .delete("/:ClientCode", (req, res) => {
        const ClientCode = req.params.ClientCode;
        const pool = new sql.ConnectionPool(config);
        pool.connect(error => {
            new sql.Request(pool)
                .input("ClientCode", sql.VarChar, ClientCode)
                .input("UserID", sql.VarChar, res.locals.user)
                .input("Terminus", sql.VarChar, req.ip[0])
                .execute("spDeleteClients", (err, result) => {
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
                    sql.close();
                });
        });
    })
    .get("/:ClientCode", (req, res) => {
        const ClientCode = req.params.ClientCode;
        const pool = new sql.ConnectionPool(config);
        pool.connect(error => {
            new sql.Request(pool)
                .input("ClientCode", sql.VarChar, ClientCode)
                .input("UserID", sql.VarChar, res.locals.user)
                .input("Terminus", sql.VarChar, req.ip[0])
                .execute("spSelectClients", (err, result) => {
                    if (err) {
                        res.json({
                            success: false,
                            message: err.message
                        });
                    } else {
                        res.status(200).send(result.recordset);
                    }
                    sql.close();
                });
        });
    });

module.exports = Clients;