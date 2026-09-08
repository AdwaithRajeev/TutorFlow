const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const seedUsers = async () => {
    try {
        await connectDB();

        await User.deleteMany({});

        const tutorPassword = await bcrypt.hash("Tutor@123", 10);
        const studentPassword = await bcrypt.hash("Student@123", 10);

        await User.create([
            {
                name: "Tutor Demo",
                email: "tutor@tutorflow.com",
                password: tutorPassword,
                role: "tutor"
            },
            {
                name: "Student Demo",
                email: "student@tutorflow.com",
                password: studentPassword,
                role: "student"
            }
        ]);

        console.log("Test users created successfully");

        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exit(1);
    }
};

seedUsers();