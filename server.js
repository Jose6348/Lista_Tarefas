const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const tasksFilePath = path.join(__dirname, 'data', 'tasks.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to read tasks from file
const readTasks = () => {
    const tasksData = fs.readFileSync(tasksFilePath, 'utf8');
    return JSON.parse(tasksData);
};

// Helper function to write tasks to file
const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
};

// Get all tasks
app.get('/tasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
    const tasks = readTasks();
    const newTask = { id: Date.now().toString(), ...req.body };
    tasks.push(newTask);
    writeTasks(tasks);
    res.json(newTask);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    let tasks = readTasks();
    tasks = tasks.filter(task => task.id !== req.params.id);
    writeTasks(tasks);
    res.sendStatus(200);
});

// Update task completion status
app.patch('/tasks/:id', (req, res) => {
    const tasks = readTasks();
    const task = tasks.find(task => task.id === req.params.id);
    if (task) {
        task.completed = req.body.completed;
        writeTasks(tasks);
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
