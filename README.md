# Hexadecimal Calculator – TDD Workshop Project

## Project Description

This project forms part of the workshop assignment and focuses on the development of a **Hexadecimal Calculator** using the **Test-Driven Development (TDD)** approach.

## Docker

Build a production image (static build served by Nginx):

```bash
docker build -t hex-calculator .
```

Run it locally:

```bash
docker run --rm -p 8080:80 hex-calculator
```

Then open http://localhost:8080

## Video Folders

- [Section 1 - Identifying functional requirements and setting up the repository](https://github.com/abdulrasaqzainab/hex-calculator/tree/section-4/videos/section_1)
- [Section 2 - Writing tests, drafting code](https://github.com/abdulrasaqzainab/hex-calculator/tree/section-4/videos/section_2)
- [Section 3 - Testing GUI](https://github.com/abdulrasaqzainab/hex-calculator/tree/section-4/videos/section_3)
- [Section 4 -  Porting into containers and cloud service](https://github.com/abdulrasaqzainab/hex-calculator/tree/section-4/videos/section_4)

## Deployment Guide
- [Elastic Beanstalk Guide](https://github.com/abdulrasaqzainab/hex-calculator/tree/section-4/Guide_%20Deploy%20to%20AWS%20Elastic%20Beanstalk.pdf)

# Functional Requirements

| **Category** | **Functional Requirements** |
|---|---|
| **Arithmetic Operations** | **FR 1: Addition (FR 1.1–FR 1.3)** – Perform hexadecimal addition including handling zero and mixed sign values.<br><br> **FR 2: Subtraction (FR 2.1–FR 2.3)** – Perform subtraction and return 0 when the result would be negative.<br><br> **FR 3: Multiplication (FR 3.1–FR 3.3)** – Perform multiplication including handling multiplication by 0 and 1.<br><br> **FR 4: Division (FR 4.1–FR 4.3)** – Perform division, truncate decimal results, and prevent division by zero.<br><br> **FR 5: Operation Behaviour (FR 5.1–FR 5.3)** – Support chained operations and correctly handle commutative and non-commutative arithmetic rules. |
| **Input Validation** | **FR 6.1:** Accept only valid hexadecimal characters (0–9, A–F).<br><br> **FR 6.2:** Restrict each operand to a maximum of two hexadecimal digits.<br><br> **FR 6.3:** Reject any non-hexadecimal characters. |
| **Output Validation** | **FR 7.1:** Restrict output to a maximum of four hexadecimal digits.<br><br> **FR 7.2:** Prevent negative output values.<br><br> **FR 7.3:** Prevent decimal values from being returned.<br><br> **FR 7.4:** Ensure all outputs are valid hexadecimal values. |
| **Button-Based Interface** | **FR 8.1:** Provide buttons for each hexadecimal digit (0–9, A–F).<br><br> **FR 8.2:** Provide buttons for arithmetic operators (+, −, ×, ÷).<br><br> **FR 8.3:** Ensure the calculator is fully operable using buttons without keyboard input.<br><br> **FR 10.1:** Provide an equals button that evaluates the current expression.<br><br> **FR 11.1:** Provide a clear-all button (AC) that resets the entire calculator state.<br><br> **FR 11.2:** Provide a clear-entry button (CE) that removes only the most recently entered digit or operand. |
| **Display** | **FR 9.1:** Display the current operand or result as input is entered.<br><br> **FR 9.2:** Display the ongoing expression while it is being constructed.<br><br> **FR 9.3:** Update the display immediately after each button press.<br><br> **FR 10.2:** Display the computed result after evaluation. |
| **Clear / Deletion Operations** | **FR 11.1:** Provide a clear-all button (AC) that resets the entire calculator state.<br><br> **FR 11.2:** Provide a clear-entry button (CE) that removes only the most recently entered digit or operand. |
| **Calculation History** | **FR 12.1:** Store the last five completed calculations.<br><br> **FR 12.2:** Allow the user to view stored calculation history.<br><br> **FR 12.3:** Store each history entry as the full expression and result (e.g., A3 + 1B = BE). |
| **Result Handling** | **FR 10.1:** Provide an equals button that evaluates the current expression.<br><br> **FR 10.2:** Display the computed result after evaluation.<br><br> **FR 10.3:** Allow the computed result to be reused as the first operand in the next calculation. |
