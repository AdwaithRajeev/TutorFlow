const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");


const authRoutes = require("./routes/authRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const studentRoutes = require("./routes/studentRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const studentDashboardRoutes = require("./routes/studentDashboardRoutes");



dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/tutor/students", studentRoutes);
app.use("/api/tutor/sessions", sessionRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/student", studentDashboardRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "TutorFlow backend is running"
    });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();