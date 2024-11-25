// @ts-check

/**
 * @property {number} id
 * @property {string} title
 * @property {string} description
 * @property {string} dueDate
 * @property {boolean} completed
 */

/**
 * @class
 */
class Task {
    /**
     * @param {number} id
     * @param {string} title
     * @param {string} description
     * @param {string} dueDate
     * @param {boolean} [completed=false]
     */
    constructor(id, title, description, dueDate, completed = false) {
        /** @type {number} */
        this.id = id;
        /** @type {string} */
        this.title = title;
        /** @type {string} */
        this.description = description;
        /** @type {string} */
        this.dueDate = dueDate;
        /** @type {boolean} */
        this.completed = completed;
    }

    /**
     * Toggles the completion status of the task.
     * @returns {void}
     */
    toggleCompleted() {
        this.completed = !this.completed;
    }
}

/**
 * @class
 */
class TaskManager {
    /**
     * Saves tasks to LocalStorage.
     * @returns {void}
     */
    saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    /**
     * Adds a new task.
     * @param {string} title
     * @param {string} description
     * @param {string} dueDate
     * @returns {Task}
     */
    addTask(title, description, dueDate) {
        const newTask = new Task(Date.now(), title, description, dueDate);
        this.tasks.push(newTask);
        this.saveTasksToLocalStorage();
        return newTask;
    }

    /**
     * Edits an existing task.
     * @param {number} id
     * @param {string} newTitle
     * @param {string} newDescription
     * @param {string} newDueDate
     * @returns {void}
     */
    editTask(id, newTitle, newDescription, newDueDate) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.title = newTitle;
            task.description = newDescription;
            task.dueDate = newDueDate;
            this.saveTasksToLocalStorage();
        }
    }

    /**
     * Deletes a task.
     * @param {number} id
     * @returns {void}
     */
    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasksToLocalStorage();
    }

    /**
     * Toggles the completion status of a task.
     * @param {number} id
     * @returns {void}
     */
    toggleTaskCompletion(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.toggleCompleted();
            this.saveTasksToLocalStorage();
        }
    }

    /**
     * Gets all tasks.
     * @returns {Task[]}
     */
    getAllTasks() {
        return this.tasks;
    }
}

// DOM Manipulation
const taskManager = new TaskManager();
const taskListContainer = /** @type {HTMLElement} */ (document.getElementById('task-list'));
const taskForm = /** @type {HTMLFormElement} */ (document.getElementById('task-form'));
const taskTitleInput = /** @type {HTMLInputElement} */ (document.getElementById('task-title'));
const taskDescriptionInput = /** @type {HTMLInputElement} */ (document.getElementById('task-description'));
const taskDueDateInput = /** @type {HTMLInputElement} */ (document.getElementById('task-due-date'));
const filterSelect = /** @type {HTMLSelectElement} */ (document.getElementById('filter'));

// Event Listeners
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskTitleInput.value;
    const description = taskDescriptionInput.value;
    const dueDate = taskDueDateInput.value;

    if (title && description && dueDate) {
        const newTask = taskManager.addTask(title, description, dueDate);
        renderTasks();
        taskForm.reset();
    }
});

filterSelect.addEventListener('change', renderTasks);

// Render tasks to the DOM
function renderTasks() {
    taskListContainer.innerHTML = '';

    const filterValue = filterSelect.value;
    const tasksToRender = taskManager.getAllTasks().filter(task => {
        if (filterValue === 'all') return true;
        if (filterValue === 'completed') return task.completed;
        if (filterValue === 'pending') return !task.completed;
    });

    tasksToRender.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');

        const taskTitle = document.createElement('h3');
        taskTitle.textContent = task.title;
        taskElement.appendChild(taskTitle);

        const taskDescription = document.createElement('p');
        taskDescription.textContent = task.description;
        taskElement.appendChild(taskDescription);

        const taskDueDate = document.createElement('p');
        taskDueDate.textContent = `Due Date: ${task.dueDate}`;
        taskElement.appendChild(taskDueDate);

        const taskStatus = document.createElement('p');
        taskStatus.textContent = task.completed ? 'Completed' : 'Pending';
        taskElement.appendChild(taskStatus);

        const toggleButton = document.createElement('button');
        toggleButton.textContent = task.completed ? 'Mark as Pending' : 'Mark as Completed';
        toggleButton.addEventListener('click', () => {
            taskManager.toggleTaskCompletion(task.id);
            renderTasks();
        });
        taskElement.appendChild(toggleButton);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            taskTitleInput.value = task.title;
            taskDescriptionInput.value = task.description;
            taskDueDateInput.value = task.dueDate;
            taskManager.deleteTask(task.id);
            renderTasks();
        });
        taskElement.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            taskManager.deleteTask(task.id);
            renderTasks();
        });
        taskElement.appendChild(deleteButton);

        taskListContainer.appendChild(taskElement);
    });
}

// Initial render of tasks
renderTasks();
