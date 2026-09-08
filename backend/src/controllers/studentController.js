const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const bcrypt = require("bcryptjs");
const Session = require("../models/Session");

const getStudentDashboard = async (req, res) => {
    try {
        const student = await User.findById(req.user.userId).select(
            "name email role"
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const profile = await StudentProfile.findOne({
            user: student._id
        }).populate("tutor", "name email");

        const sessions = await Session.find({
            student: student._id
        })
            .populate("tutor", "name email")
            .select(
                "date topic status notes aiPlan aiReview"
            )
            .sort({ date: 1 });

        res.json({
            student,
            profile,
            sessions
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to load student dashboard",
            error: error.message
        });
    }
};

const createStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            subject,
            currentLevel,
            learningGoals,
            weakAreas
        } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "student"
        });

        const profile = await StudentProfile.create({
            user: student._id,
            tutor: req.user.userId,
            subject,
            currentLevel,
            learningGoals,
            weakAreas
        });

        res.status(201).json({
            message: "Student created successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email
            },
            profile
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create student",
            error: error.message
        });
    }
};

module.exports = {
    createStudent,
    getStudentDashboard
};