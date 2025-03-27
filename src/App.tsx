import React, { useState, useEffect } from 'react';
import { Calculator, Moon, Sun, History, X, Download } from 'lucide-react';

interface CalculationRecord {
  type: 'find' | 'check';
  input: string;
  result: string;
  timestamp: Date;
}

function App() {
  const [activeTab, setActiveTab] = useState('find');
  const [number, setNumber] = useState('');
  const [baseValue, setBaseValue] = useState('');
  const [moduloValue, setModuloValue] = useState('');
  const [primitiveRoots, setPrimitiveRoots] = useState<number[]>([]);
  const [calculationSteps, setCalculationSteps] = useState<string[]>([]);
  const [showSteps, setShowSteps] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState<CalculationRecord[]>([]);
 // Array of prime numbers to use as examples
 const primeExamples = [7, 11, 17, 23, 29, 37, 41, 47, 53, 59];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    const savedHistory = localStorage.getItem('calculationHistory');
    if (savedHistory) {
      setCalculationHistory(JSON.parse(savedHistory));
    }
  }, []);

  const setExamplePrime = () => {
    // Randomly select a prime number from the examples
    const randomPrime = primeExamples[Math.floor(Math.random() * primeExamples.length)];
    setNumber(randomPrime.toString());
    findPrimitiveRoots(randomPrime);
  };

  useEffect(() => {
    localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
  }, [calculationHistory]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  const addToHistory = (type: 'find' | 'check', input: string, result: string) => {
    const newRecord: CalculationRecord = {
      type,
      input,
      result,
      timestamp: new Date(),
    };
    setCalculationHistory(prev => [newRecord, ...prev].slice(0, 10));
  };

  const clearHistory = () => {
    setCalculationHistory([]);
    localStorage.removeItem('calculationHistory');
  };

  const exportCSV = () => {
    if (!primitiveRoots.length) return;
    
    const csvContent = `data:text/csv;charset=utf-8,Number,Primitive Roots\n${number},${primitiveRoots.join(',')}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `primitive_roots_${number}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportSteps = () => {
    if (!calculationSteps.length) return;
    
    const content = calculationSteps.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `calculation_steps_${new Date().getTime()}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Function to calculate GCD
  const gcd = (a: number, b: number): number => {
    if (b === 0) return a;
    return gcd(b, a % b);
  };

  // Function to calculate Euler's totient function
  const phi = (n: number): number => {
    let result = n;
    for (let i = 2; i * i <= n; i++) {
      if (n % i === 0) {
        while (n % i === 0) n /= i;
        result -= result / i;
      }
    }
    if (n > 1) result -= result / n;
    return result;
  };

  // Function to calculate modular exponentiation
  const modPow = (base: number, exp: number, mod: number): number => {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp & 1) result = (result * base) % mod;
      base = (base * base) % mod;
      exp >>= 1;
    }
    return result;
  };

  // Function to find primitive roots
  const findPrimitiveRoots = (n: number) => {
    if (!n || n <= 0) {
      alert('Please enter a valid positive integer');
      return;
    }

    const steps: string[] = [];
    const roots: number[] = [];
    const totient = phi(n);
    
    steps.push(`Step 1: Calculate φ(${n}) = ${totient}`);
    
    for (let a = 2; a < n; a++) {
      if (gcd(a, n) === 1) {
        let isPrimitive = true;
        for (let d = 1; d < totient; d++) {
          if (totient % d === 0) {
            if (modPow(a, d, n) === 1) {
              isPrimitive = false;
              break;
            }
          }
        }
        if (isPrimitive) {
          roots.push(a);
        }
      }
    }
    
    steps.push(`Step 2: Found ${roots.length} primitive roots`);
    setCalculationSteps(steps);
    setPrimitiveRoots(roots);
    addToHistory('find', n.toString(), `Found ${roots.length} primitive roots: ${roots.join(', ')}`);
  };

  // Function to check if a number is a primitive root
  const checkPrimitiveRoot = (base: number, modulo: number) => {
    if (!base || !modulo || base <= 0 || modulo <= 0) {
      alert('Please enter valid positive integers for both values');
      return;
    }

    const steps: string[] = [];
    const totient = phi(modulo);
    
    steps.push(`Step 1: Check if gcd(${base}, ${modulo}) = 1`);
    steps.push(`gcd(${base}, ${modulo}) = ${gcd(base, modulo)}`);
    
    steps.push(`Step 2: Calculate φ(${modulo}) (Euler's totient function)`);
    steps.push(`φ(${modulo}) = ${totient}`);
    
    let isPrimitive = true;
    for (let d = 1; d < totient; d++) {
      if (totient % d === 0) {
        if (modPow(base, d, modulo) === 1) {
          isPrimitive = false;
          break;
        }
      }
    }
    
    const result = `${base} ${isPrimitive ? 'is' : 'is not'} a primitive root modulo ${modulo}`;
    steps.push(`Step 3: Final result: ${result}`);
    setCalculationSteps(steps);
    addToHistory('check', `${base} mod ${modulo}`, result);
    return isPrimitive;
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-gradient-to-r from-gray-900 to-blue-900' : 'bg-gradient-to-r from-purple-800 to-blue-600'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end gap-4 mb-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors duration-200"
            title="View History"
          >
            <History size={20} />
          </button>
        </div>

        <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
  DEPARTMENT OF INFORMATION AND TECHNOLOGY
</h1>
<h6 className="text-2xl md:text-3xl font-semibold text-white mt-4 leading-tight">
  NATIONAL INSTITUTE OF TECHNOLOGY KARNATAKA, SURATHKAL - 575025
</h6>

          <h2 className="text-xl md:text-2xl text-white/90 mb-8">
            IT352 - Information Assurance and Security
          </h2>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 inline-block transform hover:scale-[1.02] transition-transform duration-200">
            <div className="flex items-center justify-center gap-3 text-white">
              <Calculator size={28} className="text-purple-300" />
              <h3 className="text-2xl md:text-3xl font-semibold">Primitive Root Calculator</h3>
            </div>
            <p className="text-white/80 mt-2 text-lg">
              Calculate all primitive roots modulo n for a given positive integer.
            </p>
          </div>
        </header>

        <div className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-3xl mx-auto backdrop-blur-lg ${
          isDarkMode ? 'text-white' : ''
        }`}>
          {showHistory && (
            <div className="absolute inset-0 bg-white dark:bg-gray-800 z-10 rounded-lg p-6 overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold dark:text-white">Calculation History</h3>
                <div className="flex gap-2">
                  <button
                    onClick={clearHistory}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 transition-colors duration-200"
                  >
                    Clear History
                  </button>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-gray-600 hover:text-gray-700 dark:text-gray-400 transition-colors duration-200"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              {calculationHistory.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400">No calculations yet</p>
              ) : (
                <div className="space-y-4">
                  {calculationHistory.map((record, index) => (
                    <div
                      key={index}
                      className="border-b dark:border-gray-700 pb-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-lg transition-colors duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {record.type === 'find' ? 'Find Primitive Roots' : 'Check Single Value'}
                          </span>
                          <p className="font-medium dark:text-white">{record.input}</p>
                          <p className="text-gray-600 dark:text-gray-300">{record.result}</p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(record.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('find')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors duration-200 ${
                activeTab === 'find'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Find All Primitive Roots
            </button>
            <button
              onClick={() => setActiveTab('check')}
              className={`flex-1 py-2 px-4 rounded-md transition-colors duration-200 ${
                activeTab === 'check'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              Check Single Value
            </button>
          </div>

          {activeTab === 'find' ? (
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Enter a positive integer:
                </label>
                <input
                  type="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow duration-200"
                  placeholder="Enter number Eg:7"
                  min="1"
                />
              </div>
              <div className="flex gap-4">
        <button
          onClick={() => findPrimitiveRoots(parseInt(number))}
          className="flex-1 bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Calculate
        </button>
        <button
          onClick={setExamplePrime}
          className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Examples
        </button>
      </div>

              {primitiveRoots.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold dark:text-white">Primitive Roots of {number}:</h4>
                    <button
                      onClick={exportCSV}
                      className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 transition-colors duration-200"
                    >
                      <Download size={16} />
                      Export CSV
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {primitiveRoots.map((root) => (
                      <span
                        key={root}
                        className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        {root}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Enter base value (a):
                </label>
                <input
                  type="number"
                  value={baseValue}
                  onChange={(e) => setBaseValue(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow duration-200"
                  placeholder="Enter base value"
                  min="1"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Enter modulo value (n):
                </label>
                <input
                  type="number"
                  value={moduloValue}
                  onChange={(e) => setModuloValue(e.target.value)}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow duration-200"
                  placeholder="Enter modulo value"
                  min="1"
                />
              </div>
              <button
                onClick={() => checkPrimitiveRoot(parseInt(baseValue), parseInt(moduloValue))}
                className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Check if a is primitive root mod n
              </button>
            </div>
          )}

          {calculationSteps.length > 0 && (
            <div className="mt-6 border-t dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold dark:text-white">Calculation Steps:</h4>
                <button
                  onClick={exportSteps}
                  className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 transition-colors duration-200"
                >
                  <Download size={16} />
                  Export Steps
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 space-y-2">
                {calculationSteps.map((step, index) => (
                  <p key={index} className="dark:text-gray-300">
                    {step}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 border-t dark:border-gray-700 pt-4">
            <button
              onClick={() => setShowSteps(!showSteps)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 transition-colors duration-200"
            >
              {showSteps ? 'Hide Information' : 'Show Information'}
            </button>
            {showSteps && (
              <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-md p-4">
                <h4 className="font-semibold mb-2 dark:text-white">Primitive Roots</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  In modular arithmetic, a primitive root modulo n is an integer a such that for any integer a coprime to
                  n, there exists some integer k such that a^k ≡ a (mod n).
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  In other words, g is a generator of the multiplicative group of integers modulo n.
                </p>
              </div>
            )}

<footer className="mt-12 text-center text-black/80">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h4 className="font-semibold text-lg">Developed By</h4>
                <p className="text-black/70">Ankith Kumar</p>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Guided By</h4>
                <p className="text-black/70">Prof. Jaidhar C.D.</p>
              </div>
              <div className="mt-4 md:mt-0">
                <a 
                  href="https://github.com/AnkithKumarsh/IT352-Information-Assurance-and-Security.git" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-black/70 hover:text-black transition-colors underline"
                >
                  GitHub Profile
                </a>
              </div>
            </div>
          </div>
        </footer>
            
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default App;