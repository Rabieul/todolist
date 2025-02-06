let tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Load tasks from localStorage or initialize as empty array

const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const categoryFilter = document.getElementById('category-filter');
const sortOptions = document.getElementById('sort-options');
const prioritySelect = document.getElementById('priority-select');
const addTaskBtn = document.getElementById('add-task-btn'); // Add Task button

// Add new task
function addTask() {
    const taskText = taskInput.value.trim();
    const category = categoryFilter.value;
    const priority = prioritySelect.value; // Get selected priority

    if (taskText === '') return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        category: category,
        priority: priority // Add priority to task object
    };

    tasks.push(newTask);
    taskInput.value = ''; // Clear the task input field
    saveTasks(); // Save tasks to localStorage
    renderTasks();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Store the tasks in localStorage
}

// Render tasks with sorting and filtering
function renderTasks() {
    taskList.innerHTML = '';

    // Filter tasks based on category
    let filteredTasks = tasks.filter(task => categoryFilter.value === 'all' || task.category === categoryFilter.value);

    // Sort tasks based on selected option
    filteredTasks = filteredTasks.sort((a, b) => {
        if (sortOptions.value === 'alphabetical') {
            return a.text.localeCompare(b.text);
        }
        if (sortOptions.value === 'completed') {
            return b.completed - a.completed; // Completed tasks first
        }
        if (sortOptions.value === 'pending') {
            return a.completed - b.completed; // Pending tasks first
        }
        return 0;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.id = `task-${task.id}`; // Unique ID for each task

        li.classList.add(task.completed ? 'completed' : 'pending');
        li.classList.add(task.category);

        li.innerHTML = `
            <div style="display: flex; align-items: center;">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTaskStatus(${task.id})">
                <span>${task.text}</span>
            </div>
            <div>
                <span class="category">${task.category}</span>
                <span class="priority ${task.priority}">${task.priority}</span>
                <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// Toggle task completion status
function toggleTaskStatus(id) {
    const task = tasks.find(task => task.id === id);
    task.completed = !task.completed;
    saveTasks(); // Save tasks to localStorage
    renderTasks();
}

// Edit task
function editTask(id) {
    const task = tasks.find(task => task.id === id);
    const newText = prompt("Edit task", task.text);
    if (newText) {
        task.text = newText;
        saveTasks(); // Save tasks to localStorage
        renderTasks();
    }
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks(); // Save tasks to localStorage
    renderTasks();
}

// Initial render
renderTasks();

// Event listeners for filtering and sorting
categoryFilter.addEventListener('change', renderTasks);
sortOptions.addEventListener('change', renderTasks);

// Add Task button click event
addTaskBtn.addEventListener('click', addTask);

// Allow "Enter" key to add task
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});
