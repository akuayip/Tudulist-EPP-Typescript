// Mendefinisikan tipe untuk task
interface Task {
    text: string;
    completed: boolean;
}

// Fungsi untuk mendapatkan elemen dari DOM
function getElementById<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element with id ${id} not found`);
    return element as T;
}

// Mengambil elemen DOM
const taskInput = getElementById<HTMLInputElement>("taskInput");
const addTaskButton = getElementById<HTMLButtonElement>("addTaskBtn");
const taskList = getElementById<HTMLUListElement>("taskList");
const filterSelect = getElementById<HTMLSelectElement>("filterSelect");

// Mendapatkan tasks dari localStorage atau menginisialisasi sebagai array kosong
function getTasks(): Task[] {
    return JSON.parse(localStorage.getItem("tasks") || '[]');
}

let tasks: Task[] = getTasks();

// Render tasks ke dalam DOM
function renderTasks(): void {
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
}

// Toggle status completed dari task
function toggleCompleted(index: number): void {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Menambahkan task baru
function addTask(): void {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        tasks.push({ text: taskText, completed: false });
        taskInput.value = "";
        saveTasks();
        renderTasks();
    }
}

// Menghapus task
function deleteTask(index: number): void {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Mengedit task
function editTask(index: number): void {
    const newText = prompt("Edit task", tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText;
        saveTasks();
        renderTasks();
    }
}

// Menyimpan tasks ke dalam localStorage
function saveTasks(): void {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Menambahkan event listener ke tombol dan input
function addEventListeners(): void {
    addTaskButton.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") addTask();
    });
    filterSelect.addEventListener("change", renderTasks);
}

// Inisialisasi aplikasi
function init(): void {
    tasks = getTasks();
    addEventListeners();
    renderTasks();
}

// Memulai aplikasi
init();
