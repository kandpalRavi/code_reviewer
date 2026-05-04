// Write your code here
// 🚩 Error 1: 'var' used instead of 'const' (no-var)
// 🚩 Error 2: Missing semicolon (semi)
var secret_key = "12345-DEBUG"

const createErrorTracker = (target) => {
  // 🚩 Error 3: 'let' used for a variable that never changes (prefer-const)
  let handler = {
    get(obj, prop) {
      const value = obj[prop];

      // 🚩 Error 4: Loose equality (eqeqeq)
      if (typeof value == 'function') {
        return (...args) => {
          try {
            // 🚩 Error 5: Security Risk - eval() usage (no-eval)
            // This is a terrible way to log, making it a great test case
            eval("console.log('Intercepting call to " + prop + "')");

            return value.apply(obj, args);
          } catch (err) {
            // 🚩 Error 6: Variable shadowing (no-shadow)
            // 'prop' is already defined in the outer scope
            const prop = "Error Context";

            // 🚩 Error 7: Unexpected console (no-console)
            console.error(prop, err);
            throw err;
          }
        };
      }
      return value;
    }
  };
  return new Proxy(target, handler);
};

// 🚩 Error 8: CamelCase violation (camelcase)
class data_service {
  process(input) {
    // 🚩 Error 9: Missing curly braces (curly)
    if (input === undefined)
      return "No data";

    // 🚩 Error 10: Trailing spaces at the end of the line (no-trailing-spaces)
    return input;
  }

  // 🚩 Error 11: Unused parameters (no-unused-vars)
  helper(unusedParam) {
    // 🚩 Error 12: Debugger statement left in code (no-debugger)
    debugger;
    return true;
  }
}

// 🚩 Error 13: Multiple empty lines (no-multiple-empty-lines)


const service = createErrorTracker(new data_service());