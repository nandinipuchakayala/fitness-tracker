
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ===============================
// WORKOUT MODEL
// ===============================

const workoutSchema = new mongoose.Schema({
    activity: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    calories: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Workout = mongoose.model("Workout", workoutSchema);

// ===============================
// USER MODEL
// ===============================

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model("User", userSchema);

// ===============================
// SIGNUP API
// ===============================

app.post("/api/auth/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide name, email and password."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters."
            });
        }

        const existingUser = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "An account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email: email.trim().toLowerCase(),
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "Account created successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Signup failed.",
            error: error.message
        });
    }
});

// ===============================
// LOGIN API
// ===============================

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password."
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed.",
            error: error.message
        });
    }
});

// ===============================
// JWT AUTHENTICATION MIDDLEWARE
// ===============================

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access denied. Please login."
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return res.status(403).json({
                message: "Invalid or expired token."
            });
        }

        req.user = user;
        next();
    });
}

// ===============================
// PROTECTED PROFILE API
// ===============================

app.get("/api/auth/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        res.json(user);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// ===============================
// HOME API
// ===============================

app.get("/", (req, res) => {
    res.send("FitTrack Backend is running! 💪");
});

// ===============================
// WORKOUTS API
// ===============================

app.get("/api/workouts", async (req, res) => {
    try {
        const workouts = await Workout.find();
        res.json(workouts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/api/workouts", async (req, res) => {
    try {
        const workout = new Workout({
            activity: req.body.activity,
            duration: req.body.duration,
            calories: req.body.calories
        });

        const savedWorkout = await workout.save();

        res.status(201).json(savedWorkout);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ===============================
// CALORIES API
// ===============================

app.get("/api/calories", async (req, res) => {
    try {
        const workouts = await Workout.find();

        const totalCalories = workouts.reduce(
            (total, workout) => total + workout.calories,
            0
        );

        res.json({
            calories: totalCalories,
            goal: 2000
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ===============================
// STEPS API
// ===============================

app.get("/api/steps", (req, res) => {
    res.json({
        steps: 7200,
        goal: 10000
    });
});

// ===============================
// GOAL API
// ===============================

app.get("/api/goal", (req, res) => {
    res.json({
        goal: 5,
        completed: 4
    });
});

// ===============================
// ACTIVITIES API
// ===============================

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

// ===============================
// CONNECT TO MONGODB
// ===============================

async function startServer() {
    try {
        if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
            throw new Error("MONGODB_URI or JWT_SECRET is missing in .env");
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "fittrack"
        });

        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();

