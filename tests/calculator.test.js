"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculator_1 = require("../src/calculator");
describe("Arithmetic Operations", () => {
    describe("FR 1 - Addition", () => {
        it("FR 1.1 adds two hexadecimal operands", () => {
            expect((0, calculator_1.addHex)("A", "5")).toBe("F"); //comment
        });
        it("FR 1.2 handles addition with zero", () => {
            expect((0, calculator_1.addHex)("0", "1F")).toBe("1F");
        });
        it("FR 1.3 supports mixed sign values", () => {
            expect((0, calculator_1.addHex)("A", "-5")).toBe("5");
        });
    });
    describe("FR 2 - Subtraction", () => {
        it("FR 2.1 subtracts hexadecimal operands", () => {
            expect((0, calculator_1.subtractHex)("1A", "5")).toBe("15");
        });
        it("FR 2.2 returns 0 for negative result", () => {
            expect((0, calculator_1.subtractHex)("1", "A")).toBe("0");
        });
        it("FR 2.3 keeps result in hexadecimal", () => {
            expect((0, calculator_1.subtractHex)("10", "1")).toBe("F");
        });
    });
    describe("FR 3 - Multiplication", () => {
        it("FR 3.1 multiplies hexadecimal operands", () => {
            expect((0, calculator_1.multiplyHex)("A", "2")).toBe("14");
        });
        it("FR 3.2 handles multiplication by 0", () => {
            expect((0, calculator_1.multiplyHex)("AB", "0")).toBe("0");
        });
        it("FR 3.3 handles multiplication by 1", () => {
            expect((0, calculator_1.multiplyHex)("AB", "1")).toBe("AB");
        });
    });
    describe("FR 4 - Division", () => {
        it("FR 4.1 divides hexadecimal operands", () => {
            expect((0, calculator_1.divideHex)("20", "4")).toBe("8");
        });
        it("FR 4.2 truncates decimal result", () => {
            expect((0, calculator_1.divideHex)("7", "2")).toBe("3");
        });
        it("FR 4.3 prevents division by zero", () => {
            expect(() => (0, calculator_1.divideHex)("A", "0")).toThrow("Division by zero");
        });
    });
    describe("FR 5 - Operation Behaviour", () => {
        it("FR 5.1 supports chained operations", () => {
            const result = (0, calculator_1.evaluateHexChain)("A", [
                { operator: "+", operand: "5" },
                { operator: "*", operand: "2" },
            ]);
            expect(result).toBe("1E");
        });
        it("FR 5.2 follows commutative rule for addition and multiplication", () => {
            expect((0, calculator_1.addHex)("A", "5")).toBe((0, calculator_1.addHex)("5", "A"));
            expect((0, calculator_1.multiplyHex)("A", "5")).toBe((0, calculator_1.multiplyHex)("5", "A"));
        });
        it("FR 5.3 follows non-commutative rule for subtraction and division", () => {
            expect((0, calculator_1.subtractHex)("A", "5")).not.toBe((0, calculator_1.subtractHex)("5", "A"));
            expect((0, calculator_1.divideHex)("A", "2")).not.toBe((0, calculator_1.divideHex)("2", "A"));
        });
    });
});
describe("Input Validation", () => {
    it("FR 6.1 accepts only valid hexadecimal characters", () => {
        expect((0, calculator_1.isValidHexChar)("A")).toBe(true);
        expect((0, calculator_1.isValidHexChar)("f")).toBe(true);
    });
    it("FR 6.2 restricts each operand to max two hexadecimal digits", () => {
        expect((0, calculator_1.isValidHexOperand)("AF")).toBe(true);
        expect((0, calculator_1.isValidHexOperand)("AFF")).toBe(false);
    });
    it("FR 6.3 rejects non-hexadecimal characters", () => {
        expect((0, calculator_1.isValidHexOperand)("G1")).toBe(false);
        expect((0, calculator_1.isValidHexOperand)("1$")).toBe(false);
    });
});
describe("Output Validation", () => {
    it("FR 7.1 restricts output to max four hexadecimal digits", () => {
        expect((0, calculator_1.toHex)(0x10000)).toBe("FFFF");
    });
    it("FR 7.2 prevents negative output values", () => {
        expect((0, calculator_1.toHex)(-10)).toBe("0");
    });
    it("FR 7.3 prevents decimal output", () => {
        expect((0, calculator_1.toHex)(26)).toBe("1A");
    });
    it("FR 7.4 guarantees valid hexadecimal output format", () => {
        expect((0, calculator_1.isValidHexOutput)("1A3F")).toBe(true);
        expect((0, calculator_1.isValidHexOutput)("1A3FG")).toBe(false);
    });
});
describe("Button-Based Interface", () => {
    it("FR 8.1 provides buttons for each hexadecimal digit", () => {
        const calc = new calculator_1.HexCalculatorEngine();
        "0123456789ABCDEF".split("").forEach((digit) => {
            calc.pressClearAll();
            calc.pressDigit(digit);
            expect(calc.getDisplay()).toBe(digit);
        });
    });
    it("FR 8.2 supports arithmetic operator buttons", () => {
        const calc = new calculator_1.HexCalculatorEngine();
        calc.pressDigit("A");
        calc.pressOperator("+");
        calc.pressDigit("5");
        expect(calc.pressEquals()).toBe("F");
    });
    it("FR 8.3 supports full button-only operation flow", () => {
        const calc = new calculator_1.HexCalculatorEngine();
        calc.pressDigit("1");
        calc.pressDigit("0");
        calc.pressOperator("-");
        calc.pressDigit("1");
        expect(calc.pressEquals()).toBe("F");
    });
    it("FR 10.1 provides equals operation", () => {
        const calc = new calculator_1.HexCalculatorEngine();
        calc.pressDigit("2");
        calc.pressOperator("*");
        calc.pressDigit("3");
        expect(calc.pressEquals()).toBe("6");
    });
    it("FR 11.1 provides AC to reset calculator state", () => {
        const calc = new calculator_1.HexCalculatorEngine();
        calc.pressDigit("A");
        calc.pressOperator("+");
        calc.pressDigit("1");
        calc.pressClearAll();
        expect(calc.getDisplay()).toBe("0");
        expect(calc.getExpression()).toBe("");
    });
    it("FR 11.2 provides CE to remove most recent entry", () => {
        const calc = new calculator_1.HexCalculatorEngine();
        calc.pressDigit("A");
        calc.pressDigit("F");
        calc.pressClearEntry();
        expect(calc.getDisplay()).toBe("A");
        calc.pressClearEntry();
        expect(calc.getDisplay()).toBe("0");
    });
});
describe("Display Behaviour", () => {
    it("FR 9.1 displays current operand as input is entered", () => {
        const calc = new calculator_1.HexCalculatorEngine();
        calc.pressDigit("A");
        expect(calc.getDisplay()).toBe("A");
        calc.pressDigit("F");
        expect(calc.getDisplay()).toBe("AF");
    });
    it("FR 9.2 displays ongoing expression while being built", () => {
        const calc = new calculator_1.HexCalculatorEngine();
        calc.pressDigit("A");
        calc.pressOperator("+");
        expect(calc.getExpression()).toBe("A +");
    });
    it("FR 9.3 updates display immediately after each button press", () => {
        const calc = new calculator_1.HexCalculatorEngine();
        calc.pressDigit("1");
        expect(calc.getDisplay()).toBe("1");
        calc.pressDigit("0");
        expect(calc.getDisplay()).toBe("10");
    });
});
describe("Result Handling", () => {
    it("FR 10.2 displays computed result after equals is pressed", () => {
        const calc = new calculator_1.HexCalculatorEngine();
        calc.pressDigit("A");
        calc.pressOperator("+");
        calc.pressDigit("1");
        const result = calc.pressEquals();
        expect(result).toBe("B");
        expect(calc.getDisplay()).toBe("B");
    });
    it("FR 10.3 allows result to be reused in next calculation", () => {
        const calc = new calculator_1.HexCalculatorEngine();
        calc.pressDigit("A");
        calc.pressOperator("+");
        calc.pressDigit("1");
        calc.pressEquals();
        calc.pressOperator("+");
        calc.pressDigit("1");
        expect(calc.pressEquals()).toBe("C");
    });
});
describe("Calculation History", () => {
    it("FR 12.1 stores only last 5 calculations", () => {
        const calc = new calculator_1.HexCalculatorEngine();
        for (let i = 0; i < 6; i++) {
            calc.pressDigit("1");
            calc.pressOperator("+");
            calc.pressDigit("1");
            calc.pressEquals();
            calc.pressClearAll();
        }
        expect(calc.getHistory().length).toBe(5);
    });
    it("FR 12.2 allows viewing calculation history", () => {
        const calc = new calculator_1.HexCalculatorEngine();
        calc.pressDigit("A");
        calc.pressOperator("+");
        calc.pressDigit("1");
        calc.pressEquals();
        expect(calc.getHistory().length).toBe(1);
    });
    it("FR 12.3 stores full expression with result", () => {
        const calc = new calculator_1.HexCalculatorEngine();
        calc.pressDigit("A");
        calc.pressOperator("+");
        calc.pressDigit("1");
        calc.pressEquals();
        expect(calc.getHistory()[0]).toBe("A + 1 = B");
    });
});
describe("Smoke tests", () => {
    it("routes operations through performHexOperation", () => {
        expect((0, calculator_1.performHexOperation)("F", "+", "1")).toBe("10");
        expect((0, calculator_1.performHexOperation)("F", "-", "1")).toBe("E");
        expect((0, calculator_1.performHexOperation)("F", "*", "2")).toBe("1E");
        expect((0, calculator_1.performHexOperation)("F", "/", "2")).toBe("7");
    });
});
