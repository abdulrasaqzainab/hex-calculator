export type Operator = "+" | "-" | "*" | "/";

const HEX_CHAR_REGEX = /^[0-9A-F]$/;
const HEX_OPERAND_REGEX = /^[0-9A-F]{1,2}$/;
const SIGNED_HEX_REGEX = /^-?[0-9A-F]{1,2}$/;
const MAX_OUTPUT_VALUE = 0xffff;

export function normalizeHex(input: string): string {
	return input.trim().toUpperCase();
}

export function isValidHexChar(char: string): boolean {
	return HEX_CHAR_REGEX.test(char.toUpperCase());
}

export function isValidHexOperand(value: string): boolean {
	return HEX_OPERAND_REGEX.test(normalizeHex(value));
}

function isValidSignedHexOperand(value: string): boolean {
	return SIGNED_HEX_REGEX.test(normalizeHex(value));
}

function toSignedNumber(value: string): number {
	const normalized = normalizeHex(value);
	if (!isValidSignedHexOperand(normalized)) {
		throw new Error("Invalid hexadecimal operand");
	}

	const isNegative = normalized.startsWith("-");
	const magnitude = isNegative ? normalized.slice(1) : normalized;
	const parsed = parseInt(magnitude, 16);
	return isNegative ? -parsed : parsed;
}

export function toHex(value: number): string {
	if (!Number.isFinite(value)) {
		throw new Error("Invalid number value");
	}

	const nonNegative = Math.max(0, Math.trunc(value));
	const clamped = Math.min(nonNegative, MAX_OUTPUT_VALUE);
	return clamped.toString(16).toUpperCase();
}

export function addHex(left: string, right: string): string {
	const result = toSignedNumber(left) + toSignedNumber(right);
	return toHex(result);
}

export function subtractHex(left: string, right: string): string {
	const result = toSignedNumber(left) - toSignedNumber(right);
	return toHex(result);
}

export function multiplyHex(left: string, right: string): string {
	const result = toSignedNumber(left) * toSignedNumber(right);
	return toHex(result);
}

export function divideHex(left: string, right: string): string {
	const divisor = toSignedNumber(right);
	if (divisor === 0) {
		throw new Error("Division by zero");
	}

	const quotient = Math.trunc(toSignedNumber(left) / divisor);
	return toHex(quotient);
}

export function performHexOperation(left: string, operator: Operator, right: string): string {
	switch (operator) {
		case "+":
			return addHex(left, right);
		case "-":
			return subtractHex(left, right);
		case "*":
			return multiplyHex(left, right);
		case "/":
			return divideHex(left, right);
		default:
			throw new Error("Unsupported operator");
	}
}

export function evaluateHexChain(firstOperand: string, chain: Array<{ operator: Operator; operand: string }>): string {
	return chain.reduce((running, item) => performHexOperation(running, item.operator, item.operand), normalizeHex(firstOperand));
}

export function isValidHexOutput(value: string): boolean {
	return /^[0-9A-F]{1,4}$/.test(normalizeHex(value));
}

export class HexCalculatorEngine {
	private currentOperand = "0";
	private storedOperand: string | null = null;
	private pendingOperator: Operator | null = null;
	private expression = "";
	private history: string[] = [];

	getDisplay(): string {
		return this.currentOperand;
	}

	getExpression(): string {
		return this.expression;
	}

	getHistory(): string[] {
	return this.history;
	}

	pressDigit(digit: string): void {
		const normalized = normalizeHex(digit);
		if (!isValidHexChar(normalized)) {
			throw new Error("Invalid hexadecimal digit");
		}

		if (this.currentOperand === "0") {
			this.currentOperand = normalized;
		} else {
			if (this.currentOperand.length >= 2) {
				throw new Error("Operand length exceeded");
			}
			this.currentOperand += normalized;
		}
	}

	pressOperator(operator: Operator): void {
		if (this.storedOperand === null) {
			this.storedOperand = this.currentOperand;
		} else if (this.pendingOperator !== null) {
			this.storedOperand = performHexOperation(this.storedOperand, this.pendingOperator, this.currentOperand);
		}

		this.pendingOperator = operator;
		this.expression = `${this.storedOperand} ${operator}`;
		this.currentOperand = "0";
	}

	pressEquals(): string {
	if (this.pendingOperator === null || this.storedOperand === null) {
		return this.currentOperand;
	}

	const result = performHexOperation(
		this.storedOperand,
		this.pendingOperator,
		this.currentOperand
	);

	const record = `${this.storedOperand} ${this.pendingOperator} ${this.currentOperand} = ${result}`;

	this.history.unshift(record);

	if (this.history.length > 5) {
		this.history.pop();
	}

	this.expression = record;
	this.currentOperand = result;
	this.storedOperand = null;
	this.pendingOperator = null;

	return result;
	}

	pressClearAll(): void {
		this.currentOperand = "0";
		this.storedOperand = null;
		this.pendingOperator = null;
		this.expression = "";
	}

	pressClearEntry(): void {
		if (this.currentOperand.length <= 1) {
			this.currentOperand = "0";
			return;
		}
//comment
		this.currentOperand = this.currentOperand.slice(0, -1);
	}
}
