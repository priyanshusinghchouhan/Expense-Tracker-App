const expenseForm = document.getElementById("expense-form");
const expenseName = document.getElementById("expense-name");
const expenseAmount = document.getElementById("expense-amount");
const expenseCategory = document.getElementById("expense-category");
const expenseDate = document.getElementById("expense-date");
const expenseList = document.getElementById("expense-list");
const totalAmount = document.getElementById("total-amount");
const filterCategory = document.getElementById("filter-category");
const searchInput = document.getElementById("search-expense");
const toggleBtn = document.getElementById("toggleBtn");
const body = document.getElementById("body");
const totalIncome = document.getElementById("totalIncome");
const totalExpenses = document.getElementById("totalExpenses");
const totalBalance = document.getElementById("totalBalance");

let expenses = [];

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = expenseName.value;
  const amount = parseFloat(expenseAmount.value);
  const category = expenseCategory.value;
  const date = expenseDate.value;

  //validation
  if (name.length >= 50 || amount < 0) {
    showWarning("Invalid");
    return;
  }

  //creating object to render in table
  let expense = {
    id: Date.now(),
    name,
    amount,
    category,
    date,
  };

  expenses.push(expense);

  renderExpenses(expenses);
  updateTotalAmount();

  expenseForm.reset();
});


expenseList.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = parseInt(e.target.dataset.id);
    expenses = expenses.filter((expense) => expense.id !== id);
    renderExpenses(expenses);
    updateTotalAmount();
  }

  if (e.target.classList.contains("edit-btn")) {
    const id = parseInt(e.target.dataset.id);
    const expense = expenses.find((expense) => expense.id === id); // finds the object whoes id matches 

    document.getElementById("expense-name").value = expense.name; // objects.name
    document.getElementById("expense-amount").value = expense.amount; // objects.amount
    document.getElementById("expense-category").value = expense.category;
    document.getElementById("expense-date").value = expense.date;


    expenses = expenses.filter((expense) => expense.id !== id);//delete the list once the edit btn is clicked so the user can edit it
    // re-render UI
    renderExpenses(expenses);
    updateTotalAmount();
  }
});



filterCategory.addEventListener("change", (e) => {
  const selectedCategory = e.target.value;
  if(selectedCategory === "All"){
    renderExpenses(expenses);
    updateTotalAmount();
  }else{
    const expense = expenses.filter(exp => exp.category === selectedCategory);

    if(expense.length === 0){
      renderExpenses(expense);
      totalAmount.textContent = "0.00"
      showWarning("Empty");
      return;
    }

    const filteredExpenses = expense.reduce((sum,exp) => sum + exp.amount, 0)
    console.log(filteredExpenses);

    renderExpenses(expense);
    totalAmount.textContent = filteredExpenses.toFixed(2);
  }
});


searchInput.addEventListener("input", (e) => {
  const targetValue = e.target.value.trim();
  if(targetValue.toLowerCase() === ""){
    renderExpenses(expenses);
    updateTotalAmount();
  }else{
    const filterExpense = expenses.filter(exp => exp.name.toLowerCase().includes(targetValue.toLowerCase()));
    const filteredAmount = filterExpense.reduce((sum, exp) => sum + exp.amount, 0);
    console.log(filterExpense);
    renderExpenses(filterExpense);
    totalAmount.textContent = filteredAmount.toFixed(2);
  }
})


function renderExpenses(expenses) {
  expenseList.innerHTML = "";

  expenses.forEach((expense) => {
    const row = document.createElement("tr");

    row.innerHTML = `
            <td>${expense.name}</td>
            <td>${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
            <td>
                <button class="edit-btn" data-id="${expense.id}">Edit</button>
                <button class="delete-btn" data-id="${expense.id}">Delete</button>
            </td>`;

    expenseList.appendChild(row);
  });
}

function updateTotalAmount() {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalAmount.textContent = total.toFixed(2);

  const totalincome = 25000
  totalBalance.textContent = `Balance : ${totalincome - total}`
  totalExpenses.textContent = `Total Expenses : ${total}` 
}


toggleBtn.addEventListener("click", () =>{
  body.classList.toggle("dark-mode")
})


function showWarning(message) {
  const warning = document.getElementById("warning");
  warning.textContent = message;

  setTimeout(() => {
    warning.textContent = "";
  },3000);
}


