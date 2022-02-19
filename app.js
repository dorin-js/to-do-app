const tasks = [];

(function (arrOfTasks) {
  const objectOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});

  // UI elements
  const listContainer = document.querySelector(
    ".tasks-list-section .list-group"
  );
  const form = document.forms.addTask;
  const inputTitle = form.elements.title;
  const inputBody = form.elements.body;

  //Events
  renderAllTasks(objectOfTasks);
  form.addEventListener("submit", onFormSubmitHandler);
  listContainer.addEventListener("click", onDeleteEventHandler);
  function renderAllTasks(tasksList) {
    if (!tasksList) {
      console.error("Pass list tasks!");
      return;
    }

    const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach((task) => {
      const li = listItemTemplate(task);
      fragment.append(li);
    });
    listContainer.appendChild(fragment);
  }
  function listItemTemplate({ _id, title, body } = {}) {
    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "align-items-center",
      "flex-wrap",
      "mt-2"
    );
    li.setAttribute("data-task-id", _id);
    const span = document.createElement("span");
    span.textContent = title;
    span.style.fontWeight = "bold";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("btn", "btn-danger", "ml-auto", "delete-btn");

    const article = document.createElement("p");
    article.textContent = body;
    article.classList.add("mt-2", "w-100");

    li.append(span);
    li.append(deleteBtn);
    li.append(article);

    return li;
  }

  function onFormSubmitHandler(event) {
    event.preventDefault();
    const titleValue = inputTitle.value;
    const bodyValue = inputBody.value;

    if (!titleValue || !bodyValue) {
      alert("Title and body can't be empty!");
      return;
    }

    const task = createNewTask(titleValue, bodyValue);
    const listItem = listItemTemplate(task);
    listContainer.insertAdjacentElement("afterbegin", listItem);
    form.reset();
  }

  function createNewTask(title, body) {
    const newTask = {
      title,
      body,
      completed: false,
      _id: `task-${Math.random()}`,
    };

    objectOfTasks[newTask._id] = newTask;

    return { ...newTask };
  }

  function deleteTask(id) {
    const { title } = objectOfTasks[id];
    const isConfirm = confirm(`Are u sure u want to delete: ${title}?`);
    if (!isConfirm) return;
    delete objectOfTasks[id];
    return isConfirm;
  }

  function deleteTaskFromHTML(confirmed, el) {
    if (!confirmed) return;
    el.remove();
  }
  function onDeleteEventHandler({ target }) {
    if (target.classList.contains("delete-btn")) {
      const parent = target.closest("[data-task-id]");
      const id = parent.dataset.taskId;
      const confirmed = deleteTask(id);
      deleteTaskFromHTML(confirmed, parent);
    }
  }
})(tasks);
