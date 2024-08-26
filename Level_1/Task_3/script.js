const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
let currentInput = '';
let expression = '';

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent.trim();

        if (value === 'AC') {
            // Clear all inputs
            currentInput = '';
            expression = '';
            display.textContent = '0';
        } else if (value === '←') {
            // Remove the last character
            expression = expression.slice(0, -1);
            display.textContent = expression || '0';
        } else if (value === '=') {
            // Convert infix expression to postfix and evaluate it
            console.log('Infix expression:', expression);
            const postfix = infixToPostfix(expression);
            console.log('Postfix expression:', postfix);
            const result = evaluatePostfix(postfix);
            console.log('Result:', result);
            display.textContent = result;
            expression = result.toString();
            currentInput = '';
        } else {
            // Handle percentage
            if (value === '%') {
                expression += '%';
            } else if (value === 'X') {
                expression += '*';
            } else if (value === '÷') {
                expression += '/';
            } else {
                expression += value;
            }
            display.textContent = expression;
        }
    });
});

function infixToPostfix(infix) {
    const precedence = { '+': 1, '-': 1, '*': 2, '/': 2,'%': 2 };
    const stack = [];
    let postfix = '';
    let numberBuffer = '';
    let lastChar = '';

    for (let char of infix) {
        if (/\d/.test(char) || char === '.') {
            numberBuffer += char; // Build up multi-digit numbers
        } else {
            if (numberBuffer.length > 0) {
                postfix += numberBuffer + ' ';
                numberBuffer = '';
            }
            if (char === '(') {
                stack.push(char);
            } else if (char === ')') {
                while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                    postfix += stack.pop() + ' ';
                }
                stack.pop(); // Remove '(' from stack
            } else if (['+', '-', '*', '/','%'].includes(char)) {
                // Handle negative numbers
                if (char === '-' && (lastChar === '' || lastChar === '(' || ['+', '-', '*', '/','%'].includes(lastChar))) {
                    numberBuffer += char;
                } else {
                    while (stack.length > 0 && precedence[stack[stack.length - 1]] >= precedence[char]) {
                        postfix += stack.pop() + ' ';
                    }
                    stack.push(char);
                }
            }
        }
        lastChar = char;
    }

    if (numberBuffer.length > 0) {
        postfix += numberBuffer + ' ';
    }

    while (stack.length > 0) {
        postfix += stack.pop() + ' ';
    }

    return postfix.trim();
}

function evaluatePostfix(postfix) {
    const stack = [];
    const tokens = postfix.split(' ');

    for (let token of tokens) {
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
        } else {
            const b = stack.pop();
            const a = stack.pop();
            let result;
            switch (token) {
                case '+':
                    result = a + b;
                    break;
                case '-':
                    result = a - b;
                    break;
                case '*':
                    result = a * b;
                    break;
                case '/':
                    result = a / b;
                    break;
                case '%':
                    result = a % b;
                    break;
            }
            // Round result to avoid floating-point precision issues
            stack.push(Math.round(result * 100000000) / 100000000);
        }
    }
    return stack.pop();
}
