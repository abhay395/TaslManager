let addButtons = document.querySelector("#add-todo");
let todoList = document.querySelector("#todo-list");
let TodoInput = document.querySelector("#todo-input");
let searchButton = document.querySelector(".search-btn");
let searchInput = document.querySelector(".search-input");
// const createTodoItem =require('./Ui.js');
// There we create a add todo functionalty;
document.addEventListener("DOMContentLoaded", LoadTodos);



addButtons.addEventListener("click", addTodo);
async function addTodo(e) {
  let value = TodoInput.value.trim();
  
  if (value == "") {
    alert("Please Enter a Value");
    return;
  }
  try {
   const data = await axios.get('https://dummyjson.com/test')
   console.log(data);
    let listItem = createTodoItem(value);

  todoList.appendChild(listItem);
  TodoInput.value = "";
  saveTodos(); 
  } catch (error) {
    console.log(error);
  }
  // getTodos();
}



function createTodoItem(value, status = "incomplete", priority = "medium") {
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

  let checkbox = listItem.querySelector("input[type=checkbox]");
  let editeButton = listItem.querySelector(".edit-btn");
  let deletButton = listItem.querySelector(".delete-btn");
  let inputFieldInList = listItem.querySelector("input[type=text]");
  let prioritySelect = listItem.querySelector(".priority-select");

  // Completed or not Completed Functionality
  checkbox.addEventListener("click", (e) => {
    listItem.classList.toggle("complete", checkbox.checked);
    listItem.classList.toggle("incomplete", !checkbox.checked);
    editeButton.disabled = checkbox.checked;
    saveTodos();
  });

  // Edite Functonality
  editeButton.addEventListener("click", (e) => {
    inputFieldInList.disabled = !inputFieldInList.disabled;
    if (!inputFieldInList.disabled) {
      inputFieldInList.focus();
    }
    saveTodos();
  });

  inputFieldInList.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      inputFieldInList.disabled = ture;
    }
    saveTodos();
  });

  // Delete Functonality
  deletButton.addEventListener("click", (e) => {
    todoList.removeChild(listItem);
    saveTodos();
  });
  // Priority
  prioritySelect.addEventListener("change", () => {
    // for Early work
    sortTodosByPriority();
    saveTodos();
  });

  return listItem;
}



TodoInput.addEventListener('keydown',(e)=>{
  if(e.key=="Enter"){
    let value = e.target.value.trim();
    if (value == "") {
      alert("Please Enter a Value");
      return;
    }
  
    let listItem = createTodoItem(value);
    todoList.appendChild(listItem);
    TodoInput.value = "";
    saveTodos();
  }
})




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



function saveTodos() {
  let todos = [];
  todoList.querySelectorAll("li").forEach((list) => {
    let value = list.querySelector("input[type=text]").value;
    let status = list.classList.contains("complete")
      ? "complete"
      : "incomplete";
    let prioritie = list.querySelector("select").value;
    todos.push({ value, status, prioritie });
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}



function LoadTodos() {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.forEach((list) => {
    let listItem = createTodoItem(list.value, list.status, list.priority);
    todoList.appendChild(listItem);
  });
}



// Filter Buttons
let filterButtons = Array.from(document.querySelectorAll(".Filter-Btn button"));
filterButtons.forEach((button) => {
  const dataType = button.getAttribute("data-type");
  button.classList.toggle("active", dataType === "all");
  button.classList.toggle("inactive", dataType !== "all");
  button.addEventListener("click", (e) => {
    const targetType = e.target.getAttribute("data-type");
    // let ListItem = Array.from(todoList.querySelectorAll("li"));
    // console.log(ListItem);

    // if (e.target.className != "active") {
    //   e.target.classList.replace("inactive", "active");

    //   filterButtons.forEach((Element) => {
    //     let targetElementAttribute = e.target.getAttribute("data-type");
    //     if (Element.getAttribute("data-type") != targetElementAttribute) {
    //       Element.classList.replace("active", "inactive");
    //       ListItem.forEach((element) => {
    //         if (targetElementAttribute == "all") {
    //           element.style.display = "flex";
    //         } else if (element.className == targetElementAttribute) {
    //           element.style.display = "flex";
    //         } else {
    //           element.style.display = "none";
    //         }
    //       });
    //     }
    //   });
    // }
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




searchInput.addEventListener("input", (e) => {
  let searchValue = searchInput.value.trim();
  // console.log('aa')
  // if(searchValue==''){
  //   alert('Enter Some Text');
  //   return;
  // }
  let valueArray = searchValue.split("");
  let todos = todoList.querySelectorAll("li");
  let flag = true;
  // valueArray.forEach(char=>{
  //   todos.querySelector().forEach(el=>{

  //   })
  // })
  todos.forEach((el) => {
    let value = el.querySelector("input[type=text]").value;
    if (searchValue == "" || value.includes(searchValue)) {
      el.style.display = "flex";
      return;
    }
    if (!value.includes(searchValue)) {
      el.style.display = "none";
      return;
    }
  });
  // todos.forEach((todo)=>{
  //   if(todo.querySelector('input[type=text]').split(''))
  // });
  // console.log(valueArray);
});
