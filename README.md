# Primitive Root Calculator

## Overview
The **Primitive Root Calculator** is a web-based application designed for the **IT352 - Information Assurance and Security** course at the **National Institute of Technology Karnataka, Surathkal**. This tool allows users to find and verify primitive roots in modular arithmetic.

## Features
- 🧮 **Find Primitive Roots**: Compute all primitive roots for a given positive integer.
- 🔍 **Check a Number**: Verify whether a specific number is a primitive root modulo *n*.
- 🌗 **Dark/Light Mode**: Toggle between dark and light themes for a better user experience.
- 📜 **Calculation History**: View and track recent calculations.
- 📤 **Export Options**:
  - Export primitive roots as a CSV file.
  - Save calculation steps as a text file.

## Technologies Used
- **Frontend**: React (TypeScript)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Core Algorithms**: Implemented using TypeScript for modular arithmetic computations

## Mathematical Background
A primitive root modulo n is an integer a such that for any integer coprime to n, there exists some integer k such that a^k ≡ 1 (mod n).

The calculator makes use of the following key mathematical functions:
- **Euler's Totient Function (φ(n))**: Computes the count of numbers less than *n* that are coprime to *n*.
- **Greatest Common Divisor (GCD)**: Determines whether two numbers are coprime.
- **Modular Exponentiation**: Efficiently computes large modular powers.

## Getting Started
### Prerequisites
- Node.js (LTS version recommended)
- npm or yarn

### Installation & Usage
1. Clone the repository:
   ```bash
   git clone https://github.com/AnkithKumarsh/IT352-Information-Assurance-and-Security.git
   cd IT352-Information-Assurance-and-Security
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
4. Open your browser and visit `http://localhost:5173`.


## Developed By
- **Student**: Ankith Kumar
- **Guided By**: Prof. Jaidhar C.D.
- **Department**: Information Technology
- **Institution**: National Institute of Technology Karnataka, Surathkal

## Contact
For more information, visit the **[GitHub Repository](https://github.com/AnkithKumarsh/IT352-Information-Assurance-and-Security.git)**.

📧 Feel free to reach out for any queries or contributions!

---

This project is developed as part of the **IT352 - Information Assurance and Security** coursework and is intended for educational and research purposes.

