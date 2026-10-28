
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

const connectDB = require("./config/db");
const User = require("./models/User");

const seedUsers = async () => {
    try {
        await connectDB();

        const accounts = [
            {
                name: "Tutor Demo",
                email: "tutor@tutorflow.com",
                password: "Tutor@123",
                role: "tutor",
            },
            {
                name: "Student Demo",
                email: "student@tutorflow.com",
                password: "Student@123",
                role: "student",
            },
        ];

        for (const account of accounts) {
            const hashedPassword = await bcrypt.hash(
                account.password,
                10
            );

            await User.findOneAndUpdate(
                { email: account.email },
                {
                    $set: {
                        name: account.name,
                        password: hashedPassword,
                        role: account.role,
                    },
                },
                { upsert: true, new: true, runValidators: true }
            );

            console.log(`Seeded account: ${account.email}`);
        }

        console.log("Demo accounts are ready.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exit(1);
    }
};

seedUsers();
