export class Task {
    constructor(projectName, taskName) {
        this.projectName = projectName;
        this.taskName = [taskName];
    }

    static async create(task) {
        try {
            const res = await fetch('https://belodedov.online/task/create', {
                method: 'POST',
                body: JSON.stringify(task),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Access-Control-Allow-Origin': '*'
                },
            });
            const task_1 = await res.json();
            return task_1;
        } catch (err) {
            return console.log(err);
        }
    }

    static async getAllTasks() {
        try {
            console.log(process.env.BACKEND_SERVER+'/task/getAllTasks');
            const response = await fetch(process.env.BACKEND_SERVER+'/task/getAllTasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
            });
            const data = await response.json();
            return JSON.parse(data);
        } catch (err) {
            return console.log(err);
        }
    }

    static renderList(tasks) {
        const list = document.getElementById('tasks-list');
        let html = '';
        tasks.forEach(function(task) {
            html += `<div class="mui-col-md-2 task-box" data-id="${task.id}">
                        <div class="mui-panel">
                            <div class="task-controls">
                                <div class="task-select">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="task-important">
                                    <i class="fas fa-exclamation"></i>
                                </div>
                                <div class="task-delete">
                                    <i class="fas fa-trash"></i>
                                </div>
                            </div>
                            <h2 class="project-item-title" contenteditable="true">${task.projectName}</h2>
                            <ul>
                                <li class="task-item-title" contenteditable="true">${task.taskName}</li>
                            </ul>
                            <div class="task-ability">
                                <div class="task-color">
                                    <i class="fas fa-palette"></i>
                                </div>
                                <div class="task-image">
                                    <i class="fas fa-image"></i>
                                </div>
                            </div>
                        </div>
                    </div>`;
        });

        list.innerHTML = html;
        return html;
    }

    static async editTask(task) {
        try {
            const res = await fetch('https://belodedov.online/task/editTask', {
                method: 'POST',
                body: JSON.stringify(task),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
            });
            return await res.json();

        } catch (err) {
            return console.log(err);
        }
    }
    static async deleteTask(task) {
        try {
            const res = await fetch('https://belodedov.online/task/deleteTask', {
                method: 'POST',
                body: JSON.stringify(task),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
            });
            return await res.json();

        } catch (err) {
            return console.log(err);
        }
    }
}