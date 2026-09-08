const express = require("express");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
    getStudentDashboard
} = require("../controllers/studentController");

const router = express.Router();

router.get(
    "/dashboard",
    protect,
    allowRoles("student"),
    getStudentDashboard
);

module.exports = router;