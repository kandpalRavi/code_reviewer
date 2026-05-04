Test Suite: Code Analysis Unit Tests

Test Case 1: Python Linter Integration
• Test ID: UTC-01
• Objective: Verify Pylint service correctly identifies syntax errors in Python snippets
• Test Data: 
    o Invalid code: `def hello: print("world")`
• Expected Result: Pylint returns error details and line numbers
• Actual Result: Correctly identified missing parentheses in function definition at line 1
• Status: PASSED

Test Case 2: Cyclomatic Complexity
• Test ID: UTC-02
• Objective: Test Radon integration to calculate complexity of a function with multiple branches
• Test Data: 
    o Function with 2 `if` statements and a `for` loop
• Expected Result: Returns correct complexity score (e.g., CC=4)
• Actual Result: Complexity correctly calculated as 4
• Status: PASSED

Test Case 3: Security Vulnerability Detection
• Test ID: UTC-03
• Objective: Pass code containing `eval()` to the Bandit service
• Test Data: 
    o Snippet: `result = eval(user_input)`
• Expected Result: Bandit flags a high-severity security issue
• Actual Result: Security issue flagged for insecure function usage: "Use of possibly insecure function - eval"
• Status: PASSED

Test Case 4: Java Parser Accuracy
• Test ID: UTC-04
• Objective: Verify the Java analyzer identifies missing access modifiers in class variables
• Test Data: 
    o Java snippet: `class User { String name; }`
• Expected Result: Report includes warnings for private/protected visibility
• Actual Result: Warning generated: "Field 'name' should have an access modifier"
• Status: PASSED

Test Case 5: JavaScript Rule Enforcement
• Test ID: UTC-05
• Objective: Verify ESLint service detects `var` usage when `no-var` rule is active
• Test Data: 
    o JS snippet: `var x = 10;`
• Expected Result: Returns a warning/error suggesting `let` or `const`
• Actual Result: Warning generated: "Unexpected var, use let or const instead"
• Status: PASSED

Test Case 6: Maintainability Index Calculation
• Test ID: UTC-06
• Objective: Validate the formula used to combine complexity, volume, and effort into a single score
• Test Data: 
    o Sample code with known volume and complexity metrics
• Expected Result: Returns a normalized value between 0 and 100
• Actual Result: Score calculated as 85.4 (Excellent maintainability)
• Status: PASSED

Test Case 7: JWT Token Generation
• Test ID: UTC-07
• Objective: Verify the authentication service generates valid HS256 tokens with correct payloads
• Test Data: 
    o Valid user payload: `{"user_id": "123", "role": "admin"}`
• Expected Result: Token is decodable and contains expected user ID
• Actual Result: Token generated and verified successfully with correct payload
• Status: PASSED

Test Case 8: Database Model Mapping
• Test ID: UTC-08
• Objective: Verify that analysis results are correctly transformed into the MongoDB schema
• Test Data: 
    o Analysis result object with nested metrics and issues
• Expected Result: No data loss during object-relational mapping
• Actual Result: Document saved and retrieved from MongoDB with all fields intact
• Status: PASSED

Test Case 9: Password Hashing
• Test ID: UTC-09
• Objective: Test the password service for secure hashing and verification using Passlib
• Test Data: 
    o Raw password: "Password@123"
• Expected Result: Password verification returns True for matching hash
• Actual Result: Hash generated successfully; verification returned True
• Status: PASSED

Test Case 10: API Response Formatting
• Test ID: UTC-10
• Objective: Ensure the AnalyzeCodeResponse model consistently returns JSON in the specified format
• Test Data: 
    o Mock analysis result object
• Expected Result: Response matches the Swagger/OpenAPI definition
• Actual Result: JSON structure validated against schema successfully
• Status: PASSED

Unit Test Summary:
• Total Test Cases: 10
• Passed: 10
• Failed: 0
• Code Coverage: 88.5%
• Execution Time: 2.8s

System Test Cases

Test Suite: End-to-End Application Flow

Test Case 11: User Registration & Login
• Test ID: STC-01
• Objective: Full end-to-end flow: Create user -> Login -> Receive JWT
• Test Steps:
    1. Register new user
    2. Log in with credentials
    3. Verify access to dashboard
• Expected Result: User successfully logs in and sees their dashboard
• Actual Result: Full auth flow completed; session persists via token
• Status: PASSED

Test Case 12: Python Analysis Flow
• Test ID: STC-02
• Objective: Input Python code in editor and click "Analyze Code"
• Test Steps:
    1. Paste Python code into editor
    2. Click "Analyze Code"
• Expected Result: Results panel displays metrics, issues, and suggestions
• Actual Result: Results rendered in 1.5s with accurate analysis
• Status: PASSED

Test Case 13: File Upload & Auto-Detect
• Test ID: STC-03
• Objective: Verify system detects language from uploaded files
• Test Steps:
    1. Drag and drop `script.js` into upload zone
• Expected Result: Editor populates with code and language switches to JavaScript
• Actual Result: Language auto-switched correctly and highlighting updated
• Status: PASSED

Test Case 14: PDF Report Generation
• Test ID: STC-04
• Objective: Perform an analysis and click the "Export PDF" button
• Test Steps:
    1. Run analysis
    2. Click "Export PDF"
• Expected Result: A PDF file is downloaded containing a summary of the analysis
• Actual Result: PDF generated and downloaded successfully
• Status: PASSED

Test Case 15: Language Selector Sync
• Test ID: STC-05
• Objective: Verify manual language switching updates editor syntax
• Test Steps:
    1. Manually change dropdown selection to "Java"
• Expected Result: Monaco Editor syntax highlighting updates immediately
• Actual Result: Editor highlighting updated to Java syntax immediately
• Status: PASSED

Test Case 16: Empty Code Validation
• Test ID: STC-06
• Objective: Click the "Analyze" button with an empty editor
• Test Steps:
    1. Clear all text from editor
    2. Click "Analyze Code"
• Expected Result: A toast or error message informs the user that code is required
• Actual Result: Error toast displayed: "Please enter some code to analyze"
• Status: PASSED

Test Case 17: Responsive UI Layout
• Test ID: STC-07
• Objective: Resize the browser window from Desktop to Mobile width (375px)
• Test Steps:
    1. Reduce browser window width to 375px
• Expected Result: Hamburger menu appears and cards stack vertically
• Actual Result: Layout reflowed correctly; usable on mobile viewport
• Status: PASSED

Test Case 18: Backend Connection Resilience
• Test ID: STC-08
• Objective: Attempt analysis while the FastAPI server is shut down
• Test Steps:
    1. Stop the backend server process
    2. Click "Analyze Code" in frontend
• Expected Result: UI displays a "Server Unavailable" error message gracefully
• Actual Result: Error message displayed: "Could not connect to the analysis service"
• Status: PASSED

Test Case 19: Historical Analysis Retrieval
• Test ID: STC-09
• Objective: Navigate to the "History" tab and click a previous analysis entry
• Test Steps:
    1. Navigate to History tab
    2. Click on a past analysis record
• Expected Result: The editor and results panel populate with the historical data
• Actual Result: Data retrieved from MongoDB and dashboard updated
• Status: PASSED

Test Case 20: Real-time Stats Update
• Test ID: STC-10
• Objective: Perform a new analysis and check the "Statistics" dashboard
• Test Steps:
    1. Check current analysis count in stats
    2. Run a new code analysis
• Expected Result: "Total Lines Analyzed" count increments by the correct amount
• Actual Result: Global counter updated instantly after analysis completion
• Status: PASSED

System Test Summary:
• Total Test Cases: 10
• Passed: 10
• Failed: 0
• Average Response Time: 450ms
• System Uptime During Tests: 100%
