"use strict";

class CalcStorage {
  constructor(firstNumber, secondNumber, operator, result) {
    this.firstNumber = firstNumber;
    this.secondNumber = secondNumber;
    this.operator = operator;
    this.result = result;
  }
}

const displayNumber = document.querySelector(".display-number");
const displayOperator = document.querySelector(".display-operator");
const btnContainer = document.querySelector(".calc-btn");
const btnSwitch = document.querySelector(".btn--change-value");
const btnClear = document.querySelector(".btn--clear");
const btnEquall = document.querySelector(".btn--equal");
const tableBody = document.querySelector(".table-body");
const clearHistory = document.querySelector(".history-clear");

class Calculator {
  #currentNum = [0, 0];
  #activeNum = 0;
  #firstNum = true;
  #strNumber = "";
  #opsType = "";
  #result = false;
  #historyArr = [];

  constructor() {
    this._addNumber();
    this._operation();
    this._result();
    this._switch();
    this._clear();
    this._loadHistoryData();
    this._clearHistory();
  }

  _displayNumber(value = this.#currentNum[this.#activeNum]) {
    displayNumber.textContent = value;
  }

  _displayOperator() {
    displayOperator.textContent = this.#opsType;
  }

  _currentNum() {
    this.#activeNum = this.#activeNum === 0 ? 1 : 0;
  }

  _addNumber() {
    // prettier-ignore
    btnContainer.addEventListener("click", function (e) {
        if (!e.target.classList.contains('btn--num')) return

        // Merge the number
        this.#strNumber += e.target.textContent;

        // Check if the first number
        if (this.#firstNum) {
          // Input the active number
          this.#currentNum[this.#activeNum] = +this.#strNumber;
          this._displayNumber();
          return
        }

        // If not the first number
        // Check the operator
        if (this.#opsType === '') return alert('Input operator first');

        // Merge the number
        this.#currentNum[this.#activeNum] = +this.#strNumber;
        this._displayNumber()
    }.bind(this));
  }

  _operation() {
    // prettier-ignore
    btnContainer.addEventListener("click", function(e) {
        if (!e.target.classList.contains('btn--operation')) return

        // Check the operator
        if (this.#opsType) return alert('Operation type already define')

        // Reset the string number
        this.#strNumber = '';

        // Switch the active number
        this._currentNum();

        // Input operator type
        this.#opsType = e.target.textContent;
        this._displayOperator()

        // Change the first number state
        this.#firstNum = false;
   }.bind(this))
  }

  _result() {
    // prettier-ignore
    btnEquall.addEventListener('click', function() {
      // Declare history variable
      let history;

      // Switch the active number
      this._currentNum();

      // Perform the operation
      if (this.#opsType === "+") {
        const result = this.#currentNum[0] + this.#currentNum[1];
        history = new CalcStorage(this.#currentNum[0], this.#currentNum[1], this.#opsType, result); // prettier-ignore

        this.#currentNum[this.#activeNum] = this.#currentNum[0] + this.#currentNum[1];
      }
      if (this.#opsType === "-") {
        const result = this.#currentNum[0] - this.#currentNum[1];
        history = new CalcStorage(this.#currentNum[0], this.#currentNum[1], this.#opsType, result); // prettier-ignore

        this.#currentNum[this.#activeNum] = this.#currentNum[0] - this.#currentNum[1];
      }

      // Display the number + reset the operator
      this._displayNumber();
      this.#opsType = '';
      this._displayOperator();

      // Add history data to array
      this.#historyArr.push(history)

      // Add history data to local storage
      this._addHistoryData()

      // Render history
      this._renderHistoryData(history)
    }.bind(this))
  }

  _renderHistoryData(history) {
    const html = `
            <tr class="table-body--row">
              <td>${history.firstNumber}</td>
              <td>${history.operator}</td>
              <td>${history.secondNumber}</td>
              <td>${history.result}</td>
            </tr>
    `;

    tableBody.insertAdjacentHTML("afterbegin", html);
  }

  _addHistoryData() {
    localStorage.setItem("calc-calculation-history", JSON.stringify(this.#historyArr)); // prettier-ignore
  }

  _loadHistoryData() {
    const history = JSON.parse(
      localStorage.getItem("calc-calculation-history")
    );

    if (history === null) return;
    this.#historyArr = history;

    this.#historyArr.forEach((h) => this._renderHistoryData(h));
  }

  _clearHistory() {
    clearHistory.addEventListener("click", function () {
      localStorage.removeItem("calc-calculation-history");
      tableBody.innerHTML = "";
    });
  }

  _clear() {
    // prettier-ignore
    btnClear.addEventListener('click', function() {
        this.#currentNum = [0, 0];
        this.#activeNum = 0;    
        this.#firstNum = true;
        this.#strNumber = "";
        this.#opsType = null;
        this.#result = false;
        this._displayNumber('')
    }.bind(this))
  }

  _switch() {
    // prettier-ignore
    btnSwitch.addEventListener("click", function () {
        if (this.#currentNum[this.#activeNum] === 0) return
          this.#currentNum[this.#activeNum] *= -1;
        this._displayNumber();
      }.bind(this)
    );
  }
}

const calc = new Calculator();
