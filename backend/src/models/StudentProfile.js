const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        tutor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        subject: {
            type: String,
            required: true
        },

        currentLevel: {
            type: String,
            required: true
        },

        learningGoals: {
            type: String,
            required: true
        },

        weakAreas: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "StudentProfile",
    studentProfileSchema
);