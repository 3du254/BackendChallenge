const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const UserRoute = require("./Routes/user");
const CompanyRoute = require("./Routes/Company");
const currencyRoute = require("./Routes/Currency");
const Countries = require("./Routes/Countries");
const Counties = require("./Routes/Counties");
const CostCenter = require("./Routes/CostCenter");
const CompanyCostCenterAccess = require("./Routes/CompanyCostCenterAccess");
const Usergroups = require("./Routes/UserGroups");
const UserRoles = require("./Routes/UserRoles");
const RolesRoute = require("./Routes/Roles");
const SecurityGroupsRoute = require("./Routes/SecurityGroups");
const Clients = require("./Routes/Underwriting/ClientsInfo");
const vehicleMake = require("./Routes/Underwriting/VehicleMake");
const MotorVehicle = require("./Routes/Underwriting/MotorVehicle");
const auth = require("./auth");
const PaymentModes = require("./Routes/Underwriting/PaymentModes");
const PolicyCategories = require("./Routes/Underwriting/PolicyCategories");
const PolicyClasses = require("./Routes/Underwriting/PolicyClasses");
const Agents = require("./Routes/Underwriting/Agents");
const Clientcategory = require("./Routes/Underwriting/ClientCategory");
const Insurer = require("./Routes/Underwriting/Insurer");
const CalcItems = require("./Routes/Underwriting/CalcItems");
const PremiumCalc = require("./Routes/Underwriting/Premiumcalculator");
const FamilyMembers = require("./Routes/Underwriting/FamilyMembers");
const Dependants = require("./Routes/Underwriting/Dependants");
const Department = require("./Routes/Underwriting/Department");
const DamagedCerts = require("./Routes/Underwriting/DamagedCerts");
const PolicyRegister = require("./Routes/Underwriting/PolicyRegister");
const InsuredItems = require("./Routes/Underwriting/InsuredItems");
const ReceiveMotorCertificates = require("./Routes/Underwriting/ReceiveMotorCertificates");
const CoInsurance = require("./Routes/Underwriting/CoInsurance");
const ClaimTypes = require("./Routes/Claims/ClaimsTypes");
const ClaimsCategories = require("./Routes/Claims/ClaimsCategories");
//reports test
const Report = require("./Routes/Reports/index");

//end of report test
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization"
  );
  next();
});

app.use("/api/reports", Report);

app.use("/api/login", auth.router);
app.use(auth.validateToken);
app.use("/api/users", auth.validaterole("Users"), UserRoute);
app.use("/api/company", auth.validaterole("company"), CompanyRoute);
app.use("/api/currency", auth.validaterole("currency"), currencyRoute);
app.use("/api/Countries", auth.validaterole("Countries"), Countries);
app.use("/api/Counties", auth.validaterole("Counties"), Counties);
app.use("/api/CostCenter", auth.validaterole("CostCenter"), CostCenter);
app.use(
  "/api/CompanyCostCenterAccess",
  auth.validaterole("CompanyCostCenterAccess"),
  CompanyCostCenterAccess
);
app.use("/api/Usergroups", auth.validaterole("Usergroups"), Usergroups);
app.use("/api/UserRoles", auth.validaterole("UserRoles"), UserRoles);
app.use("/api/roles", auth.validaterole("roles"), RolesRoute);
app.use(
  "/api/securityGroups",
  auth.validaterole("securityGroups"),
  SecurityGroupsRoute
);
app.use("/api/clients", auth.validaterole("clients"), Clients);
app.use("/api/agents", auth.validaterole("clients"), Agents);
app.use("/api/vehiclemake", auth.validaterole("vehiclemake"), vehicleMake);
app.use(
  "/api/clientcategory",
  auth.validaterole("vehiclemake"),
  Clientcategory
);
app.use("/api/motorvehicle", auth.validaterole("vehiclemake"), MotorVehicle);
app.use("/api/PaymentModes", auth.validaterole("roles"), PaymentModes);
app.use("/api/PolicyCategories", auth.validaterole("roles"), PolicyCategories);
app.use("/api/PolicyClasses", auth.validaterole("roles"), PolicyClasses);
app.use("/api/Insurer", auth.validaterole("Insurance Companies"), Insurer);
app.use("/api/calcitems", auth.validaterole("Insurance Companies"), CalcItems);
app.use("/api/InsuredItems", auth.validaterole("Insured Items"), InsuredItems);
app.use("/api/CoInsurance", auth.validaterole("Co-Insurance"), CoInsurance);
app.use(
  "/api/ReceiveMotorCertificates",
  auth.validaterole("Receive Motor Certificates"),
  ReceiveMotorCertificates
);
app.use(
  "/api/premiumcalc",
  auth.validaterole("Insurance Companies"),
  PremiumCalc
);
app.use(
  "/api/FamilyMembers",
  auth.validaterole("Family Members"),
  FamilyMembers
);
app.use(
  "/api/FamilyDependants",
  auth.validaterole("Family Dependants"),
  Dependants
);
app.use(
  "/api/department",
  auth.validaterole("Family Dependants"),
  Department
);
app.use(
  "/api/damagedcerts",
  auth.validaterole("Family Dependants"),
  DamagedCerts
);
app.use(
  "/api/policyregister",
  auth.validaterole("Family Dependants"),
  PolicyRegister
);
app.use("/api/ClaimTypes", auth.validaterole("Claim Types"), ClaimTypes);
app.use("/api/ClaimsCategories", auth.validaterole("ClaimsCategories"), ClaimsCategories);
//end of app use routes
app.use((req, res, next) => {
  const error = new Error("resource not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;