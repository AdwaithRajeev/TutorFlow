const express = require("express");
const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const {
    createSession,
    getSessions,
    updateSessionStatus,
    updateSessionNotes,
    generateAIPlan,
    generateAIReview
} = require("../controllers/sessionController");

const router = express.Router();

router.post("/", protect, allowRoles("tutor"), createSession);

router.get("/", protect, allowRoles("tutor"), getSessions);

router.patch(
    "/:id/status",
    protect,
    allowRoles("tutor"),
    updateSessionStatus
);

router.patch(
    "/:id/notes",
    protect,
    allowRoles("tutor"),
    updateSessionNotes
);
router.post(
    "/:id/ai-plan",
    protect,
    allowRoles("tutor"),
    generateAIPlan
);
router.post(
    "/:id/ai-review",
    protect,
    allowRoles("tutor"),
    generateAIReview
);

module.exports = router;