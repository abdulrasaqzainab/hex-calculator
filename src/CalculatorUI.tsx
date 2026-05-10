import React, { useState } from "react";
import { HexCalculatorEngine, Operator } from "./calculator";
import "./calculator.css";

export function Calculator() {
	const [engine] = useState(() => new HexCalculatorEngine());
	const [display, setDisplay] = useState("0");
	const [history, setHistory] = useState<string[]>([]);
	const [showHelp, setShowHelp] = useState(false);

	const updateDisplay = () => {
		setDisplay(engine.getDisplay());
		setHistory(engine.getHistory());
	};

	const handleDigitClick = (digit: string) => {
		try {
			engine.pressDigit(digit);
			updateDisplay();
		} catch (error) {
			console.error(error);
		}
	};

	const handleOperatorClick = (operator: Operator) => {
		try {
			engine.pressOperator(operator);
			updateDisplay();
		} catch (error) {
			console.error(error);
		}
	};

	const handleEquals = () => {
		try {
			engine.pressEquals();
			updateDisplay();
		} catch (error) {
			console.error(error);
		}
	};

	const handleClear = () => {
		engine.pressClearAll();
		updateDisplay();
	};

	const handleClearEntry = () => {
		try {
			engine.pressClearEntry();
			updateDisplay();
		} catch (error) {
			console.error(error);
		}
	};

	
	return (
		<div className="calculator-container">
			<div className={`history-panel`}>
				<div className="history-header">
					<h2>History</h2>
				</div>
				<div className="history-content">
					{history.length === 0 ? (
						<p>No calculations yet.</p>
					) : (
						<ul>
							{history.map((item, index) => (
								<li key={index}>{item}</li>
							))}
						</ul>
					)}
				</div>
				<div className="history-actions">
					<button className="history-button">Clear</button>
					<button className="history-button">Ans</button>
				</div>
			</div>

			<div className="calculator-panel">
				<div className="top-controls">
					<div className="display">{display}</div>
				</div>

				<div className="button-grid">
					<button className="btn btn-alpha" onClick={() => handleDigitClick("A")}>A</button>
					<button className="btn btn-alpha" onClick={() => handleDigitClick("B")}>B</button>
					<button className="btn btn-alpha" onClick={() => handleDigitClick("C")}>C</button>
					<button className="btn btn-alpha" onClick={() => handleDigitClick("D")}>D</button>
					<button className="btn btn-alpha" onClick={() => handleDigitClick("E")}>E</button>
					<button className="btn btn-alpha" onClick={() => handleDigitClick("F")}>F</button>

					<button className="btn" onClick={() => handleDigitClick("1")}>1</button>
					<button className="btn" onClick={() => handleDigitClick("2")}>2</button>
					<button className="btn" onClick={() => handleDigitClick("3")}>3</button>
					<button className="btn" onClick={() => handleDigitClick("4")}>4</button>
					<button className="btn btn-function" onClick={handleClearEntry}>CE</button>
					<button className="btn btn-function" onClick={handleClear}>AC</button>

					<button className="btn" onClick={() => handleDigitClick("5")}>5</button>
					<button className="btn" onClick={() => handleDigitClick("6")}>6</button>
					<button className="btn" onClick={() => handleDigitClick("7")}>7</button>
					<button className="btn" onClick={() => handleDigitClick("8")}>8</button>
					<button className="btn btn-operator" onClick={() => handleOperatorClick("+")}>+</button>
					<button className="btn btn-operator" onClick={() => handleOperatorClick("-")}>−</button>

					<button className="btn" onClick={() => handleDigitClick("9")}>9</button>
					<button className="btn" onClick={() => handleDigitClick("0")}>0</button>
					<button className="btn btn-operator" onClick={() => handleOperatorClick("*")}>×</button>
					<button className="btn btn-operator" onClick={() => handleOperatorClick("/")}> ÷</button>

					<button className="btn btn-equals" onClick={handleEquals}>=</button>
					<button 
						className="help-button"
						onClick={() => setShowHelp(true)}
						title="Help"
					>
						?
					</button>
				</div>
			</div>

			{showHelp && (
				<div className="modal-overlay" onClick={() => setShowHelp(false)}>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<h2>Hexadecimal Calculator Help</h2>
							<button 
								className="modal-close"
								onClick={() => setShowHelp(false)}
							>
								×
							</button>
						</div>
						<div className="modal-content">
							<h3>How to Use</h3>
							<p>This is a hexadecimal (base-16) calculator. It supports digits 0-9 and letters A-F.</p>
							
							<h4>Digits & Letters</h4>
							<p>Use the number buttons (0-9) and alphabet buttons (A-F) to enter hexadecimal values.</p>
							
							<h4>Operations</h4>
							<ul>
								<li><strong>+</strong> — Addition</li>
								<li><strong>−</strong> — Subtraction</li>
								<li><strong>×</strong> — Multiplication</li>
								<li><strong>÷</strong> — Division</li>
							</ul>
							
							<h4>Functions</h4>
							<ul>
								<li><strong>CE</strong> — Clear Entry (delete last digit)</li>
								<li><strong>AC</strong> — All Clear (reset calculator)</li>
								<li><strong>=</strong> — Calculate result</li>
							</ul>
							
							<h4>History</h4>
							<p>Your calculations are saved in the history panel on the left. They remain visible while you use the calculator.</p>
							
							<h4>Example</h4>
							<p>To add 1A (hex) + 2F (hex): Enter 1, A, +, 2, F, then press =</p>
						</div>
						<button 
							className="modal-button"
							onClick={() => setShowHelp(false)}
						>
							Got it!
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
