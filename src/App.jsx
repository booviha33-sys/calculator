
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [isResult, setIsResult] = useState(false);

  const buttons = [
    ["AC", "DEL", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "−"],
    ["1", "2", "3", "+"],
    ["±", "0", ".", "="],
  ];

  const operators = ["+", "−", "×", "÷"];

  const handleClick = (value) => {
    if (value === "AC") {
      setDisplay("0");
      setExpression("");
      setIsResult(false);
      return;
    }

    if (value === "DEL") {
      setDisplay((prev) =>
        prev.length > 1 ? prev.slice(0, -1) : "0"
      );
      setIsResult(false);
      return;
    }

    if (value === "=") {
      try {
        const safeExpression = display.replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/−/g, "-")
          .replace(/%/g, "/100");

        if (!/^[0-9+\-*/.()\s]+$/.test(safeExpression)) {
          throw new Error("Invalid expression");
        }

        const result = Function(
          '"use strict"; return (' + safeExpression + ")"
        )();

        if (!Number.isFinite(result)) {
          throw new Error("Invalid calculation");
        }

        setExpression(display + " =");
        setDisplay(String(Number(result.toPrecision(12))));
        setIsResult(true);
      } catch {
        setDisplay("Error");
        setIsResult(true);
      }
      return;
    }

    if (value === "±") {
      setDisplay((prev) => {
        if (prev === "0" || prev === "Error") return prev;
        return prev.startsWith("-") ? prev.slice(1) : "-" + prev;
      });
      setIsResult(false);
      return;
    }

    if (operators.includes(value)) {
      setDisplay((prev) => {
        if (prev === "Error") return "0" + value;
        if (operators.includes(prev.slice(-1))) {
          return prev.slice(0, -1) + value;
        }
        return prev + value;
      });
      setIsResult(false);
      return;
    }

    if (isResult) {
      setDisplay(value === "." ? "0." : value);
      setExpression("");
      setIsResult(false);
      return;
    }

    if (value === ".") {
      const currentNumber = display.split(/[+\−×÷]/).pop();
      if (currentNumber.includes(".")) return;

      setDisplay((prev) => prev + ".");
      return;
    }

    setDisplay((prev) =>
      prev === "0" || prev === "Error" ? value : prev + value
    );
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (/^[0-9.]$/.test(e.key)) handleClick(e.key);
      else if (e.key === "+") handleClick("+");
      else if (e.key === "-") handleClick("−");
      else if (e.key === "*") handleClick("×");
      else if (e.key === "/") {
        e.preventDefault();
        handleClick("÷");
      }
      else if (e.key === "Enter" || e.key === "=") handleClick("=");
      else if (e.key === "Backspace") handleClick("DEL");
      else if (e.key === "Escape") handleClick("AC");
      else if (e.key === "%") handleClick("%");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="app-container">
      <div className="calculator">

        <div className="calculator-header">
          <div>
            <h2>Calculator</h2>
            <p>Simple & Smart Calculations</p>
          </div>
          <div className="calculator-icon">✦</div>
        </div>

        <div className="display">
          <div className="expression">{expression}</div>
          <div className="result">{display}</div>
        </div>

        <div className="button-grid">
          {buttons.flat().map((btn) => (
            <button
              key={btn}
              onClick={() => handleClick(btn)}
              className={`
                calc-button
                ${btn === "=" ? "equal" : ""}
                ${operators.includes(btn) ? "operator" : ""}
                ${["AC", "DEL", "%", "±"].includes(btn) ? "special" : ""}
              `}
            >
              {btn}
            </button>
          ))}
        </div>

        <div className="calculator-footer">
          Designed for everyday calculations
        </div>

      </div>
    </div>
  );
}

export default App;
