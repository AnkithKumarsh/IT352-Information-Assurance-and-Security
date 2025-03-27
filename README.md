# Primitive Root Calculator

## Project Overview

This is a web application developed for the IT352 - Information Assurance and Security course at the National Institute of Technology Karnataka, Surathkal. The Primitive Root Calculator is a React-based tool that helps users find and check primitive roots in modular arithmetic.

## Features

- **Find Primitive Roots**: Calculate all primitive roots for a given positive integer
- **Check Single Value**: Verify if a specific number is a primitive root modulo n
- **Dark/Light Mode**: Toggle between dark and light themes
- **Calculation History**: Track and view recent calculations
- **Export Options**: 
  - Export primitive roots to CSV
  - Export calculation steps to a text file

## Technical Details

### Technologies Used
- React
- TypeScript
- Tailwind CSS
- Lucide React Icons

### Mathematical Concepts
The calculator implements key mathematical functions:
- Euler's Totient Function (φ)
- Greatest Common Divisor (GCD)
- Modular Exponentiation

## Mathematical Background

A primitive root modulo n is an integer a such that for any integer coprime to n, there exists some integer k such that a^k ≡ 1 (mod n).

## Getting Started

### Prerequisites
- Node.js
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Run the application
   ```bash
   npm start
   ```

## Project Structure
- `src/App.tsx`: Main application component
- Implements core mathematical functions
- Manages application state
- Provides user interface for primitive root calculations

## Developed By
- **Student**: Ankith Kumar
- **Guided By**: Prof. Jaidhar C.D.
- **Department**: Information and Technology
- **Institution**: National Institute of Technology Karnataka, Surathkal


## Contact
For more information, visit the [GitHub Repository](https://github.com/AnkithKumarsh/IT352-Information-Assurance-and-Security.git)
