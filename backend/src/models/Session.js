const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        tutor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        topic: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: [
                "scheduled",
                "in-progress",
                "completed",
                "ai-reviewed"
            ],
            default: "scheduled"
        },

        notes: {
            type: String,
            default: ""
        },

        aiPlan: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        },

        aiReview: {
            type: mongoose.Schema.Types.Mixed,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Session", sessionSchema);