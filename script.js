const display = document.getElementById("display");
const history = document.getElementById("history");
const buttons = document.querySelectorAll("button");

let expression = "";

function refresh() {
  display.value = expression || "0";
}

function append(value) {
  if (value === ".") {
    const lastNumber = expression.split(/[+\-*/%]/).pop();
    if (lastNumber.includes(".")) return;
    if (!lastNumber) expression += "0";
  }
  if (/[+\-*/%]/.test(value) && /[+\-*/%]$/.test(expression)) {
    expression = expression.slice(0, -1);
  }
  expression += value;
  refresh();
}

function clearAll() {
  expression = "";
  history.textContent = "";
  refresh();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  refresh();
}

function calculate() {
  if (!expression) return;
  try {
    // Only calculator characters are accepted, so no arbitrary JS is executed.
    if (!/^[0-9+\-*/%.() ]+$/.test(expression)) throw new Error("Invalid");
    const result = Function('"use strict"; return (' + expression + ')')();
    if (!Number.isFinite(result)) throw new Error("Math error");
    history.textContent = expression + " =";
    expression = String(Math.round((result + Number.EPSILON) * 1e12) / 1e12);
    refresh();
  } catch {
    display.value = "Error";
    expression = "";
  }
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;
    const action = button.dataset.action;
    if (value !== undefined) append(value);
    if (action === "clear") clearAll();
    if (action === "delete") deleteLast();
    if (action === "calculate") calculate();
  });
});

document.addEventListener("keydown", event => {
  const key = event.key;
  if (/^[0-9.]$/.test(key)) append(key);
  else if (["+", "-", "*", "/", "%"].includes(key)) append(key);
  else if (key === "Enter" || key === "=") calculate();
  else if (key === "Backspace") deleteLast();
  else if (key === "Escape") clearAll();
});
