// Mendefinisikan tipe untuk task
interface Task {
    text: string;
    completed: boolean;
}

const taskInput = document.getElementById("taskInput") as HTMLInputElement;
const addTaskButton = document.getElementById("addTaskBtn") as HTMLButtonElement;
const taskList = document.getElementById("taskList") as HTMLUListElement;
const filterSelect = document.getElementById("filterSelect") as HTMLSelectElement;

let tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || null) || '[]';

const renderTasks = () => {
    taskList.innerHTML = "";

    const filter = filterSelect.value;
    let filteredTasks: Task[] = [];

    if (filter === "all") {
        filteredTasks = tasks;
    } else if (filter === "complete") {
        filteredTasks = tasks.filter(task => task.completed);
    } else {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    filteredTasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.classList.add("task");
        li.textContent = task.text;
        if (task.completed) li.classList.add("completed");

        const statusContainer = document.createElement("div");
        statusContainer.classList.add("status-container");

        const completedBtn = document.createElement("button");
        completedBtn.textContent = task.completed ? "Ulangi" : "Selesai";
        completedBtn.addEventListener("click", () => { toggleCompleted(index) });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Hapus";
        deleteBtn.addEventListener("click", () => { deleteTask(index) });

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => { editTask(index) });

        statusContainer.appendChild(completedBtn);
        statusContainer.appendChild(deleteBtn);
        statusContainer.appendChild(editBtn);

        li.appendChild(statusContainer);
        taskList.appendChild(li);
    });
};

const toggleCompleted = (index: number): void => {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
};

const addTask = (): void => {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        tasks.push({ text: taskText, completed: false });
        taskInput.value = "";
        saveTasks();
        renderTasks();
    }
};

const deleteTask = (index: number): void => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
};

const editTask = (index: number): void => {
    const newText = prompt("Edit task", tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText;
        saveTasks();
        renderTasks();
    }
};

const saveTasks = (): void => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

addTaskButton.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") addTask();
});
filterSelect.addEventListener("change", renderTasks);

renderTasks();
