class Calculator {
  constructor(prevEl, currEl) {
    this.prevElText = prevEl;
    this.currElText = currEl;
    this.clear();
  }

  clear() {
    this.currOperand = "";
    this.prevOperand = "";
    this.operation = undefined;
  }

  delete() {
    this.currOperand = this.currOperand.toString().slice(0, -1);
  }

  appendNum(number) {
    if (number === "." && this.currOperand.includes(".")) return;
    this.currOperand = this.currOperand.toString() + number.toString();
    if (this.currOperand.startsWith("0") && this.currOperand[1] != ".")
      this.currOperand = this.currOperand.replace(/^0/, "");
    if (this.currOperand.startsWith("0")) {
      while (this.currOperand.startsWith("00")) {
        this.currOperand = this.currOperand[1].replace(/^0/, "");
      }
    }
    if (!this.currOperand.length) this.currOperand = "0";
    if (this.currOperand === ".") this.currOperand = "0.";
  }

  chooseOperation(operation) {
    if (this.currOperand === "") return;
    if (this.prevOperand !== "") {
      this.compute();
    }

    this.operation = operation;

    this.prevOperand = this.currOperand;
    this.currOperand = "";
    if (this.currOperand === "" && this.prevOperand === "") {
      this.clear();
    }
  }

  compute() {
    let computation;

    const prev = parseFloat(this.prevOperand);

    const current = parseFloat(this.currOperand);

    if (isNaN(prev) || isNaN(current)) {
      return;
    }

    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "÷":
        if (current === 0) {
          calcShake.classList.add("shake");
          popup.classList.add("show");

          setTimeout(() => {
            calcShake.classList.remove("shake");
          }, 300);

          setTimeout(() => {
            popup.classList.remove("show");
          }, 1500);
          break;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    this.currOperand = parseFloat(computation.toFixed(8));
    this.operation = undefined;
    this.prevOperand = "";
  }

  getDisplayNum(number) {
    const strNum = number.toString();
    const integerDigits = parseFloat(strNum.split(".")[0]);
    let decimalDigits = strNum.split(".")[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0,
      });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currElText.innerText = this.getDisplayNum(this.currOperand);
    if (this.operation != null) {
      this.prevElText.innerText = `${this.prevOperand} ${this.operation}`;
    } else {
      this.prevElText.innerText = "";
    }
  }
}

const numBtns = document.querySelectorAll("[data-number]");
const operationBtns = document.querySelectorAll("[data-action]");
const equalsBtn = document.querySelector("[data-equals]");
const deleteBtn = document.querySelector("[data-delete]");
const clearBtn = document.querySelector("[data-clear]");
const prevOperand = document.querySelector("[data-prev-operand]");
const currOperand = document.querySelector("[data-curr-operand]");
const calcShake = document.querySelector(".calc");
const popup = document.querySelector(".popup");

const calc = new Calculator(prevOperand, currOperand);

numBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    calc.appendNum(btn.innerText);
    calc.updateDisplay();
  });
});

operationBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    calc.chooseOperation(btn.innerText);
    calc.updateDisplay();
  });
});

equalsBtn.addEventListener("click", (btn) => {
  calc.compute();
  calc.updateDisplay();
});

clearBtn.addEventListener("click", (btn) => {
  calc.clear();
  calc.updateDisplay();
});

deleteBtn.addEventListener("click", () => {
  calc.delete();
  calc.updateDisplay();
});
