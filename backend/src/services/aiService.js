const generateSessionPlan = async (
    studentProfile,
    topic,
    pastSessions
) => {
    const prompt = `
You are an AI assistant for an online tutoring platform called TutorFlow.

Create a personalized session plan for this student.

Student Profile:
- Subject: ${studentProfile.subject}
- Current Level: ${studentProfile.currentLevel}
- Learning Goals: ${studentProfile.learningGoals}
- Weak Areas: ${studentProfile.weakAreas}

Current Session Topic:
${topic}

Past Sessions:
${JSON.stringify(pastSessions)}

Return ONLY valid JSON in this structure:

{
  "objectives": [
    "objective 1",
    "objective 2",
    "objective 3"
  ],
  "outline": [
    "step 1",
    "step 2",
    "step 3",
    "step 4"
  ],
  "practiceQuestions": [
    "question 1",
    "question 2",
    "question 3"
  ]
}

Make the plan practical and appropriate for the student's level.
Do not include markdown or code fences.
`;

    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/interactions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": process.env.GEMINI_API_KEY
            },
            body: JSON.stringify({
                model: "gemini-3.6-flash",
                input: prompt
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error?.message || "Gemini API request failed"
        );
    }

    const text =
        data.output_text ||
        data.steps
            ?.filter(step => step.type === "model_output")
            ?.flatMap(step => step.content || [])
            ?.find(item => item.type === "text")
            ?.text;

    if (!text) {
        throw new Error("Gemini returned an empty response");
    }

    return JSON.parse(text);
};


const generateSessionReview = async (
    studentProfile,
    topic,
    notes,
    pastSessions
) => {
    const prompt = `
You are an AI assistant for an online tutoring platform called TutorFlow.

Review the completed tutoring session below.

Student Profile:
- Subject: ${studentProfile.subject}
- Current Level: ${studentProfile.currentLevel}
- Learning Goals: ${studentProfile.learningGoals}
- Weak Areas: ${studentProfile.weakAreas}

Session Topic:
${topic}

Tutor Notes:
${notes}

Past Sessions:
${JSON.stringify(pastSessions)}

Return ONLY valid JSON in this exact structure:

{
  "summary": "A concise summary of how the session went.",
  "homework": [
    "homework task 1",
    "homework task 2",
    "homework task 3"
  ],
  "nextSessionSuggestion": "A clear suggestion for what should be covered in the next session."
}

Provide 2 to 3 practical homework tasks.
Base the review on the student's profile and the tutor's notes.
Do not include markdown or code fences.
`;

    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/interactions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": process.env.GEMINI_API_KEY
            },
            body: JSON.stringify({
                model: "gemini-3.6-flash",
                input: prompt
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error?.message || "Gemini API request failed"
        );
    }

    const text =
        data.output_text ||
        data.steps
            ?.filter(step => step.type === "model_output")
            ?.flatMap(step => step.content || [])
            ?.find(item => item.type === "text")
            ?.text;

    if (!text) {
        throw new Error("Gemini returned an empty response");
    }

    return JSON.parse(text);
};

module.exports = {
    generateSessionPlan,
    generateSessionReview
};