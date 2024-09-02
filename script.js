document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const completedTaskList = document.getElementById('completed-task-list');

    // Função para adicionar uma tarefa ao DOM
    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.textContent = task.text;
        li.dataset.id = task.id;

        if (task.completed) {
            li.classList.add('completed');
            completedTaskList.appendChild(li);
        } else {
            taskList.appendChild(li);
        }

        const removeBtn = document.createElement('span');
        removeBtn.textContent = '×';
        removeBtn.classList.add('remove');
        li.appendChild(removeBtn);
    }

    // Fetch tasks from server on page load
    fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
            tasks.forEach(task => {
                addTaskToDOM(task);
            });
        });

    // Adiciona nova tarefa ao enviar o formulário
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskText = taskInput.value.trim();

        if (taskText !== '') {
            const task = { text: taskText, completed: false };

            fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(task),
            })
                .then(response => response.json())
                .then(newTask => {
                    addTaskToDOM(newTask);
                    taskInput.value = '';
                });
        }
    });

    // Delegação de eventos para o botão de remover e marcar como concluído
    taskList.addEventListener('click', handleTaskAction);
    completedTaskList.addEventListener('click', handleTaskAction);

    function handleTaskAction(e) {
        const li = e.target.closest('li');

        if (e.target.classList.contains('remove')) {
            const taskId = li.dataset.id;

            fetch(`/tasks/${taskId}`, {
                method: 'DELETE',
            }).then(() => {
                li.remove();
            });
        } else if (li && li.tagName === 'LI') {
            const taskId = li.dataset.id;
            const taskCompleted = !li.classList.contains('completed');

            fetch(`/tasks/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: taskCompleted }),
            }).then(() => {
                li.remove();
                addTaskToDOM({ ...task, id: taskId, completed: taskCompleted });
            });
        }
    }
});
