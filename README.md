# vanilla-calculator
This small app is a simple calculator (similar to what you'd find with your Mac's Calculator.app) created with pure vanilla Javascript, HTML, and CSS. No frameworks, libraries, or packages were used. It was created to test my problem solving skills using JavaScript.

![alt text](https://imgur.com/a/Bk5DQL6)

### Demo

You can find the working demo for this project at: https://jorygu.github.io/vanilla-calculator/

### HTML

The HTML used in this project was just a very basic skeleton that I used to mark up the necessary buttons and the display.
I utilized one primary container div and one inner container div for each row of buttons.

### CSS

I utilized the following as a very basic style reset for the project:

```CSS
html, body, button {
  padding: 0;
  margin: 0;
  font-size: 20px;
  font-family: "Libre Franklin", sans-serif;
}
```

Just enough to help prevent unnecessary conflict with my custom margins and padding and to set the general feel of the font size and style I wanted to use.

Because this project was very small scope, I did end up with style blocks like this:

```CSS
.display {
  border: 1px solid black;
  width: 13.2rem;
  height: 3.5rem;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.4rem;
  margin-bottom: 0.1rem;
  font-size: 1.2rem;
  background-color: #2a2f2f;
  color: white;
  box-shadow: -3px 3px 3px rgba(0,0,0,0.5);
  border-radius: 0.1rem;
}
```

On a larger project I would really try to break up my styling to be reusable by making general rules and applying those general classes to the HTML markup. In all, my CSS only ended up being 89 lines, so targeting this specific element really didn't cause any DRY issues.

Stylistically, I ended up using `#EE4C53` as the highlight color for my operator buttons. I find myself returning to this color quite often. It's super attractive to me for these kinds of UX details.

### JavaScript

I decided to go with an ES6 style class to create the primary logic behind the calculator. The syntax just seems more intuitive to me, plus I think it makes the code more readable than using ES5 prototypes and objects, especially for something using as many methods as I'm using for this project.

The core logic relies on these properties:

```JavaScript
    this.equation = [];
    this.currentValue = '0';
    this.operator = null;
    this.equalsPressedLast = false;
```

`this.equation` is an array that I'll use to store all of the values and operators that are pressed by the user. The values stored in this array will be parsed when the user presses the "Equals" button on the calculator.

`this.currentValue` stores the value that should be displayed on the calculator's screen. Additionally, this value is passed into `this.equation` whenever the user pushes the "Equals" button or any operator button.

`this.operator` is used to store the state of the operator. If an operation button has been pressed, a subsequent press of a number key will push that operator to `this.equation`. Additionally, if no operation button has been pressed, subsequent presses of number keys will continue to concatenate those numbers to `this.currentValue`.

`this.equalsPressedLast` stores the state of the equals button. If it was pressed last, the calculator will begin a new equation with subsequent number button presses. If not, the calculator will contain to add to the current equation.

The most fun and challenging aspect of this project was coming up with the logic to allow the calculator to execute the operations keyed by the user and return the result using proper order of operations. I decided that I would store the information keyed by the user in an array, `this.equation`, and then process that information into two stacks - a value stack for the values keyed, and an operator stack for the operations keyed. Here are the methods I used to parse the array and return the result to the calculator's display:

```JavaScript
pressEquals() {
    this.equation.push(parseFloat(this.currentValue));
    this.currentValue = 0;
    const workingEquation = this.equation.slice();

    const valueStack = [];
    const operatorStack = [];
    let val1, val2, op;
    
    for(let i = 0; i < workingEquation.length; i++) {
      if(typeof workingEquation[i] === 'number') {
        valueStack.push(workingEquation[i]);
      } else {
        if(operatorStack.length > 0) {
          if(this._hasPrecedence(workingEquation[i], operatorStack[operatorStack.length - 1])) {
            operatorStack.push(workingEquation[i]);
          } else {
            val2 = valueStack.pop();
            val1 = valueStack.pop();
            op = operatorStack.pop();
            valueStack.push(this._evaluateExpression(op, val2, val1));
            operatorStack.push(workingEquation[i]);

          }
        } else {
          operatorStack.push(workingEquation[i]);
        }
      }
    }

    while(operatorStack.length > 0) {
      val2 = valueStack.pop();
      val1 = valueStack.pop();
      op = operatorStack.pop();
      valueStack.push(this._evaluateExpression(op, val2, val1));
    }

    this.display.innerText = valueStack[0];
    this.equation = [];
    this.currentValue = valueStack[0].toString();
    this.operator = null;
    this.equalsPressedLast = true;
  }

  _evaluateExpression(operator, val2, val1) {
    switch(operator) {
      case '+':
        return val1 + val2;
      case '-':
        return val1 - val2;
      case '*':
        return val1 * val2;
      case '/':
        return val1 / val2;
    }
  }

  _hasPrecedence(newOperator, stackOperator) {
    if(newOperator === '+' || newOperator === '-') {
      return false;
    } else if((newOperator === '*' || newOperator === '/') && (stackOperator === '*' || stackOperator === '/')) {
      return false;
    } else {
      return true;
    }
  }
```

When parsing `this.equation`, I am checking to make sure that the operator at the top of the stack does not have precedence over the operator I'm pushing onto the stack. If it does, I'm popping two values from the value stack and one operator from the operator stack and performing the proper evaluation for those return values. I'm then pushing the result of that operation back to the top of the value stack. Once I'm finished parsing `this.equation` I continue to pop 2 values and 1 operator until there are no more operators left on the operator stack. I then send that value to the calculator's display.

While I obviously had to add click event listeners to all of the calculator's buttons, I also added a bit of functionality by adding a keyDown listener to the document so that users are able to input values and operators via their keyboard. This comes with the bonus function of being able to use your delete key to backspace the current value if you make a typo - a function that is not possible using the buttons displayed in the browser. This mirrors this functionality on MacOS's Calculator.app.

```JavaScript
document.addEventListener('keydown', e => {
  const keyPress = e.key;

  if(keyPress >= '0' && keyPress <= '9') {
    equation.pressNumber(e.key);
  }

  if(keyPress === 'Enter') {
    e.preventDefault();
    equation.pressEquals();
  }

  if(keyPress === '+' || keyPress === '-' || keyPress === '*' || keyPress === '/') {
    equation.pressOperator(keyPress);
  }

  if(keyPress === 'Backspace') {
    e.preventDefault();
    equation.pressBackspace();
  }

  if(keyPress === '.') {
    equation.pressDecimal();
  }
})
```

Overall this was quite a fun, short and sweet problem solving challenge. 10/10, would recommend!
