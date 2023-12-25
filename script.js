const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');
const addButton = document.getElementById('add-transaction');
const transactionsList = document.getElementById('transactions');
const totalAmount = document.getElementById('total-amount');
const categoryFilter = document.getElementById('category-filter');

let transactions = [];

function addTransaction() {
  const description = descriptionInput.value;
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;
  const category = categoryInput.value;

  if (description.trim() === '' || isNaN(amount) || type === '' || category === '') {
    alert('Preencha todos os campos corretamente.');
    return;
  }

  const transaction = {
    id: Date.now(),
    description,
    amount,
    type,
    category
  };

  transactions.push(transaction);

  saveTransactions();
  renderTransactions();
  renderSummary();
  resetForm();
}

function deleteTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  saveTransactions();
  renderTransactions();
  renderSummary();
}

function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadTransactions() {
  const savedTransactions = localStorage.getItem('transactions');
  if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
    renderTransactions();
    renderSummary();
  }
}

function renderTransactions() {
  const category = categoryFilter.dataset.category;
  const filteredTransactions = category === 'todos' ? transactions : transactions.filter(transaction => transaction.category === category);
  
  transactionsList.innerHTML = '';

  filteredTransactions.forEach(transaction => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span>${transaction.description}</span>
      <span class="${transaction.type}">R$ ${transaction.amount.toFixed(2)}</span>
      <button class="delete-button" onclick="deleteTransaction(${transaction.id})">Excluir</button>
    `;
    transactionsList.appendChild(listItem);
  });
}

function renderSummary() {
  const totalExpense = transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalIncome = transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((total, transaction) => total + transaction.amount, 0);

  const total = totalIncome - totalExpense;

  totalAmount.textContent = `R$ ${total.toFixed(2)}`;
}

function resetForm() {
  descriptionInput.value = '';
  amountInput.value = '';
  typeInput.value = 'expense';
  categoryInput.value = 'todos';
  descriptionInput.focus();
}

categoryFilter.addEventListener('click', function(event) {
  const selectedCategory = event.target.dataset.category;

  if (selectedCategory) {
    categoryFilter.dataset.category = selectedCategory;
    renderTransactions();
  }
});

addButton.addEventListener('click', addTransaction);

// Carrega as transações salvas no localStorage ao iniciar a aplicação
loadTransactions();
