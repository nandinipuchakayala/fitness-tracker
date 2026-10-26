const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("FitTrack Backend is running! 💪");
});

// WORKOUTS API
app.get("/api/workouts", (req, res) => {
    res.json({
        workouts: 4,
        goal: 5
    });
});

// CALORIES API
app.get("/api/calories", (req, res) => {
    res.json({
        calories: 650,
        goal: 2000
    });
});

// STEPS API
app.get("/api/steps", (req, res) => {
    res.json({
        steps: 7200,
        goal: 10000
    });
});

// GOAL API
app.get("/api/goal", (req, res) => {
    res.json({
        goal: 5,
        completed: 4
    });
});

// ACTIVITIES API
app.get("/api/activities", (req, res) => {
    res.json({
        running: {
            duration: 30,
            calories: 220
        },
        strength: {
            duration: 45,
            calories: 300
        },
        cycling: {
            duration: 40,
            calories: 280
        },
        yoga: {
            duration: 30,
            calories: 150
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});