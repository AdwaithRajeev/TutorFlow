const Session = require("../models/Session");
const User = require("../models/User");

console.log("Session model:", typeof Session.findOne);

const StudentProfile = require("../models/StudentProfile");
const {
    generateSessionPlan,
    generateSessionReview
} = require("../services/aiService");

const generateAIReview = async (req, res) => {
    try {
        const session = await Session.findOne({
            _id: req.params.id,
            tutor: req.user.userId
        });

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        if (session.status !== "completed") {
            return res.status(400).json({
                message: "AI review can only be generated for completed sessions"
            });
        }

        const studentProfile = await StudentProfile.findOne({
            user: session.student
        });

        if (!studentProfile) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        const pastSessions = await Session.find({
            student: session.student,
            _id: { $ne: session._id },
            status: { $in: ["completed", "ai-reviewed"] }
        })
            .select("date topic notes aiReview")
            .sort({ date: -1 })
            .limit(5);

        const aiReview = await generateSessionReview(
            studentProfile,
            session.topic,
            session.notes,
            pastSessions
        );

        session.aiReview = aiReview;

        // AI review completes the final lifecycle transition
        session.status = "ai-reviewed";

        await session.save();

        res.json({
            message: "AI session review generated successfully",
            aiReview: session.aiReview,
            status: session.status
        });
    } catch (error) {
        console.error("AI review error:", error);

        res.status(500).json({
            message: "Failed to generate AI session review",
            error: error.message
        });
    }
};

const generateAIPlan = async (req, res) => {
    try {
        const session = await Session.findOne({
            _id: req.params.id,
            tutor: req.user.userId
        });

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        const studentProfile = await StudentProfile.findOne({
            user: session.student
        });

        if (!studentProfile) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        const pastSessions = await Session.find({
            student: session.student,
            _id: { $ne: session._id },
            status: { $in: ["completed", "ai-reviewed"] }
        })
            .select("date topic notes aiReview")
            .sort({ date: -1 })
            .limit(5);

        const aiPlan = await generateSessionPlan(
            studentProfile,
            session.topic,
            pastSessions
        );

        session.aiPlan = aiPlan;

        await session.save();

        res.json({
            message: "AI session plan generated successfully",
            aiPlan: session.aiPlan
        });
    } catch (error) {
        console.error("AI plan error:", error);

        res.status(500).json({
            message: "Failed to generate AI session plan",
            error: error.message
        });
    }
};

const createSession = async (req, res) => {
    try {
        const { studentId, date, topic } = req.body;

        if (!studentId || !date || !topic) {
            return res.status(400).json({
                message: "Student, date and topic are required"
            });
        }

        // Check that the student exists
        const student = await User.findOne({
            _id: studentId,
            role: "student"
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const sessionDate = new Date(date);

        if (isNaN(sessionDate.getTime())) {
            return res.status(400).json({
                message: "Invalid date"
            });
        }

        // Check tutor's existing session at the same time
        const existingSession = await Session.findOne({
            tutor: req.user.userId,
            date: sessionDate
        });

        if (existingSession) {
            return res.status(409).json({
                message: "You already have a session scheduled at this time"
            });
        }

        const session = await Session.create({
            tutor: req.user.userId,
            student: studentId,
            date: sessionDate,
            topic
        });

        res.status(201).json({
            message: "Session scheduled successfully",
            session
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to schedule session",
            error: error.message
        });
    }
};


const getSessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            tutor: req.user.userId
        })
            .populate("student", "name email")
            .sort({ date: 1 });

        res.json(sessions);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch sessions",
            error: error.message
        });
    }
};

const updateSessionStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "scheduled",
            "in-progress",
            "completed",
            "ai-reviewed"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid session status"
            });
        }

        const session = await Session.findOne({
            _id: req.params.id,
            tutor: req.user.userId
        });

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        const transitions = {
    scheduled: "in-progress",
    "in-progress": "completed"
};

        const nextStatus = transitions[session.status];

        if (nextStatus !== status) {
            return res.status(400).json({
                message: `Cannot change status from ${session.status} to ${status}`
            });
        }

        session.status = status;

        await session.save();

        res.json({
            message: "Session status updated successfully",
            session
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update session status",
            error: error.message
        });
    }
};

const updateSessionNotes = async (req, res) => {
    try {
        const { notes } = req.body;

        const session = await Session.findOne({
            _id: req.params.id,
            tutor: req.user.userId
        });

        if (!session) {
            return res.status(404).json({
                message: "Session not found"
            });
        }

        if (session.status !== "in-progress") {
            return res.status(400).json({
                message: "Notes can only be edited while the session is in progress"
            });
        }

        session.notes = notes || "";

        await session.save();

        res.json({
            message: "Notes saved successfully",
            notes: session.notes
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to save notes",
            error: error.message
        });
    }
};


module.exports = {
    createSession,
    getSessions,
    updateSessionStatus,
    updateSessionNotes,
    generateAIPlan,
    generateAIReview
};