
(function () {
    // =====================================
    // FITTRACK - FRONTEND FITNESS DASHBOARD
    // REDUX + LOCAL STORAGE
    // =====================================

    const STORAGE_KEY = "fittrackDashboardData";

    const defaultData = {
        steps: 6250,
        calories: 420,
        workouts: 3,
        goal: 75,
        intake: 1800,
        heartRate: 72,
        sleep: 7,
        workoutHistory: []
    };

    function loadSavedData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved
                ? { ...defaultData, ...JSON.parse(saved) }
                : { ...defaultData };
        } catch (error) {
            console.error("Could not load saved data:", error);
            return { ...defaultData };
        }
    }

    // =====================================
    // REDUX STORE
    // =====================================

    const initialState = loadSavedData();

    function fitnessReducer(state = initialState, action) {
        switch (action.type) {
            case "UPDATE_DASHBOARD":
                return { ...state, ...action.payload };

            default:
                return state;
        }
    }

    const fitnessStore = Redux.createStore(fitnessReducer);

    function saveDashboardData() {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(fitnessStore.getState())
        );
    }

    function updateDashboard(data) {
        fitnessStore.dispatch({
            type: "UPDATE_DASHBOARD",
            payload: data
        });

        saveDashboardData();
        renderDashboard();
    }

    // =====================================
    // HTML ELEMENTS
    // =====================================

    const get = (id) => document.getElementById(id);

    const stepsInput = get("stepsInput");
    const caloriesInput = get("caloriesInput");
    const workoutsInput = get("workoutsInput");
    const goalInput = get("goalInput");
    const intakeInput = get("intakeInput");
    const heartRateInput = get("heartRateInput");
    const sleepInput = get("sleepInput");

    // =====================================
    // DASHBOARD DISPLAY
    // =====================================

    function renderDashboard() {
        const data = fitnessStore.getState();

        get("stepsValue").textContent = data.steps.toLocaleString();
        get("stepsProgress").textContent =
            Math.min(Math.round(data.steps / 10000 * 100), 100) + "%";

        get("caloriesValue").textContent = data.calories.toLocaleString();
        get("caloriesProgress").textContent =
            Math.min(Math.round(data.calories / 2000 * 100), 100) + "%";

        get("workoutsValue").textContent = data.workouts;
        get("workoutsProgress").textContent =
            Math.min(Math.round(data.workouts / 5 * 100), 100) + "%";

        get("goalValue").textContent = data.goal + "%";

        if (data.goal >= 100) {
            get("goalMessage").textContent = "Goal achieved! 🎉";
        } else if (data.goal >= 75) {
            get("goalMessage").textContent = "Almost there! 💪";
        } else if (data.goal >= 50) {
            get("goalMessage").textContent = "Keep going! 🔥";
        } else {
            get("goalMessage").textContent = "You've got this! 🌟";
        }

        get("intakeValue").textContent = data.intake.toLocaleString();
        get("intakeProgress").textContent =
            Math.min(Math.round(data.intake / 2000 * 100), 100) + "%";

        get("heartRateValue").textContent = data.heartRate;

        if (data.heartRate < 60) {
            get("heartRateStatus").textContent = "Low";
        } else if (data.heartRate <= 100) {
            get("heartRateStatus").textContent = "Normal";
        } else {
            get("heartRateStatus").textContent = "High";
        }

        get("sleepValue").textContent = data.sleep;

        if (data.sleep >= 7 && data.sleep <= 9) {
            get("sleepStatus").textContent = "Good";
        } else if (data.sleep >= 6) {
            get("sleepStatus").textContent = "Fair";
        } else {
            get("sleepStatus").textContent = "Low";
        }

        updateOverallHealth();
        updateRecommendation();
        updateProgressReport();
    }

    // =====================================
    // STEPS TRACKER
    // =====================================

    get("updateSteps").addEventListener("click", function () {
        const steps = Number(stepsInput.value);

        if (stepsInput.value === "" || !Number.isFinite(steps) || steps < 0) {
            alert("Please enter a valid number of steps.");
            return;
        }

        updateDashboard({ steps });
        stepsInput.value = "";
    });

    // =====================================
    // CALORIES TRACKER
    // =====================================

    get("updateCalories").addEventListener("click", function () {
        const calories = Number(caloriesInput.value);

        if (caloriesInput.value === "" || !Number.isFinite(calories) || calories < 0) {
            alert("Please enter valid calories.");
            return;
        }

        updateDashboard({ calories });
        caloriesInput.value = "";
    });

    // =====================================
    // WORKOUT TRACKER
    // =====================================

    get("updateWorkouts").addEventListener("click", function () {
        const workouts = Number(workoutsInput.value);

        if (workoutsInput.value === "" || !Number.isInteger(workouts) || workouts < 0) {
            alert("Please enter a valid number of workouts.");
            return;
        }

        updateDashboard({ workouts });
        workoutsInput.value = "";
    });

    // =====================================
    // GOAL TRACKER
    // =====================================

    get("updateGoal").addEventListener("click", function () {
        const goal = Number(goalInput.value);

        if (goalInput.value === "" || !Number.isFinite(goal) || goal < 0 || goal > 100) {
            alert("Please enter a goal between 0 and 100.");
            return;
        }

        updateDashboard({ goal });
        goalInput.value = "";
    });

    // =====================================
    // CALORIE INTAKE
    // =====================================

    get("updateIntake").addEventListener("click", function () {
        const intake = Number(intakeInput.value);

        if (intakeInput.value === "" || !Number.isFinite(intake) || intake < 0) {
            alert("Please enter valid calorie intake.");
            return;
        }

        updateDashboard({ intake });
        intakeInput.value = "";
    });

    // =====================================
    // HEART RATE
    // =====================================

    get("updateHeartRate").addEventListener("click", function () {
        const heartRate = Number(heartRateInput.value);

        if (heartRateInput.value === "" || !Number.isFinite(heartRate) || heartRate < 30 || heartRate > 220) {
            alert("Enter a heart rate between 30 and 220 BPM.");
            return;
        }

        updateDashboard({ heartRate });
        heartRateInput.value = "";
    });

    // =====================================
    // SLEEP TRACKER
    // =====================================

    get("updateSleep").addEventListener("click", function () {
        const sleep = Number(sleepInput.value);

        if (sleepInput.value === "" || !Number.isFinite(sleep) || sleep < 0 || sleep > 24) {
            alert("Enter sleep hours between 0 and 24.");
            return;
        }

        updateDashboard({ sleep });
        sleepInput.value = "";
    });

    // =====================================
    // OVERALL HEALTH SUMMARY
    // =====================================

    function updateOverallHealth() {
        const data = fitnessStore.getState();

        let score = 0;

        if (data.steps >= 8000) score++;
        if (data.workouts >= 3) score++;
        if (data.heartRate >= 60 && data.heartRate <= 100) score++;
        if (data.sleep >= 7 && data.sleep <= 9) score++;

        if (score === 4) {
            get("overallHealthStatus").textContent = "Excellent! 🌟";
            get("overallHealthMessage").textContent =
                "Your activity, workouts, heart rate and sleep are looking good. Keep up your healthy routine!";
        } else if (score >= 2) {
            get("overallHealthStatus").textContent = "Good Progress! 💪";
            get("overallHealthMessage").textContent =
                "You're doing well overall. Keep staying active and improving your daily routine.";
        } else {
            get("overallHealthStatus").textContent = "Needs Improvement 🌱";
            get("overallHealthMessage").textContent =
                "Try to increase your daily activity, maintain regular workouts and get enough sleep.";
        }
    }

    // =====================================
    // PERSONALIZED RECOMMENDATIONS
    // =====================================

    function updateRecommendation() {
        const data = fitnessStore.getState();
        let message;

        if (data.sleep < 6) {
            message = "😴 Try to get more sleep. Aim for around 7–9 hours to support recovery.";
        } else if (data.steps < 5000) {
            message = "🚶 Try to increase your daily activity. A short walk can help you reach your step goal.";
        } else if (data.workouts < 3) {
            message = "💪 Include more regular workouts this week to improve your fitness.";
        } else if (data.heartRate < 60) {
            message = "❤️ Your heart rate is on the lower side. Keep monitoring it and how you feel.";
        } else if (data.heartRate > 100) {
            message = "❤️ Your heart rate is elevated. Rest and monitor it.";
        } else if (data.intake > 2000) {
            message = "🍎 Your calorie intake is above the daily target. Aim for balanced meals.";
        } else {
            message = "🌟 Great job! Keep staying active, eating well and getting enough rest.";
        }

        get("recommendationMessage").textContent = message;
    }

    // =====================================
    // PROGRESS REPORT
    // =====================================

    function updateProgressReport() {
        const data = fitnessStore.getState();

        get("reportSteps").textContent = data.steps.toLocaleString();
        get("reportCalories").textContent = data.calories.toLocaleString() + " kcal";
        get("reportWorkouts").textContent = data.workouts + " / 5";
        get("reportGoal").textContent = data.goal + "%";
        get("reportHeartRate").textContent = data.heartRate + " BPM";
        get("reportSleep").textContent = data.sleep + " hours";

        const reportSummary = get("reportSummary");

        if (data.goal >= 80 && data.steps >= 8000 && data.workouts >= 3) {
            reportSummary.textContent =
                "Excellent progress! 🌟 You're moving strongly toward your fitness goals.";
        } else if (data.steps >= 5000 || data.workouts >= 3) {
            reportSummary.textContent =
                "You're making good progress! 💪 Keep working toward your goals.";
        } else {
            reportSummary.textContent =
                "Keep going! 🌱 Try to increase your daily activity and maintain regular workouts.";
        }
    }

    // =====================================
    // WORKOUT ACTIVITIES
    // =====================================

    function saveWorkout(activity, duration, calories) {
        const data = fitnessStore.getState();

        const newWorkout = {
            activity,
            duration,
            calories,
            date: new Date().toLocaleDateString()
        };

        updateDashboard({
            workouts: data.workouts + 1,
            calories: data.calories + calories,
            workoutHistory: [...data.workoutHistory, newWorkout]
        });

        alert(activity + " workout added successfully! 💪");
    }

    get("runningButton").addEventListener("click", function () {
        saveWorkout("Running", 30, 220);
    });

    get("strengthButton").addEventListener("click", function () {
        saveWorkout("Strength", 45, 300);
    });

    get("cyclingButton").addEventListener("click", function () {
        saveWorkout("Cycling", 40, 280);
    });

    get("yogaButton").addEventListener("click", function () {
        saveWorkout("Yoga", 30, 150);
    });

    // =====================================
    // MOTIVATIONAL QUOTE API
    // =====================================

    async function loadMotivationQuote() {
        try {
            const response = await fetch("https://dummyjson.com/quotes/random");

            if (!response.ok) {
                throw new Error("Unable to fetch quote");
            }

            const data = await response.json();
            get("motivationQuote").textContent = data.quote;

        } catch (error) {
            console.error("Motivation API Error:", error);
            get("motivationQuote").textContent =
                "Small steps today, big results tomorrow.";
        }
    }

    // =====================================
    // START TRACKING
    // =====================================

    get("startTracking").addEventListener("click", function () {
        get("health").scrollIntoView({
            behavior: "smooth"
        });
    });

    // =====================================
    // INITIALIZE DASHBOARD
    // =====================================

    renderDashboard();

    console.log("FitTrack Redux Store:", fitnessStore.getState());

    loadMotivationQuote();

})();
