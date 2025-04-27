var ar = [];
var editId = null;
var idCounter = 0; 

var btnAdd = document.querySelector("#btnAdd");
var titleInput = document.querySelector("#title");
var descriptionInput = document.querySelector("#description");
var taskList = document.querySelector("#taskList");
var searchInput = document.querySelector("#search");
var clearSearchBtn = document.querySelector("#clearSearch");

window.addEventListener("load", function () {
  var stored = localStorage.getItem("tasks");
  if (stored) {
    ar = JSON.parse(stored);
    displayTasks();
  }
});

btnAdd.addEventListener("click", function () {
  if (editId === null) {
    addTask();
  } else {
    updateTask();
  }
  displayTasks();
});

searchInput.addEventListener("input", function () {
  var searchTerm = searchInput.value.replace(/^\s+|\s+$/g, "").toLowerCase();
  var filteredTasks = ar.filter(function (task) {
    return task.Title.toLowerCase().includes(searchTerm);
  });
  displayTasks(filteredTasks);
});

clearSearchBtn.addEventListener("click", function () {
  searchInput.value = "";
  displayTasks();
});

function addTask() {
  clearErrors();

  var title = titleInput.value;
  var description = descriptionInput.value;

  if (!validateInputs(title, description)) return;

  var task = {
    id: taskCouid++, 
    Title: title,
    Description: description,
    done: false 
  };

  ar.push(task);
  saveToLocal();
  clearInputs();
}

function updateTask() {
  clearErrors();

  var title = titleInput.value;
  var description = descriptionInput.value;

  if (!validateInputs(title, description)) return;

  var index = findTaskIndex(editId);
  if (index !== -1) {
    ar[index].Title = title;
    ar[index].Description = description;
  }

  editId = null;
  btnAdd.textContent = "Add Task";
  saveToLocal();
  clearInputs();
}

function displayTasks(tasksToDisplay) {
  if (!tasksToDisplay) tasksToDisplay = ar;
  taskList.innerHTML = "";

  tasksToDisplay.forEach(function (task) {
    var taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.dataset.id = task.id;

    var titleSpan = document.createElement("span");
    titleSpan.textContent = task.Title;
    if (task.done) {
      titleSpan.classList.add("done"); 
    }

    var doneBtn = document.createElement("button");
    doneBtn.textContent = "✅";
    doneBtn.addEventListener("click", function () {
      task.done = !task.done;
      saveToLocal();
      displayTasks();
    });

    var editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.addEventListener("click", function () {
      titleInput.value = task.Title;
      descriptionInput.value = task.Description;
      editId = task.id;
      btnAdd.textContent = "Update Task";
    });

    var deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.addEventListener("click", function () {
      ar = ar.filter(function (t) {
        return t.id !== task.id;
      });
      saveToLocal();
      displayTasks();
    });

    var btnContainer = document.createElement("div");
    btnContainer.classList.add("btn-container");

    btnContainer.appendChild(doneBtn);
    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);
    taskDiv.appendChild(titleSpan);
    taskDiv.appendChild(btnContainer);
    taskList.appendChild(taskDiv);
  });
}

function validateInputs(title, description) {
  var valid = true;

  if (!isValidTitle(title)) {
    document.getElementById("titleError").textContent =
      "Title must start with uppercase and have 3–8 lowercase letters.";
    valid = false;
  }

  if (!isValidDescription(description)) {
    document.getElementById("descError").textContent =
      "Description must be at least 20 characters.";
    valid = false;
  }

  return valid;
}

function clearErrors() {
  document.getElementById("titleError").textContent = "";
  document.getElementById("descError").textContent = "";
}

function clearInputs() {
  titleInput.value = "";
  descriptionInput.value = "";
  clearErrors();
  btnAdd.textContent = "Add Task";
  editId = null;
}

function isValidTitle(title) {
  var regex = /^[A-Z][a-z]{3,8}$/;
  return regex.test(title);
}

function isValidDescription(description) {
  return description.length >= 20;
}

function findTaskIndex(taskId) {
  return ar.findIndex(function (task) {
    return task.id === taskId;
  });
}

function saveToLocal() {
  localStorage.setItem("tasks", JSON.stringify(ar));
}
