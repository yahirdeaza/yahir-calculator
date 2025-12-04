const currentDisplay = document.getElementById('current-result');
const prevDisplay = document.getElementById('prev-expression');
const historySidebar = document.getElementById('history-sidebar');
const historyList = document.getElementById('history-list');
const toggleHistoryBtn = document.getElementById('toggle-history');
const clearHistoryBtn = document.getElementById('clear-history');

let expression = '';
let currentInput = '';
let history = JSON.parse(localStorage.getItem('calculatorHistory')) || [];

// Load previous history
history.forEach(entry => addHistoryEntry(entry));

// Toggle history sidebar
toggleHistoryBtn.addEventListener('click', () => {
  historySidebar.style.display = historySidebar.style.display === 'flex' ? 'none' : 'flex';
});

// Clear history
clearHistoryBtn.addEventListener('click', () => {
  historyList.innerHTML = '';
  history = [];
  localStorage.removeItem('calculatorHistory');
});

document.querySelectorAll('.buttons button').forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.textContent;

    if (btn.classList.contains('number')) {
      currentInput += val;
      currentDisplay.textContent = currentInput;
    } else if (btn.classList.contains('operator')) {
      if (currentInput === '' && expression === '') return;
      expression += currentInput + val;
      prevDisplay.textContent = expression;
      currentInput = '';
      currentDisplay.textContent = '0';
    } else if (btn.classList.contains('func')) {
      if (currentInput === '') return;
      if (btn.dataset.func === 'sqrt') {
        const res = Math.sqrt(parseFloat(currentInput));
        prevDisplay.textContent = `√(${currentInput})`;
        currentInput = res;
        currentDisplay.textContent = currentInput;
      } else if (btn.dataset.func === '^') {
        expression += currentInput + '**';
        prevDisplay.textContent = expression.replace('**','^');
        currentInput = '';
      }
    } else if (btn.classList.contains('equals')) {
      expression += currentInput;
      try {
        const result = eval(expression);
        currentDisplay.textContent = result;
        prevDisplay.textContent = expression + ' =';
        addHistoryEntry(expression + ' = ' + result);
        history.push(expression + ' = ' + result);
        localStorage.setItem('calculatorHistory', JSON.stringify(history));
        expression = '';
        currentInput = result.toString();
      } catch(e){
        currentDisplay.textContent = 'Error';
        expression = '';
        currentInput = '';
      }
    } else if (btn.classList.contains('clear')) {
      expression = '';
      currentInput = '';
      currentDisplay.textContent = '0';
      prevDisplay.textContent = '';
    }
  });
});

function addHistoryEntry(entry) {
  const li = document.createElement('li');
  li.textContent = entry;
  historyList.appendChild(li);
}
