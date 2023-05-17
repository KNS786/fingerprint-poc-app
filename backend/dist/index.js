"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
const employeeList = [
    {
        id: "1232",
        name: "Navani",
        fingerPrint: null,
    },
    {
        id: "4571",
        name: "Sundar",
        fingerPrint: "abcsdX5623784ghsd",
    },
    {
        id: "7820",
        name: "Yogesh",
        fingerPrint: null,
    },
];
app.get("/:id", (req, res) => {
    const { id } = req.params;
    const getEmployeeDetails = employeeList.find((employee) => {
        return employee.id === id ? employee : null;
    });
    console.log("getEmployeeDetails ::", getEmployeeDetails);
    res.json({ data: getEmployeeDetails });
});
app.listen(port, () => {
    console.log("app Running...");
});
module.exports = app;
