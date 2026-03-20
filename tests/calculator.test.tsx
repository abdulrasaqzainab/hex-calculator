import {
	HexCalculatorEngine,
	addHex,
	divideHex,
	evaluateHexChain,
	isValidHexChar,
	isValidHexOperand,
	isValidHexOutput,
	multiplyHex,
	performHexOperation,
	subtractHex,
	toHex,
} from "../src/calculator";

describe("Arithmetic Operations", () => {
	describe("FR 1 - Addition", () => {
		it("FR 1.1 adds two hexadecimal operands", () => {
			expect(addHex("A", "5")).toBe("F");
		});

		it("FR 1.2 handles addition with zero", () => {
			expect(addHex("0", "1F")).toBe("1F");
		});

		it("FR 1.3 supports mixed sign values", () => {
			expect(addHex("A", "-5")).toBe("5");
		});
	});

	describe("FR 2 - Subtraction", () => {
		it("FR 2.1 subtracts hexadecimal operands", () => {
			expect(subtractHex("1A", "5")).toBe("15");
		});

		it("FR 2.2 returns 0 for negative result", () => {
			expect(subtractHex("1", "A")).toBe("0");
		});

		it("FR 2.3 keeps result in hexadecimal", () => {
			expect(subtractHex("10", "1")).toBe("F");
		});
	});

	describe("FR 3 - Multiplication", () => {
		it("FR 3.1 multiplies hexadecimal operands", () => {
			expect(multiplyHex("A", "2")).toBe("14");
		});

		it("FR 3.2 handles multiplication by 0", () => {
			expect(multiplyHex("AB", "0")).toBe("0");
		});

		it("FR 3.3 handles multiplication by 1", () => {
			expect(multiplyHex("AB", "1")).toBe("AB");
		});
	});

	describe("FR 4 - Division", () => {
		it("FR 4.1 divides hexadecimal operands", () => {
			expect(divideHex("20", "4")).toBe("8");
		});

		it("FR 4.2 truncates decimal result", () => {
			expect(divideHex("7", "2")).toBe("3");
		});

		it("FR 4.3 prevents division by zero", () => {
			expect(() => divideHex("A", "0")).toThrow("Division by zero");
		});
	});

	describe("FR 5 - Operation Behaviour", () => {
		it("FR 5.1 supports chained operations", () => {
			const result = evaluateHexChain("A", [
				{ operator: "+", operand: "5" },
				{ operator: "*", operand: "2" },
			]);
			expect(result).toBe("1E");
		});

		it("FR 5.2 follows commutative rule for addition and multiplication", () => {
			expect(addHex("A", "5")).toBe(addHex("5", "A"));
			expect(multiplyHex("A", "5")).toBe(multiplyHex("5", "A"));
		});

		it("FR 5.3 follows non-commutative rule for subtraction and division", () => {
			expect(subtractHex("A", "5")).not.toBe(subtractHex("5", "A"));
			expect(divideHex("A", "2")).not.toBe(divideHex("2", "A"));
		});
	});
});

describe("Input Validation", () => {
	it("FR 6.1 accepts only valid hexadecimal characters", () => {
		expect(isValidHexChar("A")).toBe(true);
		expect(isValidHexChar("f")).toBe(true);
	});

	it("FR 6.2 restricts each operand to max two hexadecimal digits", () => {
		expect(isValidHexOperand("AF")).toBe(true);
		expect(isValidHexOperand("AFF")).toBe(false);
	});

	it("FR 6.3 rejects non-hexadecimal characters", () => {
		expect(isValidHexOperand("G1")).toBe(false);
		expect(isValidHexOperand("1$")).toBe(false);
	});
});

describe("Output Validation", () => {
	it("FR 7.1 restricts output to max four hexadecimal digits", () => {
		expect(toHex(0x10000)).toBe("FFFF");
	});

	it("FR 7.2 prevents negative output values", () => {
		expect(toHex(-10)).toBe("0");
	});

	it("FR 7.3 prevents decimal output", () => {
		expect(toHex(26)).toBe("1A");
	});

	it("FR 7.4 guarantees valid hexadecimal output format", () => {
		expect(isValidHexOutput("1A3F")).toBe(true);
		expect(isValidHexOutput("1A3FG")).toBe(false);
	});
});

describe("Button-Based Interface", () => {
	it("FR 8.1 provides buttons for each hexadecimal digit", () => {
		const calc = new HexCalculatorEngine();
		"0123456789ABCDEF".split("").forEach((digit) => {
			calc.pressClearAll();
			calc.pressDigit(digit);
			expect(calc.getDisplay()).toBe(digit);
		});
	});

	it("FR 8.2 supports arithmetic operator buttons", () => {
		const calc = new HexCalculatorEngine();
		calc.pressDigit("A");
		calc.pressOperator("+");
		calc.pressDigit("5");
		expect(calc.pressEquals()).toBe("F");
	});

	it("FR 8.3 supports full button-only operation flow", () => {
		const calc = new HexCalculatorEngine();
		calc.pressDigit("1");
		calc.pressDigit("0");
		calc.pressOperator("-");
		calc.pressDigit("1");
		expect(calc.pressEquals()).toBe("F");
	});

	it("FR 10.1 provides equals operation", () => {
		const calc = new HexCalculatorEngine();
		calc.pressDigit("2");
		calc.pressOperator("*");
		calc.pressDigit("3");
		expect(calc.pressEquals()).toBe("6");
	});

	it("FR 11.1 provides AC to reset calculator state", () => {
		const calc = new HexCalculatorEngine();
		calc.pressDigit("A");
		calc.pressOperator("+");
		calc.pressDigit("1");
		calc.pressClearAll();
		expect(calc.getDisplay()).toBe("0");
		expect(calc.getExpression()).toBe("");
	});

	it("FR 11.2 provides CE to remove most recent entry", () => {
		const calc = new HexCalculatorEngine();
		calc.pressDigit("A");
		calc.pressDigit("F");
		calc.pressClearEntry();
		expect(calc.getDisplay()).toBe("A");
		calc.pressClearEntry();
		expect(calc.getDisplay()).toBe("0");
	});
});

describe("Smoke tests", () => {
	it("routes operations through performHexOperation", () => {
		expect(performHexOperation("F", "+", "1")).toBe("10");
		expect(performHexOperation("F", "-", "1")).toBe("E");
		expect(performHexOperation("F", "*", "2")).toBe("1E");
		expect(performHexOperation("F", "/", "2")).toBe("7");
	});
});
