# Testing Guide - Code Reviewer

## 🧪 How to Test the Application

### Prerequisites
- Both frontend and backend must be running
- Open http://localhost:3000 in your browser

---

## ✅ Test Scenarios

### 1. Python Code Analysis

**Test Case: Valid Python Code**
```python
def calculate_sum(numbers):
    total = 0
    for num in numbers:
        total += num
    return total

result = calculate_sum([1, 2, 3, 4, 5])
print(result)
```

**Expected Results:**
- ✅ Low complexity
- ✅ Good maintainability
- ⚠️ Missing docstring (info)
- ✅ No security issues

---

**Test Case: Python with Issues (use example_code.py)**
```python
# Use the provided example_code.py file
```

**Expected Results:**
- ❌ Unused import (warning)
- ❌ High complexity (warning)
- ❌ eval() usage (security error)
- ❌ Missing docstrings (info)
- 💡 Suggestions for refactoring

---

### 2. JavaScript Code Analysis

**Test Case: Modern JavaScript**
```javascript
const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item, 0);
};

const total = calculateTotal([10, 20, 30]);
console.log(total);
```

**Expected Results:**
- ✅ Low complexity
- ⚠️ console.log usage (info)
- ✅ Good code practices

---

**Test Case: JavaScript with Issues (use example_code.js)**
```javascript
// Use the provided example_code.js file
```

**Expected Results:**
- ❌ var usage (should use let/const)
- ❌ == instead of === (warning)
- ❌ High complexity (nested loops)
- ❌ console.log statements (info)

---

### 3. Java Code Analysis

**Test Case: Simple Java Class**
```java
public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
    
    public static void main(String[] args) {
        Calculator calc = new Calculator();
        System.out.println(calc.add(5, 3));
    }
}
```

**Expected Results:**
- ✅ Basic structure valid
- ⚠️ System.out.println usage (should use logger)
- 💡 Suggestions for improvement

---

## 📝 UI Testing Checklist

### File Upload
- [ ] Drag & drop .py file → Code appears in editor
- [ ] Drag & drop .js file → Language auto-switches to JavaScript
- [ ] Click "Upload File" button → File browser opens
- [ ] Upload .java file → Language auto-switches to Java

### Code Editor
- [ ] Paste code → Syntax highlighting works
- [ ] Type code → Auto-completion works (Monaco)
- [ ] Multiple lines → Line numbers visible
- [ ] Scroll → Editor scrolls smoothly

### Language Selection
- [ ] Select Python → Editor shows Python syntax
- [ ] Select JavaScript → Editor shows JS syntax
- [ ] Select Java → Editor shows Java syntax
- [ ] Switch languages → Syntax highlighting updates

### Analysis Button
- [ ] Click "Analyze Code" → Loading animation appears
- [ ] Wait for analysis → Results display smoothly
- [ ] No code entered → Error message shows
- [ ] Backend offline → Error message shows

### Results Display
- [ ] Metrics cards → Show correct values
- [ ] Issues list → Color-coded by severity
- [ ] Charts → Display properly
- [ ] Suggestions → Listed clearly
- [ ] Animations → Smooth transitions

### Responsive Design
- [ ] Desktop → Full layout
- [ ] Tablet → Responsive layout
- [ ] Mobile → Mobile-friendly layout
- [ ] Resize window → Layout adapts

---

## 🔧 Backend API Testing

### Using Browser (Swagger UI)
1. Open http://localhost:8000/docs
2. Test each endpoint interactively

### Using curl

**Test Analysis Endpoint**
```bash
curl -X POST "http://localhost:8000/api/analyze" \
  -H "Content-Type: application/json" \
  -d "{\"code\":\"print('hello')\",\"language\":\"python\"}"
```

**Expected Response:**
```json
{
  "language": "python",
  "metrics": {
    "lines_of_code": 1,
    "complexity": 1,
    "maintainability": 100.0
  },
  "issues": [],
  "suggestions": [...]
}
```

---

**Test Health Endpoint**
```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{"status": "healthy"}
```

---

**Test Statistics**
```bash
curl http://localhost:8000/api/stats
```

---

## 🐛 Error Handling Tests

### Test Invalid Input
```bash
# Empty code
curl -X POST "http://localhost:8000/api/analyze" \
  -H "Content-Type: application/json" \
  -d "{\"code\":\"\",\"language\":\"python\"}"

# Expected: 400 Bad Request
```

### Test Invalid Language
```bash
curl -X POST "http://localhost:8000/api/analyze" \
  -H "Content-Type: application/json" \
  -d "{\"code\":\"test\",\"language\":\"ruby\"}"

# Expected: 400 Bad Request
```

---

## 📊 Performance Testing

### Small File (< 100 lines)
- **Expected**: Analysis completes in < 2 seconds

### Medium File (100-500 lines)
- **Expected**: Analysis completes in < 5 seconds

### Large File (> 500 lines)
- **Expected**: Analysis completes in < 10 seconds

---

## 🔐 Authentication Testing (Optional)

### Register User
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=testuser&password=password123"
```

**Expected**: Returns JWT token

---

## 💾 Database Testing (If MongoDB is Running)

### Check History
```bash
curl http://localhost:8000/api/history?limit=5
```

**Expected**: Returns list of recent analyses

### Check Stats
```bash
curl http://localhost:8000/api/stats
```

**Expected**: Returns analysis statistics

---

## 🎨 Visual Testing Checklist

### Animations
- [ ] Header logo rotates
- [ ] Cards slide up on load
- [ ] Loading spinner rotates
- [ ] Results fade in smoothly
- [ ] Button hover effects work

### Colors
- [ ] Error issues → Red
- [ ] Warning issues → Yellow
- [ ] Info issues → Blue
- [ ] Primary buttons → Blue
- [ ] Charts → Color-coded

### Layout
- [ ] Header at top
- [ ] Content centered
- [ ] Cards have shadows
- [ ] Spacing consistent
- [ ] Footer at bottom

---

## 🚨 Common Issues & Solutions

### Issue: Backend won't analyze Python code
**Solution**: Ensure Pylint, Radon, Bandit are installed
```bash
pip install pylint radon bandit
```

### Issue: Frontend shows "Failed to analyze"
**Solution**: Check backend is running on port 8000
```bash
curl http://localhost:8000/health
```

### Issue: No results displayed
**Solution**: Check browser console for errors (F12)

### Issue: Analysis takes too long
**Solution**: Reduce code size or check system resources

---

## ✅ Final Checklist

Before considering testing complete:

**Functionality**
- [ ] Can upload Python files
- [ ] Can upload JavaScript files
- [ ] Can upload Java files
- [ ] Can paste code manually
- [ ] Analysis returns results
- [ ] Metrics display correctly
- [ ] Issues are color-coded
- [ ] Suggestions appear
- [ ] Charts render properly

**Performance**
- [ ] Page loads quickly
- [ ] Analysis completes in reasonable time
- [ ] No console errors
- [ ] Animations are smooth

**Usability**
- [ ] UI is intuitive
- [ ] Buttons are clickable
- [ ] Text is readable
- [ ] Mobile works properly
- [ ] Error messages are clear

**Reliability**
- [ ] No crashes
- [ ] Handles empty input
- [ ] Handles large files
- [ ] Recovers from errors

---

## 📋 Test Report Template

```
Test Date: __________
Tester: __________

Frontend Status: ✅ / ❌
Backend Status: ✅ / ❌
Database Status: ✅ / ❌ / N/A

Python Analysis: ✅ / ❌
JavaScript Analysis: ✅ / ❌
Java Analysis: ✅ / ❌

File Upload: ✅ / ❌
Code Editor: ✅ / ❌
Results Display: ✅ / ❌
Charts: ✅ / ❌

Issues Found: __________
Notes: __________
```

---

**Happy Testing! 🧪**
