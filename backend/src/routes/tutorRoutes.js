const express = require("express");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const { getDashboard } = require("../controllers/tutorController");

const router = express.Router();

router.get(
    "/dashboard",
    protect,
    allowRoles("tutor"),
    getDashboard
);

module.exports = router;