#!/usr/bin/env python
"""
Comprehensive test for Code Reviewer application
Tests all three languages: Python, JavaScript, Java
"""

import requests
import json
from typing import Dict, Any

API_URL = "http://localhost:8000/api/analyze"

def test_language(language: str, code: str) -> Dict[str, Any]:
    """Test a specific language"""
    print(f"\n{'='*60}")
    print(f"Testing {language.upper()} Analysis")
    print(f"{'='*60}\n")
    
    payload = {
        "code": code,
        "language": language
    }
    
    try:
        response = requests.post(API_URL, json=payload, timeout=30)
        response.raise_for_status()
        
        result = response.json()
        
        # Display results
        print(f"✅ Analysis successful!")
        print(f"\nLanguage: {result.get('language', 'N/A')}")
        print(f"Issues Found: {len(result.get('issues', []))}")
        print(f"Security Vulnerabilities: {len(result.get('security_vulnerabilities', []))}")
        
        # Display metrics
        metrics = result.get('metrics', {})
        print(f"\nMetrics:")
        print(f"  • Lines of Code: {metrics.get('lines_of_code', 0)}")
        print(f"  • Complexity: {metrics.get('complexity', 0)}")
        print(f"  • Maintainability: {metrics.get('maintainability', 0)}")
        
        # Display top issues
        issues = result.get('issues', [])[:5]
        if issues:
            print(f"\nTop Issues (showing first 5):")
            for i, issue in enumerate(issues, 1):
                severity = issue.get('severity', 'UNKNOWN').upper()
                print(f"  {i}. Line {issue.get('line', 0)}: [{severity}] {issue.get('rule', 'Unknown')}")
        
        # Display security vulnerabilities
        vulns = result.get('security_vulnerabilities', [])
        if vulns:
            print(f"\nSecurity Vulnerabilities:")
            for i, vuln in enumerate(vulns, 1):
                severity = vuln.get('severity', 'UNKNOWN').upper()
                print(f"  {i}. [{severity}] {vuln.get('rule', 'Unknown')}")
        
        # Display suggestions
        suggestions = result.get('suggestions', [])
        if suggestions:
            print(f"\nSuggestions (first 3):")
            for i, sugg in enumerate(suggestions[:3], 1):
                print(f"  {i}. {sugg}")
        
        return result
        
    except requests.exceptions.ConnectionError:
        print(f"❌ ERROR: Cannot connect to API at {API_URL}")
        print("Make sure the backend server is running: python main.py")
        return {}
    except requests.exceptions.Timeout:
        print(f"❌ ERROR: Request timeout")
        return {}
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return {}


# Test Codes
PYTHON_CODE = '''
import os
import sys

def unsafe_query(user_id):
    password = "secret123"  # Hardcoded secret!
    query = "SELECT * FROM users WHERE id = " + str(user_id)  # SQL injection risk
    return query

def process_data(data):
    if data == None:  # Should use 'is None'
        print(data)  # System.out equivalent
    return len(data)
'''

JAVASCRIPT_CODE = '''
var secret = "api-key-12345";  // Using var

function getUserData(id) {
  const user = database.getUser(id);
  
  if (typeof user == 'object') {  // Using ==
    console.log(user);  // Debug console in production
    eval("alert(" + user.name + ")");  // eval() - security risk!
    
    debugger;  // Left debugger statement
  }
  
  return user;
}

class data_handler {  // Wrong naming convention
  process() {
    let handler = null;  // Using let when const would be better
    
    try {
      // Process data
    } catch (e) {
      // Empty catch - silent failure
    }
  }
}
'''

JAVA_CODE = '''
public class UserService {
  
  public void createUser(String username) {
    System.out.println("Creating user: " + username);  // Wrong: System.out
    
    String apiKey = "sk-secret-key-123";  // Hardcoded secret!
    
    String query = "SELECT * FROM users WHERE username = '" + username + "'";  // SQL injection!
    
    User user = getUserFromDB(username);
    String email = user.getEmail();  // Potential NPE!
    
    try {
      parseData(username);
    } catch (Exception e) {
      // Empty catch - silent failure
    }
  }
  
  private void parseData(String data) throws Exception {
    if (data == "admin") {  // Wrong: using == for String
      // Handle admin
    }
  }
}
'''

def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("CODE REVIEWER - COMPREHENSIVE TEST")
    print("="*60)
    print("\nTesting all three languages: Python, JavaScript, Java")
    
    results = {
        "python": test_language("python", PYTHON_CODE),
        "javascript": test_language("javascript", JAVASCRIPT_CODE),
        "java": test_language("java", JAVA_CODE)
    }
    
    # Summary
    print(f"\n\n{'='*60}")
    print("TEST SUMMARY")
    print(f"{'='*60}\n")
    
    all_passed = True
    for lang, result in results.items():
        if result:
            issue_count = len(result.get('issues', []))
            metric_calc = 'lines_of_code' in result.get('metrics', {})
            status = "✅ PASS" if issue_count > 0 and metric_calc else "⚠️  PARTIAL"
            if issue_count == 0 or not metric_calc:
                all_passed = False
            print(f"{lang.upper():12} {status}")
            print(f"             Issues: {issue_count}, Metrics: {'✓' if metric_calc else '✗'}")
        else:
            print(f"{lang.upper():12} ❌ FAIL")
            all_passed = False
    
    print(f"\n{'='*60}")
    if all_passed:
        print("✅ ALL TESTS PASSED - Code Reviewer is fully operational!")
    else:
        print("⚠️  SOME TESTS FAILED - Check output above")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
