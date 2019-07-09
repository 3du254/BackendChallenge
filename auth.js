const express = require("express");
const router = express.Router();
var sql = require("mssql");
const config = require("./database");
var jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const AppConstant = require("./AppConstant");

function validateToken(req, res, next) {
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
    jwt.verify(token, AppConstant.UserKey, function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: "Failed to authenticate token."
        });
      } else {
        res.locals.user = decoded.data;
        res.locals.CompCode = "001";
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: "No token provided."
    });
  }
}

function validaterole(SecurityModule) {
  return function(req, res, next) {
    const pool = new sql.ConnectionPool(config);
    pool.connect(error => {
      if (error) {
        res.json({
          success: false,
          message: error.message
        });
      } else {
        const request = new sql.Request(pool);
        request.input("UserName", sql.VarChar, res.locals.user);
        request.input("SecurityModule", sql.VarChar, SecurityModule);
        request.input("UserID", sql.VarChar, res.locals.user);
        request.input("Terminus", sql.VarChar, req.ip[0]);
        request.execute("sp_ValidatePrivilege", (err, result) => {
          if (err) {
            return res.json({
              success: false,
              message: err.message
            });
          } else {
            if (result.recordset.length > 0) {
              let type = req.method;
              if (type === "POST") {
                right = result.recordset[0].Add;
              } else if (type === "DELETE") {
                right = result.recordset[0].Delete;
              } else if (type === "PUT") {
                right = result.recordset[0].Edit;
              } else if (type === "GET") {
                right = result.recordset[0].View;
              }
              if (right) {
                next();
              } else {
                return res.json({
                  success: false,
                  message:
                    "privilage violation. You have insufficient right to access this route."
                });
              }
            } else {
              return res.json({
                success: false,
                message:
                  "privilage violation. You have insufficient right to access this route."
              });
            }
          }
        });
      }
    });
  };
}
router.post("/", function(req, res) {
  const schema = Joi.object().keys({
    phone: Joi.string()
      .min(3)
      .max(50)
      .required(),
    password: Joi.string().required()
  });

  Joi.validate(req.body, schema, function(err, value) {
    if (!err) {
      config.query(
        "select * from personnel where personnel_phone = ?",
        req.body.phone,
        function(error, result) {
          if (error) {
            res.json({
              success: false,
              message: error.message
            });
          } else {
            if (result.length > 0) {
              let user = result[0].personnel_phone;
              let Password = result[0].personnel_password;
              let expires = "24h";

              bcrypt.compare(req.body.password, Password, function(err, data) {
                if (data) {
                  var token = jwt.sign(
                    {
                      exp: Math.floor(Date.now() / 1000) + 60 * 60,
                      data: user
                    },
                    AppConstant.UserKey
                  );
                  res.json({
                    reset_password: 0,
                    //success: true,
                    //message: "Enjoy your token!",
                    accessToken: token,
                    expires_in: expires
                    //userdata: result.recordset
                  });
                } else {
                  // if (err) {
                  res.status(404).json({
                    //success: false,
                    error: {
                      password: "You have entered an incorrect password"
                    }
                  });
                }
              });
            } else {
              res.status(404).json({
                success: false,
                message: "Sorry, user does not exist."
              });
            }
          }
        }
      );
    } else {
      res.json({
        success: false,
        message: err.details[0].message
      });
    }
  });
});

router.get("/", function(req, res) {
  const schema = Joi.object().keys({
    page: Joi.number().required(),
    limit: Joi.number().required(),
    order: Joi.string().allow("created"),
    orderMethod: Joi.string().allow("DESC")
  });

  Joi.validate(req.query, schema, function(err, value) {
    if (!err) {
      const page = req.query.page;
      const items_per_page = req.query.limit;
      const order = req.query.order;
      const orderMethod = req.query.orderMethod;
      const start_index = (page - 1) * items_per_page;
      let total_items;
      config.query("SELECT count(task_id) as totalTasks FROM task", function(
        error,
        results
      ) {
        total_items = results;
        console.log(total_items);
      });
      const total_pages = Math.ceil(total_items / items_per_page);
      config.query(
        "select * from task Limit " +
          parseInt(start_index, 10) +
          "," +
          parseInt(items_per_page, 10),
        function(error, result) {
          if (error) {
            res.json({
              success: false,
              message: error.message
            });
          } else {
            if (result.length > 0) {
              let Result = result;

              res.status(200).json({
                totalTasks: total_items[0].totalTasks,
                page: page,
                perPage: parseInt(items_per_page, 10),
                tasks: Result
              });
            } else {
              res.status(404).json({
                result,
                success: false,
                message: "No record"
              });
            }
          }
        }
      );
    } else {
      res.json({
        success: false,
        message: err.details[0].message
      });
    }
  });
});

module.exports = {
  validateToken,
  validaterole,
  router
};
