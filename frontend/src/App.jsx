import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState({});
    const [sessions, setSessions] = useState([]);
    const [studentData, setStudentData] = useState(null);
    

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

   

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
const response = await axios.post(`${API_URL}/api/auth/login`,               {
                    email,
                    password
                }
            );

            localStorage.setItem("token", response.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            setUser(response.data.user);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");

    if (user.role === "tutor") {
        axios
            .get(`${API_URL}/api/tutor/sessions`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                setSessions(
                    response.data.sessions || response.data
                );
            })
            .catch((error) => {
                console.log(error);
            });
    }

    if (user.role === "student") {
        loadStudentDashboard();
    }
}, [user]);

    const saveNotes = async (sessionId, value) => {
    try {
        const token = localStorage.getItem("token");

        await axios.patch(
            `${API_URL}/api/tutor/sessions/${sessionId}/notes`,
            {
                notes: value
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (error) {
        console.log(
            error.response?.data?.message ||
            "Failed to save notes"
        );
    }
};

    const updateStatus = async (sessionId, status) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.patch(
            `${API_URL}/api/tutor/sessions/${sessionId}/status`,
            { status },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setSessions(
            sessions.map((session) =>
                session._id === sessionId
                    ? response.data.session
                    : session
            )
        );

    } catch (error) {
        alert(
            error.response?.data?.message ||
            "Failed to update session"
        );
    }
};

const generateAIReview = async (sessionId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
            `${API_URL}/api/tutor/sessions/${sessionId}/ai-review`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setSessions(
            sessions.map((session) =>
                session._id === sessionId
                    ? {
                        ...session,
                        status: "ai-reviewed",
                        aiReview: response.data.review
                    }
                    : session
            )
        );

     } catch (error) {
    console.log("AI Review error:", error.response?.data);

    alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to generate AI session review"
    );
}
};

const generateAIPlan = async (sessionId) => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.post(
            `${API_URL}/api/tutor/sessions/${sessionId}/ai-plan`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setSessions(
            sessions.map((session) =>
                session._id === sessionId
                    ? {
                        ...session,
                        aiPlan: response.data.plan
                    }
                    : session
            )
        );

    } catch (error) {
        console.log("AI Plan error:", error.response?.data);

        alert(
            error.response?.data?.message ||
            error.message ||
            "Failed to generate AI session plan"
        );
    }
};

const loadStudentDashboard = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
            `${API_URL}/api/student/dashboard`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

console.log("Student dashboard:", response.data);

setStudentData(response.data);

    } catch (error) {
        console.log(
            "Student dashboard error:",
            error.response?.data
        );
    }
};

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    if (user && user.role === "tutor") {

    return (
        <div className="dashboard">

            <div className="dashboard-header">
                <div>
                    <h1>TutorFlow</h1>
                    <h2>Welcome, {user.name} 👋</h2>
                    <p>Role: {user.role}</p>
                </div>

                <button onClick={logout}>
                    Logout
                </button>
            </div>

        <hr />

        <h2>Your Profile</h2>

    <form
    onSubmit={async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            const response = await axios.post(
                `${API_URL}/api/tutor/sessions`,
                {
                    studentId: e.target.studentId.value,
                    date: e.target.date.value,
                    topic: e.target.topic.value
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSessions([...sessions, response.data.session]);

            e.target.reset();

            alert("Session scheduled successfully!");
      } catch (error) {
    console.log("Schedule error:", error.response?.data);

    alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to schedule session"
    );
}
    }}
>
    <input
        name="studentId"
        placeholder="Student ID"
        required
    />

    <input
        name="date"
        type="datetime-local"
        required
    />

    <input
        name="topic"
        placeholder="Session topic"
        required
    />

    <button type="submit">
        Schedule Session
    </button>
</form>

<hr />



<h2>Your Sessions</h2>

                {sessions.length === 0 ? (
                    <p>No sessions scheduled yet.</p>
                ) : (
                    sessions.map((session) => (
                        <div
                    key={session._id}
                       className="session-card"

                            style={{
                                border: "1px solid #ccc",
                                padding: "15px",
                                margin: "10px 0"
                            }}
                        >
                            <h3>{session.topic}</h3>

                            <p>
                                Student:{" "}
                                {session.student?.name}
                            </p>

                            <p>
                                Date:{" "}
                                {new Date(
                                    session.date
                                ).toLocaleString()}
                            </p>

                            <p>
    Status:{" "}
    <span className={`status-badge status-${session.status}`}>
        {session.status}
    </span>
</p>

                            {session.status === "in-progress" && (
 <div className="card">
        <h4>Session Notes</h4>

        <textarea
            rows="6"
            placeholder="Write your session notes..."
            value={
                notes[session._id] !== undefined
                    ? notes[session._id]
                    : session.notes || ""
            }
            onChange={(e) => {
                const value = e.target.value;

                setNotes({
                    ...notes,
                    [session._id]: value
                });

                clearTimeout(window.noteTimer);

                window.noteTimer = setTimeout(() => {
                    saveNotes(session._id, value);
                }, 800);
            }}
        />

        <p>Notes autosave automatically.</p>
    </div>
)}

{session.status === "scheduled" && (
    <button
        onClick={() =>
            generateAIPlan(session._id)
        }
    >
        🤖 Generate AI Plan
    </button>
)}
{session.aiPlan && (
    <div className="ai-box">
        <h4>🤖 AI Session Plan</h4>

        <h5>Objectives</h5>
        <ul>
            {session.aiPlan.objectives?.map(
                (objective, index) => (
                    <li key={index}>{objective}</li>
                )
            )}
        </ul>

        <h5>Session Outline</h5>
        <ol>
            {session.aiPlan.outline?.map(
                (step, index) => (
                    <li key={index}>{step}</li>
                )
            )}
        </ol>

        <h5>Practice Questions</h5>
        <ul>
            {session.aiPlan.practiceQuestions?.map(
                (question, index) => (
                    <li key={index}>{question}</li>
                )
            )}
        </ul>
    </div>
)}

<div className="session-actions">
{session.status === "scheduled" && (
    <button
        onClick={() =>
            updateStatus(
                session._id,
                "in-progress"
            )
        }
    >
        Start Session
    </button>
)}

{session.status === "in-progress" && (
    <button
        onClick={() =>
            updateStatus(
                session._id,
                "completed"
            )
        }
    >
        Complete Session
    </button>
)}
{session.status === "completed" && (
    <button
        onClick={() =>
            generateAIReview(session._id)
        }
    >
        🤖 Generate AI Review
    </button>
)}

</div>

{session.status === "ai-reviewed" && session.aiReview && (
    <div>
        <h4>🤖 AI Review</h4>

        <p>
            <strong>Summary:</strong>{" "}
            {session.aiReview.summary}
        </p>

        <h5>Homework</h5>

        <ul>
            {session.aiReview.homework?.map(
                (task, index) => (
                    <li key={index}>{task}</li>
                )
            )}
        </ul>

        <p>
            <strong>Next Session:</strong>{" "}
            {session.aiReview.nextSessionSuggestion}
        </p>
    </div>
)}

                        </div>
                    ))
                )}
            </div>
        );
    }

if (user && user.role === "student") {


return (
    <div className="dashboard">

        <div className="dashboard-header">
            <div>
             <h1>TutorFlow</h1>
        <h2>Student Dashboard 👨‍🎓</h2>
        <p>Welcome, {user.name}!</p>
        </div>
         <button onClick={logout}>Logout</button>
</div>
            <hr />
            <div className="card">
            <h2>Your Profile</h2>

            <p>
                <strong>Subject:</strong>{" "}
                {studentData?.profile?.subject || "Not available"}
            </p>

            <p>
                <strong>Level:</strong>{" "}
                {studentData?.profile?.currentLevel || "Not available"}
            </p>

            <p>
                <strong>Learning Goals:</strong>{" "}
                {studentData?.profile?.learningGoals || "Not available"}
            </p>

            <p>
                <strong>Weak Areas:</strong>{" "}
                {studentData?.profile?.weakAreas || "Not available"}
            </p>
            </div>
            <hr />

<h2>📈 Learning Progress</h2>

<div className="progress">
    <div className="progress-card">
        <span>Total Sessions</span>
        <strong>
            {studentData?.sessions?.length || 0}
        </strong>
    </div>

    <div className="progress-card">
        <span>Completed</span>
        <strong>
            {studentData?.sessions?.filter(
                (session) =>
                    session.status === "completed" ||
                    session.status === "ai-reviewed"
            ).length || 0}
        </strong>
    </div>

    <div className="progress-card">
        <span>AI Reviewed</span>
        <strong>
            {studentData?.sessions?.filter(
                (session) =>
                    session.status === "ai-reviewed"
            ).length || 0}
        </strong>
    </div>
</div>

<hr />

<h2>Your Sessions</h2>

            {!studentData?.sessions?.length ? (
                <p>No sessions yet.</p>
            ) : (
                studentData.sessions.map((session) => (
                    <div
    key={session._id}
    className="session-card"
>
                        <h3>{session.topic}</h3>

                        <p>
                            Date:{" "}
                            {new Date(
                                session.date
                            ).toLocaleString()}
                        </p>

                       <p>
    Status:{" "}
    <span className={`status-badge status-${session.status}`}>
        {session.status}
    </span>
</p>

                        {session.aiReview && (
                               <div className="ai-box">
                                <h4>🤖 AI Review</h4>

                                <p>
                                    <strong>Summary:</strong>{" "}
                                    {session.aiReview.summary}
                                </p>

                                <h5>Homework</h5>

                                <ul>
                                    {session.aiReview.homework?.map(
                                        (task, index) => (
                                            <li key={index}>
                                                {task}
                                            </li>
                                        )
                                    )}
                                </ul>

                                <p>
                                    <strong>
                                        Next Session:
                                    </strong>{" "}
                                    {
                                        session.aiReview
                                            .nextSessionSuggestion
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

    return (
       <div className="login-page">
        <div className="login-card">
            <h1>TutorFlow</h1>

            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Logging in..."
                        : "Login"}
                </button>
            </form>

            {error && <p className="error">{error}</p>}
        </div>
        </div>
    );
}

export default App;