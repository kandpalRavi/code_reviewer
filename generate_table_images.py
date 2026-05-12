import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import Rectangle
import numpy as np

# Unit Testing Results Table
unit_tests = [
    ["UTC-01", "Python Linter Integration", "Invalid syntax: def hello: print(\"world\")", "Identified missing parentheses", "✓ PASSED"],
    ["UTC-02", "Cyclomatic Complexity", "Function with 2 if + for loop", "CC=4 (as expected)", "✓ PASSED"],
    ["UTC-03", "Security Vulnerability", "result = eval(user_input)", "Bandit flagged high-severity", "✓ PASSED"],
    ["UTC-04", "Java Parser Accuracy", "class User { String name; }", "Missing access modifier warning", "✓ PASSED"],
    ["UTC-05", "JavaScript Rule Enforcement", "var x = 10;", "ESLint: use let/const", "✓ PASSED"],
    ["UTC-06", "Maintainability Index", "Sample code with metrics", "Score: 85.4 (Excellent)", "✓ PASSED"],
    ["UTC-07", "JWT Token Generation", "User payload with ID & role", "Token generated & verified", "✓ PASSED"],
    ["UTC-08", "Database Model Mapping", "Complex analysis results", "All data preserved", "✓ PASSED"],
    ["UTC-09", "Password Hashing", "Password: Password@123", "Hash & verification success", "✓ PASSED"],
    ["UTC-10", "API Response Format", "Mock analysis result", "JSON validated vs schema", "✓ PASSED"],
]

headers = ["Test ID", "Case", "Test Data", "Result", "Status"]

fig, ax = plt.subplots(figsize=(16, 8))
ax.axis('tight')
ax.axis('off')

# Create table
table = ax.table(cellText=unit_tests, colLabels=headers, cellLoc='left', loc='center',
                colWidths=[0.08, 0.18, 0.25, 0.35, 0.12])

table.auto_set_font_size(False)
table.set_fontsize(9)
table.scale(1, 2)

# Style header
for i in range(len(headers)):
    table[(0, i)].set_facecolor('#4472C4')
    table[(0, i)].set_text_props(weight='bold', color='white')

# Style rows
for i in range(1, len(unit_tests) + 1):
    for j in range(len(headers)):
        if i % 2 == 0:
            table[(i, j)].set_facecolor('#E7E6E6')
        else:
            table[(i, j)].set_facecolor('#F2F2F2')
        
        # Make Status column green
        if j == 4:
            table[(i, j)].set_facecolor('#C6EFCE')
            table[(i, j)].set_text_props(weight='bold', color='#006100')

plt.title('Unit Testing Results\n10/10 Passed | Coverage: 88.5% | Time: 2.8s', 
          fontsize=14, fontweight='bold', pad=20)
plt.tight_layout()
plt.savefig('c:/Users/Ravindra Kandpal/Desktop/code_reviewer/unit_testing_results.png', dpi=300, bbox_inches='tight')
print("✓ Unit testing results table saved as PNG")

# System Testing Results Table
system_tests = [
    ["STC-01", "User Registration & Login", "Register → Login → Dashboard", "Auth flow completed", "✓ PASSED"],
    ["STC-02", "Python Analysis Workflow", "Paste code → Analyze", "Results in 1.5s", "✓ PASSED"],
    ["STC-03", "File Upload & Detection", "Drag & drop .js file", "Language auto-detected", "✓ PASSED"],
    ["STC-04", "PDF Export", "Run analysis → Export PDF", "PDF generated & downloaded", "✓ PASSED"],
    ["STC-05", "Manual Language Selection", "Change dropdown to Java", "Highlighting updated", "✓ PASSED"],
    ["STC-06", "Empty Code Validation", "Clear editor → Analyze", "Error message shown", "✓ PASSED"],
    ["STC-07", "Mobile Responsiveness", "Resize to 375px", "Hamburger menu & stacking", "✓ PASSED"],
    ["STC-08", "Backend Error Handling", "Shut down server → Analyze", "Graceful error message", "✓ PASSED"],
    ["STC-09", "History Retrieval", "Navigate to History tab", "Records loaded from DB", "✓ PASSED"],
    ["STC-10", "Real-time Stats Update", "Run new analysis", "Dashboard updated", "✓ PASSED"],
]

fig, ax = plt.subplots(figsize=(16, 8))
ax.axis('tight')
ax.axis('off')

table = ax.table(cellText=system_tests, colLabels=headers, cellLoc='left', loc='center',
                colWidths=[0.08, 0.20, 0.25, 0.30, 0.12])

table.auto_set_font_size(False)
table.set_fontsize(9)
table.scale(1, 2)

# Style header
for i in range(len(headers)):
    table[(0, i)].set_facecolor('#70AD47')
    table[(0, i)].set_text_props(weight='bold', color='white')

# Style rows
for i in range(1, len(system_tests) + 1):
    for j in range(len(headers)):
        if i % 2 == 0:
            table[(i, j)].set_facecolor('#E7E6E6')
        else:
            table[(i, j)].set_facecolor('#F2F2F2')
        
        # Make Status column green
        if j == 4:
            table[(i, j)].set_facecolor('#C6EFCE')
            table[(i, j)].set_text_props(weight='bold', color='#006100')

plt.title('System Testing Results\n10/10 Passed | Avg Response: 450ms | Uptime: 100%', 
          fontsize=14, fontweight='bold', pad=20)
plt.tight_layout()
plt.savefig('c:/Users/Ravindra Kandpal/Desktop/code_reviewer/system_testing_results.png', dpi=300, bbox_inches='tight')
print("✓ System testing results table saved as PNG")

plt.close('all')
print("\n✅ All table images generated successfully!")
