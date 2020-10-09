import './style.css';
import './script';
import { Task } from "./task/task";

const form = document.getElementById('add-task-form');
const projectName = form.querySelector('#project-name');
const taskName = form.querySelector('#project-task');
const submitBtn = form.querySelector('#add-task-submit');
let tasks = [];

window.addEventListener('load', appInit);
form.addEventListener('submit', createTask);


function createTask(e) {
    e.preventDefault();

    const task = new Task(
        projectName.value.trim(),
        taskName.value.trim()
    );

    submitBtn.disabled = true;

    Task.create(task).then(data => {
        projectName.value = '';
        taskName.value = '';
        projectName.className = '';
        submitBtn.disabled = false;
        task.id = data;
        tasks.unshift(task);
        Task.renderList(tasks);
        addEditHandler();
        addDeleteHandler();
    });
}

function deleteTask(task) {
    Task.deleteTask(task)
        .then(status => {
            status = JSON.parse(status);
            if (status.serverStatus == 2) {
                document.querySelectorAll('.task-box').forEach(function(taskEl) {
                    if (taskEl.dataset.id == task.id) {
                        taskEl.remove();
                    }
                });
            }
        })
        .catch(err => console.log(err));
}

function editTask(task) {
    Task.editTask(task)
        .then(status => {
            console.log(JSON.parse(status));
        })
        .catch(err => console.log(err));
}

function appInit() {
    Task.getAllTasks()
        .then((data) => {
            Task.renderList(data);
            addEditHandler();
            addDeleteHandler();
            tasks = data;
        });
}

function addEditHandler() {
    const projectName = document.querySelectorAll('.project-item-title');
    const taskName = document.querySelectorAll('.task-item-title');
    let projectNameValue, taskNameValue;
    projectName.forEach(function(task) {
        task.addEventListener('focusin', function() {
            projectNameValue = this.textContent;
        });
        task.addEventListener('focusout', function() {
            const taskId = this.parentElement.closest('.task-box').dataset.id;
            if (projectNameValue !== this.textContent) {
                editTask({ "id": taskId, "projectName": this.textContent });
            }
        });
    });
    taskName.forEach(function(task) {
        task.addEventListener('focusin', function() {
            taskNameValue = this.textContent;
        });
        task.addEventListener('focusout', function() {
            const taskId = this.parentElement.closest('.task-box').dataset.id;
            if (taskNameValue !== this.textContent) {
                editTask({ "id": taskId, "taskName": this.textContent });
            }
        });
    });
}

function addDeleteHandler() {
    const taskDelete = document.querySelectorAll('.task-delete');
    taskDelete.forEach(function(task) {
        task.addEventListener('click', function() {
            const taskId = this.parentElement.closest('.task-box').dataset.id;
            deleteTask({ "id": taskId });
        });
    });
}