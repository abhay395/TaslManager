// Query Selectors
let addButtons = document.querySelector("#add-todo");
let todoList = document.querySelector("#todo-list");
let TodoInput = document.querySelector("#todo-input");
let searchInput = document.querySelector(".search-input");

// Event Listeners

document.addEventListener("DOMContentLoaded", LoadTodos);
addButtons.addEventListener("click", addTodo);
TodoInput.addEventListener("keydown", (e) => e.key == "Enter" && addTodo());
searchInput.addEventListener("input", searchInputFunction);

// Event Handlers
// Add Todo
async function addTodo(e) {
  let inputValue = TodoInput.value.trim();

  if (inputValue == "") {
    alert("Please Enter a Value");
    return;
  }
  try {
    const data = await axios.post("/api/v1/tasks", {
      value: `${inputValue}`,
      completed: false,
      priority: "medium",
    });
    const { value, completed, priority, _id } = data.data;
    // console.log(value);
    let listItem = createTodoItem(
      value,
      completed === true ? "complete" : "incomplete",
      priority,
      _id
    );

    todoList.appendChild(listItem);
    TodoInput.value = "";
  } catch (error) {
    console.log(error);
  }
  // getTodos();
}

// Create Todo
function createTodoItem(value, status = "incomplete", priority = "medium", id) {
  let listItem = document.createElement("li");
  listItem.classList.add(status);
  listItem.innerHTML = ` <input type="checkbox" ${
    status === "complete" ? "checked" : ""
  }>
  <input type="text" value=${value} class="item-input" disabled />
   <select class="priority-select">
      <option value="high" ${
        priority === "high" ? "selected" : ""
      }>High</option>
      <option value="medium" ${
        priority === "medium" ? "selected" : ""
      }>Medium</option>
      <option value="low" ${priority === "low" ? "selected" : ""}>Low</option>
    </select>
  <button class="edit-btn">Edite</button>
  <button class="delete-btn">Delete</button>`;
  setEventListeners(listItem, id);

  return listItem;
}

function setEventListeners(item, id) {
  const [checkbox, editeButton, deletButton, inputFieldInList, prioritySelect] =
    [
      item.querySelector("input[type=checkbox]"),
      item.querySelector(".edit-btn"),
      item.querySelector(".delete-btn"),
      item.querySelector("input[type=text]"),
      item.querySelector(".priority-select"),
    ];
  // Event Listeners
  checkbox.addEventListener("click", checkboxFunction);
  editeButton.addEventListener("click", editeButtonFunction);
  deletButton.addEventListener("click", deletButtonFunction);
  inputFieldInList.addEventListener("keydown",(e)=>e.key=="Enter"&& editeButton());
  prioritySelect.addEventListener("change", prioritySelectFunction);

    // Event handlers

  // Checkbox Function
  async function checkboxFunction(e) {
    try {
      await axios.patch(`/api/v1/tasks/${id}`, {
        completed: checkbox.checked,
      });
      item.classList.toggle("complete", checkbox.checked);
      item.classList.toggle("incomplete", !checkbox.checked);
      editeButton.disabled = checkbox.checked;
    } catch (error) {
      console.log(error);
    }
  }

  // Edite Functonality
  async function editeButtonFunction(e) {
    if (!inputFieldInList.disabled) {
      try {
        // console.log(inputFieldInList.value);
        const data = await axios.patch(
          `/api/v1/tasks/${id}`,
          {
            value: inputFieldInList.value,
          }
        );
        
        inputFieldInList.disabled = true;
      } catch (error) {
        console.log(error);
      }
    } else {
      inputFieldInList.disabled = false;
      inputFieldInList.focus();
    }
  }

  // Delete Functonality
  async function deletButtonFunction(e) {
    try {
      await axios.delete(`/api/v1/tasks/${id}`);
      todoList.removeChild(item);
    } catch (error) {
      console.log(error);
    }
  }
  // Priority
  async function prioritySelectFunction (e){
    try {
      await axios.patch(`/api/v1/tasks/${id}`, {
        priority: prioritySelect.value,
      });
      sortTodosByPriority();
    } catch (error) {
      console.log(error);
    }
    // for Early work
  }
}

async function LoadTodos() {
  try {
    let data = await axios.get("/api/v1/tasks");
    let todos = data.data.tasks;
    todos.forEach((list) => {
      let listItem = createTodoItem(
        list.value,
        list.completed == true ? "complete" : "incomplete",
        list.priority,
        list._id
      );
      todoList.appendChild(listItem);
    });
    sortTodosByPriority();
  } catch (error) {
    console.log(error);
  }
}

// Sort todos
function sortTodosByPriority() {
  const todosArray = Array.from(todoList.children);
  todosArray.sort((a, b) => {
    const priorities = { high: 1, medium: 2, low: 3 };
    const priorityA = priorities[a.querySelector(".priority-select").value];
    const priorityB = priorities[b.querySelector(".priority-select").value];
    return priorityA - priorityB;
  });

  todosArray.forEach((todo) => todoList.appendChild(todo));
  // console.log(todosArray[0]);
}

// Filter Buttons
let filterButtons = Array.from(document.querySelectorAll(".Filter-Btn button"));
filterButtons.forEach((button) => {
  const dataType = button.getAttribute("data-type");
  button.classList.toggle("active", dataType === "all");
  button.classList.toggle("inactive", dataType !== "all");
  button.addEventListener("click", (e) => {
    const targetType = e.target.getAttribute("data-type");
    filterButtons.forEach((btn) => {
      btn.classList.toggle("active", btn === e.target);
      btn.classList.toggle("inactive", btn !== e.target);
    });
    todoList.querySelectorAll("li")?.forEach((item) => {
      item.style.display =
        targetType === "all" || item.classList.contains(targetType)
          ? "flex"
          : "none";
    });
  });
});

function searchInputFunction(e) {
  let searchValue = searchInput.value.trim().toLowerCase();
  todoList.querySelectorAll("li").forEach((item) => {
    let value = item.querySelector("input[type=text]").value.toLowerCase();
    item.style.display = value.includes(searchValue) ? "flex" : "none";
  });
}
