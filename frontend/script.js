
 // =============================
 // FITTRACK - FITNESS TRACKER
 // =============================
 // REDUX STORE

const initialState = {
    workouts: [],
    steps: 0,
    calories: 0,
    goal: 0,
    activities: []
};

function fitnessReducer(state = initialState, action) {
    switch (action.type) {
        case "UPDATE_DASHBOARD":
            return {
                ...state,
                ...action.payload
            };

        default:
            return state;
    }
}

const fitnessStore = Redux.createStore(fitnessReducer);

const API_URL = "http://localhost:3000";

// =============================
// ELEMENTS
// =============================

const stepsInput = document.getElementById("stepsInput");
const updateStepsButton = document.getElementById("updateSteps");
const stepsValue = document.getElementById("stepsValue");
const stepsProgress = document.getElementById("stepsProgress");

const caloriesInput = document.getElementById("caloriesInput");
const updateCaloriesButton = document.getElementById("updateCalories");
const caloriesValue = document.getElementById("caloriesValue");
const caloriesProgress = document.getElementById("caloriesProgress");

const workoutsInput = document.getElementById("workoutsInput");
const updateWorkoutsButton = document.getElementById("updateWorkouts");
const workoutsValue = document.getElementById("workoutsValue");
const workoutsProgress = document.getElementById("workoutsProgress");

const goalInput = document.getElementById("goalInput");
const updateGoalButton = document.getElementById("updateGoal");
const goalValue = document.getElementById("goalValue");
const goalMessage = document.getElementById("goalMessage");

const intakeInput = document.getElementById("intakeInput");
const updateIntakeButton = document.getElementById("updateIntake");
const intakeValue = document.getElementById("intakeValue");
const intakeProgress = document.getElementById("intakeProgress");

const heartRateInput = document.getElementById("heartRateInput");
const updateHeartRateButton = document.getElementById("updateHeartRate");
const heartRateValue = document.getElementById("heartRateValue");
const heartRateStatus = document.getElementById("heartRateStatus");

const sleepInput = document.getElementById("sleepInput");
const updateSleepButton = document.getElementById("updateSleep");
const sleepValue = document.getElementById("sleepValue");
const sleepStatus = document.getElementById("sleepStatus");

const overallHealthStatus =
    document.getElementById("overallHealthStatus");

const overallHealthMessage =
    document.getElementById("overallHealthMessage");

const recommendationMessage =
    document.getElementById("recommendationMessage");


// =============================
// STEP TRACKER
// =============================

updateStepsButton.addEventListener("click", function () {

    const steps = Number(stepsInput.value);
    const stepGoal = 10000;

    if (stepsInput.value === "" || steps < 0) {
        alert("Please enter a valid number of steps.");
        return;
    }

    let percentage = Math.min((steps / stepGoal) * 100, 100);

    stepsValue.textContent = steps.toLocaleString();
    stepsProgress.textContent = Math.round(percentage) + "%";

    updateOverallHealth();
    updateRecommendation();
    updateProgressReport();
});


// =============================
// CALORIES BURNED
// =============================

updateCaloriesButton.addEventListener("click", function () {

    const calories = Number(caloriesInput.value);
    const calorieGoal = 2000;

    if (caloriesInput.value === "" || calories < 0) {
        alert("Please enter a valid number of calories.");
        return;
    }

    let percentage = Math.min((calories / calorieGoal) * 100, 100);

    caloriesValue.textContent = calories.toLocaleString();
    caloriesProgress.textContent = Math.round(percentage) + "%";

    updateRecommendation();
    updateProgressReport();
});


// =============================
// WORKOUTS TRACKER
// =============================

updateWorkoutsButton.addEventListener("click", function () {

    const workouts = Number(workoutsInput.value);
    const workoutGoal = 5;

    if (workoutsInput.value === "" || workouts < 0) {
        alert("Please enter a valid number of workouts.");
        return;
    }

    let percentage = Math.min((workouts / workoutGoal) * 100, 100);

    workoutsValue.textContent = workouts;
    workoutsProgress.textContent = Math.round(percentage) + "%";

    updateOverallHealth();
    updateRecommendation();
    updateProgressReport();
});


// =============================
// GOAL TRACKER
// =============================

updateGoalButton.addEventListener("click", function () {

    const goal = Number(goalInput.value);

    if (goalInput.value === "" || goal < 0 || goal > 100) {
        alert("Please enter a goal between 0 and 100.");
        return;
    }

    goalValue.textContent = goal + "%";

    if (goal >= 100) {
        goalMessage.textContent = "Goal achieved! 🎉";
    } else if (goal >= 75) {
        goalMessage.textContent = "Almost there! 💪";
    } else if (goal >= 50) {
        goalMessage.textContent = "Keep going! 🔥";
    } else {
        goalMessage.textContent = "You've got this! 🌟";
    }

    updateOverallHealth();
    updateRecommendation();
    updateProgressReport();
});


// =============================
// CALORIE INTAKE
// =============================

updateIntakeButton.addEventListener("click", function () {

    const intake = Number(intakeInput.value);
    const intakeGoal = 2000;

    if (intakeInput.value === "" || intake < 0) {
        alert("Please enter a valid calorie intake.");
        return;
    }

    let percentage = Math.min((intake / intakeGoal) * 100, 100);

    intakeValue.textContent = intake.toLocaleString();
    intakeProgress.textContent = Math.round(percentage) + "%";

    updateRecommendation();
});


// =============================
// HEART RATE
// =============================

updateHeartRateButton.addEventListener("click", function () {

    const heartRate = Number(heartRateInput.value);

    if (
        heartRateInput.value === "" ||
        heartRate < 30 ||
        heartRate > 220
    ) {
        alert("Please enter a heart rate between 30 and 220 BPM.");
        return;
    }

    heartRateValue.textContent = heartRate;

    if (heartRate < 60) {
        heartRateStatus.textContent = "Low";
    } else if (heartRate <= 100) {
        heartRateStatus.textContent = "Normal";
    } else {
        heartRateStatus.textContent = "High";
    }

    updateOverallHealth();
    updateRecommendation();
    updateProgressReport();
});


// =============================
// SLEEP TRACKER
// =============================

updateSleepButton.addEventListener("click", function () {

    const sleep = Number(sleepInput.value);

    if (
        sleepInput.value === "" ||
        sleep < 0 ||
        sleep > 24
    ) {
        alert("Please enter sleep hours between 0 and 24.");
        return;
    }

    sleepValue.textContent = sleep;

    if (sleep >= 7 && sleep <= 9) {
        sleepStatus.textContent = "Good";
    } else if (sleep >= 6) {
        sleepStatus.textContent = "Fair";
    } else {
        sleepStatus.textContent = "Low";
    }

    updateOverallHealth();
    updateRecommendation();
    updateProgressReport();
});


// =============================
// OVERALL HEALTH SUMMARY
// =============================

function updateOverallHealth() {

    const steps =
        Number(stepsValue.textContent.replace(/,/g, "")) || 0;

    const workouts =
        Number(workoutsValue.textContent) || 0;

    const heartRate =
        Number(heartRateValue.textContent) || 0;

    const sleep =
        Number(sleepValue.textContent) || 0;

    let score = 0;

    if (steps >= 8000) score++;
    if (workouts >= 3) score++;
    if (heartRate >= 60 && heartRate <= 100) score++;
    if (sleep >= 7 && sleep <= 9) score++;

    if (score === 4) {

        overallHealthStatus.textContent = "Excellent! 🌟";

        overallHealthMessage.textContent =
            "Your activity, workouts, heart rate and sleep are all looking good. Keep up the healthy routine!";

    } else if (score >= 2) {

        overallHealthStatus.textContent = "Good Progress! 💪";

        overallHealthMessage.textContent =
            "You're doing well overall. Keep staying active and work on the areas that need improvement.";

    } else {

        overallHealthStatus.textContent = "Needs Improvement 🌱";

        overallHealthMessage.textContent =
            "Try to increase your daily activity, maintain regular workouts and get enough sleep.";
    }
}


// =============================
// PERSONALIZED RECOMMENDATION
// =============================

function updateRecommendation() {

    const steps =
        Number(stepsValue.textContent.replace(/,/g, "")) || 0;

    const workouts =
        Number(workoutsValue.textContent) || 0;

    const heartRate =
        Number(heartRateValue.textContent) || 0;

    const sleep =
        Number(sleepValue.textContent) || 0;

    const intake =
        Number(intakeValue.textContent.replace(/,/g, "")) || 0;

    if (sleep < 6) {

        recommendationMessage.textContent =
            "😴 Try to get more sleep. Aim for around 7–9 hours to support recovery and daily energy.";

    } else if (steps < 5000) {

        recommendationMessage.textContent =
            "🚶 Try to increase your daily activity. A short walk can help you move closer to your step goal.";

    } else if (workouts < 3) {

        recommendationMessage.textContent =
            "💪 Try to include more regular workouts this week to improve your strength and fitness.";

    } else if (heartRate < 60) {

        recommendationMessage.textContent =
            "❤️ Your heart rate is on the lower side. Keep monitoring it and stay aware of how you feel.";

    } else if (heartRate > 100) {

        recommendationMessage.textContent =
            "❤️ Your heart rate is elevated. Take some rest and monitor your heart rate.";

    } else if (intake > 2000) {

        recommendationMessage.textContent =
            "🍎 Your calorie intake is above the daily target. Try to maintain a balanced diet and suitable portions.";

    } else {

        recommendationMessage.textContent =
            "🌟 Great job! You're maintaining a healthy routine. Keep staying active, eating well and getting enough rest.";
    }
}


// =============================
// PROGRESS REPORT
// =============================

function updateProgressReport() {

    const steps =
        Number(stepsValue.textContent.replace(/,/g, "")) || 0;

    const calories =
        Number(caloriesValue.textContent.replace(/,/g, "")) || 0;

    const workouts =
        Number(workoutsValue.textContent) || 0;

    const goal =
        Number(goalValue.textContent.replace("%", "")) || 0;

    const heartRate =
        Number(heartRateValue.textContent) || 0;

    const sleep =
        Number(sleepValue.textContent) || 0;

    document.getElementById("reportSteps").textContent =
        steps.toLocaleString();

    document.getElementById("reportCalories").textContent =
        calories.toLocaleString() + " kcal";

    document.getElementById("reportWorkouts").textContent =
        workouts + " / 5";

    document.getElementById("reportGoal").textContent =
        goal + "%";

    document.getElementById("reportHeartRate").textContent =
        heartRate + " BPM";

    document.getElementById("reportSleep").textContent =
        sleep + " hours";

    const reportSummary =
        document.getElementById("reportSummary");

    if (goal >= 80 && steps >= 8000 && workouts >= 3) {

        reportSummary.textContent =
            "Excellent progress! 🌟 You're staying active and moving strongly toward your fitness goals.";

    } else if (steps >= 5000 || workouts >= 3) {

        reportSummary.textContent =
            "You're making good progress! 💪 Keep staying active and continue working toward your goals.";

    } else {

        reportSummary.textContent =
            "Keep going! 🌱 Try to increase your daily activity and maintain a regular workout routine.";
    }
}


// =============================
// SAVE WORKOUT TO MONGODB
// =============================

async function saveWorkout(activity, duration, calories) {

    try {

        const response = await fetch(`${API_URL}/api/workouts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                activity: activity,
                duration: duration,
                calories: calories
            })
        });

        if (!response.ok) {
            throw new Error("Unable to save workout.");
        }

        alert(activity + " workout saved successfully! 💪");

        await loadBackendData();

    } catch (error) {

        console.error("Error saving workout:", error);
        alert("Could not save workout. Please check your backend server.");
    }
}


// =============================
// ACTIVITY BUTTONS
// =============================

document.getElementById("runningButton")
    .addEventListener("click", function () {
        saveWorkout("Running", 30, 220);
    });

document.getElementById("strengthButton")
    .addEventListener("click", function () {
        saveWorkout("Strength", 45, 300);
    });

document.getElementById("cyclingButton")
    .addEventListener("click", function () {
        saveWorkout("Cycling", 40, 280);
    });

document.getElementById("yogaButton")
    .addEventListener("click", function () {
        saveWorkout("Yoga", 30, 150);
    });


// =============================
// LOAD BACKEND DATA
// =============================

async function loadBackendData() {

    try {

        const [
            stepsResponse,
            workoutsResponse,
            caloriesResponse,
            goalResponse,
            activitiesResponse
        ] = await Promise.all([

            fetch(`${API_URL}/api/steps`),
            fetch(`${API_URL}/api/workouts`),
            fetch(`${API_URL}/api/calories`),
            fetch(`${API_URL}/api/goal`),
            fetch(`${API_URL}/api/activities`)

        ]);

        if (
            !stepsResponse.ok ||
            !workoutsResponse.ok ||
            !caloriesResponse.ok ||
            !goalResponse.ok ||
            !activitiesResponse.ok
        ) {
            throw new Error("Backend returned an error.");
        }

        const stepsData = await stepsResponse.json();
        const workoutsData = await workoutsResponse.json();
        const caloriesData = await caloriesResponse.json();
        const goalData = await goalResponse.json();
        const activitiesData = await activitiesResponse.json();
        // STORE BACKEND DATA IN REDUX
fitnessStore.dispatch({
    type: "UPDATE_DASHBOARD",
    payload: {
        steps: stepsData,
        workouts: workoutsData,
        calories: caloriesData,
        goal: goalData,
        activities: activitiesData
    }
});

const reduxData = fitnessStore.getState();
console.log("Redux Store Data:", reduxData);
const reduxSteps = reduxData.steps;
const reduxWorkouts = reduxData.workouts;
const reduxCalories = reduxData.calories;
const reduxGoal = reduxData.goal;
const reduxActivities = reduxData.activities;


        // STEPS

        stepsValue.textContent =
            reduxSteps.steps.toLocaleString();

        let stepsPercentage =
            Math.min((reduxSteps.steps / reduxSteps.goal) * 100, 100);

        stepsProgress.textContent =
            Math.round(stepsPercentage) + "%";


        // WORKOUTS FROM MONGODB

        const totalWorkouts = reduxWorkouts.length;
        const workoutGoal = 5;

        workoutsValue.textContent = totalWorkouts;

        let workoutPercentage =
            Math.min((totalWorkouts / workoutGoal) * 100, 100);

        workoutsProgress.textContent =
            Math.round(workoutPercentage) + "%";


        // CALORIES FROM MONGODB

        caloriesValue.textContent =
            reduxCalories.calories.toLocaleString();

        let caloriePercentage =
            Math.min((reduxCalories.calories / reduxCalories.goal) * 100, 100);

        caloriesProgress.textContent =
            Math.round(caloriePercentage) + "%";


        // GOAL

        const goalPercentage =
    Math.round((reduxGoal.completed / reduxGoal.goal) * 100);

        goalValue.textContent = goalPercentage + "%";

        if (goalPercentage >= 100) {
            goalMessage.textContent = "Goal achieved! 🎉";
        } else if (goalPercentage >= 75) {
            goalMessage.textContent = "Almost there! 💪";
        } else if (goalPercentage >= 50) {
            goalMessage.textContent = "Keep going! 🔥";
        } else {
            goalMessage.textContent = "You've got this! 🌟";
        }


        // ACTIVITIES

        // ACTIVITIES

document.querySelector("#runningActivity p").textContent =
    reduxActivities.running.duration + " min • " +
    reduxActivities.running.calories + " kcal";

document.querySelector("#strengthButton p").textContent =
    reduxActivities.strength.duration + " min • " +
    reduxActivities.strength.calories + " kcal";

document.querySelector("#cyclingButton p").textContent =
    reduxActivities.cycling.duration + " min • " +
    reduxActivities.cycling.calories + " kcal";

document.querySelector("#yogaButton p").textContent =
    reduxActivities.yoga.duration + " min • " +
    reduxActivities.yoga.calories + " kcal";


        // UPDATE SUMMARY AND REPORT

        updateOverallHealth();
        updateRecommendation();
        updateProgressReport();

    } catch (error) {

        console.error("Error loading backend data:", error);

    }
}


// LOAD DATA WHEN PAGE OPENS
// THIRD-PARTY API - MOTIVATIONAL QUOTES

async function loadMotivationQuote() {
    try {
        const response = await fetch("https://dummyjson.com/quotes/random");

        if (!response.ok) {
            throw new Error("Unable to fetch quote");
        }

        const data = await response.json();

        document.querySelector("#motivationQuote").textContent = data.quote;

    } catch (error) {
        console.error("Motivation API Error:", error);
    }
}

loadMotivationQuote();
loadBackendData();


// =============================
// START TRACKING BUTTON
// =============================

document.getElementById("startTracking")
    .addEventListener("click", function () {

        document.getElementById("health").scrollIntoView({
            behavior: "smooth"
        });

    });
