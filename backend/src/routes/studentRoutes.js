const express = require("express");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
    createStudent,
    getStudentDashboard
} = require("../controllers/studentController");

const router = express.Router();

router.post(
    "/",
    protect,
    allowRoles("tutor"),
    createStudent
);

router.get(
    "/dashboard",
    protect,
    allowRoles("student"),
    getStudentDashboard
);

module.exports = router;