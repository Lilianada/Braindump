
---
id: "javascript-fundamentals"
title: "JavaScript Fundamentals"
path: "wikis/programming/javascript-fundamentals"
type: "topic"
tags: ["javascript", "programming", "web-development"]
created: "2025-01-20"
lastUpdated: "2025-01-20"
---

# JavaScript Fundamentals

JavaScript is a versatile programming language that powers the modern web. Originally created for browsers, it now runs everywhere.

## Core Concepts

### Variables and Data Types

```javascript
// Primitive types
let name = "Alice";        // string
let age = 25;             // number
let isActive = true;      // boolean
let data = null;          // null
let notDefined;           // undefined

// Objects and arrays
let person = { name: "Bob", age: 30 };
let numbers = [1, 2, 3, 4, 5];
```

### Functions

```javascript
// Function declaration
function greet(name) {
    return `Hello, ${name}!`;
}

// Arrow function
const multiply = (a, b) => a * b;

// Higher-order function
const processArray = (arr, fn) => arr.map(fn);
```

### Asynchronous Programming

```javascript
// Promises
fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log(data));

// Async/await
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
```

## Modern JavaScript Features

- Destructuring assignment
- Template literals
- Modules (import/export)
- Classes
- Optional chaining (?.)
- Nullish coalescing (??)

## Best Practices

1. Use `const` by default, `let` when reassignment is needed
2. Prefer arrow functions for callbacks
3. Use meaningful variable names
4. Handle errors appropriately
5. Keep functions small and focused

JavaScript continues to evolve with new features added regularly through ECMAScript specifications.
