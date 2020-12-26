const transactionsUl = document.querySelector('#transactions')
const incomeDisplay = document.querySelector('#receita__balanco')
const expenseDisplay = document.querySelector('#despesas__balanco')
const balanceDisplay = document.querySelector('#saldoAtual')
const form = document.querySelector('#form')
const inputTransactionName = document.querySelector('#transacao')
const inputTransactionValue = document.querySelector('#transacao_value')


const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))

let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    transactions = transactions
        .filter(transaction => transaction.id !== ID)

    updateLocalStorage()
    init()
}

const addTransactionIntoDOM = ({amount, name, id}) => {

    const operator = amount < 0 ? '-':'+'
    const cssClass = amount < 0 ? 'minus':'plus'
    const amountWithoutOperator = Math.abs(amount) 
    const li = document.createElement('li')
    
    li.classList.add(cssClass)
    li.innerHTML = 
        `<span>${name}</span> 
        <span>${operator} R$ ${amountWithoutOperator}</span><button class="delete-btn" onClick="removeTransaction(${id})">x</button>`

    transactionsUl.prepend(li)
}

const getExpenses = transactionsAmounts => 
    Math.abs(
        transactionsAmounts
        .filter(value => value < 0)
        .reduce((accumulator, value) => accumulator + value, 0)
    ).toFixed(2)

const getIncome = transactionsAmounts => transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2)

const getTotal = transactionsAmounts => transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2)

const updateBalanceValues = () => {

    const transactionsAmounts = transactions
        .map(({amount}) => amount)

    const total = getTotal(transactionsAmounts)

    balanceDisplay.textContent = `R$ ${total}`;

    const income = getIncome(transactionsAmounts)

    incomeDisplay.textContent = `R$ ${income}`

    const expense = getExpenses(transactionsAmounts)

    expenseDisplay.textContent = `R$ ${expense}`

}

const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionIntoDOM)
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(), 
        name: transactionName, 
        amount: Number(transactionAmount)
    })
}

const cleanInputs = () => {
    inputTransactionName.value = ''
    inputTransactionValue.value = ''
}

const handleFormSubmit = event => {
    event.preventDefault()

    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionValue.value.trim()
    const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

    if(isSomeInputEmpty){
        alert('Por favor preencha todos os campos da transação!')
        return
    }

   addToTransactionsArray(transactionName, transactionAmount)
   
   init()
   updateLocalStorage()
   cleanInputs()
    
}

const generateID = () => Math.round(Math.random()*1000)

form.addEventListener('submit', handleFormSubmit)