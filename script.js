class Equation {
  constructor() {
    this.equation = [];
    this.currentValue = '0';
    this.operator = null;
    this.equalsPressedLast = false;
    this.display = document.querySelector('.display');
  }

  pressNumber(number) {
    if(this.equalsPressedLast) {
      this.pressClear();
    }

    if(this.operator !== null) {
      this.equation.push(this.operator);
      this.operator = null;
    }

    if(this.currentValue == '0') {
      this.currentValue = number;
      this.display.innerText = this.currentValue;
    } else {
      this.currentValue = this.currentValue.concat(number);
      this.display.innerText = this.currentValue;
    }
    this.equalsPressedLast = false;
  }

  pressDecimal() {
    if(this.equalsPressedLast) {
      this.pressClear();
    }

    if(this.currentValue.includes('.')) {
      return null;
    } else {
      this.currentValue = this.currentValue.concat('.');
      this.display.innerText = this.currentValue;
    }
    this.equalsPressedLast = false;
  }

  pressOperator(operator) {
    if(this.operator !== null) {
      this.operator = operator;
    } else {
      this.operator = operator;
      this.equation.push(parseFloat(this.currentValue));
      this.currentValue = 0;
    }
    this.equalsPressedLast = false;
  }

  pressClear() {
    this.equation = [];
    this.currentValue = '0';
    this.operator = null;
    this.display.innerText = '0';
    this.equalsPressedLast = false;
  }

  pressFlipSign() {
    const oppositeSign = parseFloat(this.currentValue) * -1;
    this.currentValue = oppositeSign.toString();
    this.display.innerText = this.currentValue;
    this.equalsPressedLast = false;
  }

  pressPercent() {
    const percentage = parseFloat(this.currentValue) / 100;
    this.currentValue = percentage.toString();
    this.display.innerText = this.currentValue;
    this.equalsPressedLast = false;
  }

  pressBackspace() {
    if(this.currentValue.length > 1) {
      this.currentValue = this.currentValue.slice(0, this.currentValue.length - 1);
      this.display.innerText = this.currentValue;
    } else {
      this.currentValue = '0';
      this.display.innerText = this.currentValue;
    }
  }

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
}

const equation = new Equation();

document.getElementById('container').addEventListener('click', e => {
  if(e.target.className.includes('number')) {
    equation.pressNumber(e.target.innerText);
  }

  if(e.target.id === 'decimal') {
    equation.pressDecimal();
  }

  if(e.target.className.includes('operator')) {
    equation.pressOperator(e.target.innerText);
  }

  if(e.target.id === 'equals') {
    equation.pressEquals();
  }

  if(e.target.id === 'clear') {
    equation.pressClear();
  }

  if(e.target.id === 'flip-sign') {
    equation.pressFlipSign();
  }

  if(e.target.id === 'percent') {
    equation.pressPercent();
  }
});

document.addEventListener('keydown', e => {
  const keyPress = e.key;

  console.log(keyPress);

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