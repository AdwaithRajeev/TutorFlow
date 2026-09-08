const getDashboard = async (req, res) => {
    res.json({
        message: "Welcome to TutorFlow Tutor Dashboard",
        user: req.user
    });
};

module.exports = {
    getDashboard
};