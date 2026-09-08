# TutorFlow

TutorFlow is an AI-powered tutoring platform that helps tutors manage students, schedule learning sessions, take notes, and generate AI-powered session plans and reviews.

## Live Application

Frontend: https://tutorflow-mu.vercel.app

Backend: https://tutorflow-atlf.onrender.com

## GitHub

https://github.com/AdwaithRajeev/TutorFlow

## Tech Stack

### Frontend
- React
- Vite
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

### AI
- Google Gemini
- Gemini 3.6 Flash
- Gemini Interactions API

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Features

### Authentication
- Tutor and student login
- JWT-based authentication
- Role-based access control

### Student Management
- Student profiles
- Subject
- Current level
- Learning goals
- Weak areas
- Tutor can select students while scheduling sessions

### Session Management
Sessions follow the required lifecycle:

Scheduled → In Progress → Completed → AI Reviewed

A session cannot skip states.

### Scheduling
- Tutor can schedule sessions
- Student selection through dropdown
- Date and time selection
- Session topic
- Clash detection for duplicate tutor time slots

### Session Notes
- Tutor can add notes during an in-progress session
- Notes are automatically saved with debounce

### AI Session Planning
Gemini generates:
- Learning objectives
- Session outline
- Practice questions

The AI plan uses the student's profile and previous sessions.

### AI Session Review
After a session is completed, Gemini generates:
- Session summary
- 2–3 homework tasks
- Next session suggestion

The session is then marked as AI Reviewed.

### Student Dashboard
Students can view:
- Profile information
- Learning progress
- Total sessions
- Completed sessions
- AI-reviewed sessions
- Session history
- AI reviews
- Homework
- Next-session suggestions

## Database Structure

### Users

```text
User
├── name
├── email
├── password
├── role
└── timestamps