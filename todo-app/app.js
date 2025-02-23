
const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

// Custom Middleware to Log Requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Read Tasks from JSON
const readTasks = () => {
    const data = fs.readFileSync("tasks.json", "utf-8");
    return JSON.parse(data);
};

// Write Tasks to JSON
const writeTasks = (tasks) => {
    fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 4));
};

// GET /tasks → Show all tasks
app.get("/tasks", (req, res) => {
    const tasks = readTasks();
    res.render("tasks", { tasks });
});

// GET /task?id=1 → Fetch a specific task
app.get("/task", (req, res) => {
    const { id } = req.query;
    const tasks = readTasks();
    const task = tasks.find(t => t.id === parseInt(id));
    if (task) {
        res.render("task", { task });
    } else {
        res.status(404).send("Task not found");
    }
});

// POST /add-task → Add a new task
app.post("/add-task", (req, res) => {
    const { title, description } = req.body;
    const tasks = readTasks();
    const newTask = { id: tasks.length + 1, title, description };
    tasks.push(newTask);
    writeTasks(tasks);
    res.redirect("/tasks");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
