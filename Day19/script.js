document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("add-task");
  const newTaskInput = document.getElementById("new-task");
  const taskList = document.getElementById("task-list");

  let tasks = [];

  function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");

      const span = document.createElement("span");
      span.textContent = task.description;
      if (task.completed) {
        span.classList.add("completed");
      }
      li.appendChild(span);

      const actionBtn = document.createElement("button");
      actionBtn.textContent = task.completed ? "Unmark" : "Complete";
      actionBtn.classList.add("action-btn");
      actionBtn.dataset.index = index;
      actionBtn.dataset.action = "toggle";

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.classList.add("delete-btn");
      deleteBtn.dataset.index = index;
      deleteBtn.dataset.action = "delete";

      li.appendChild(actionBtn);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  function addTask(description) {
    if (description.trim() === "") return;
    tasks.push({ description, completed: false });
    renderTasks();
  }

  function toggleTask(index) {
    const task = tasks[index];
    if (task.completed) {
      // Unmark
      const [removed] = tasks.splice(index, 1);
      removed.completed = false;
      let insertionIndex = 0;
      while (
        insertionIndex < tasks.length &&
        !tasks[insertionIndex].completed
      ) {
        insertionIndex++;
      }
      tasks.splice(insertionIndex, 0, removed);
    } else {
      // Mark complete
      const [removed] = tasks.splice(index, 1);
      removed.completed = true;
      tasks.push(removed);
    }
    renderTasks();
  }

  function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
  }

  addTaskBtn.addEventListener("click", () => {
    const description = newTaskInput.value.trim();
    addTask(description);
    newTaskInput.value = "";
  });

  taskList.addEventListener("click", (e) => {
    const action = e.target.dataset.action;
    const index = parseInt(e.target.dataset.index);
    if (action === "toggle") {
      toggleTask(index);
    } else if (action === "delete") {
      deleteTask(index);
    }
  });

  // Initial render
  renderTasks();
});
