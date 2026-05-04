// 🚩 Error: Missing Javadoc for public class
public class UserManagementService {
  
  // 🚩 Error: System.out instead of logging
  public void createUser(String username, String password) {
    System.out.println("Creating user: " + username);
    
    // 🚩 Error: Hardcoded secret
    String apiKey = "sk-1234567890abcdef";
    
    // 🚩 Error: SQL injection - concatenation instead of PreparedStatement
    String query = "SELECT * FROM users WHERE username = '" + username + "'";
    
    // 🚩 Error: Empty catch block
    try {
      validateUser(username);
    } catch (Exception e) {
      // Silent failure - no logging!
    }
  }
  
  // 🚩 Error: Missing Javadoc for public method
  public boolean authenticate(String username, String password) {
    // 🚩 Error: Using == for String comparison
    if (username == "admin") {
      return true;
    }
    
    // 🚩 Error: Potential NullPointerException - no null check
    User user = getUserFromDB(username);
    String dbPassword = user.getPassword();  // What if user is null?
    
    return false;
  }
  
  // 🚩 Error: Wildcard import in imports (not shown here but common)
  // import java.util.*;
  
  // 🚩 Error: Method with high cyclomatic complexity
  public void processUserData(String input) {
    if (input == null) {
      System.out.println("Input is null");
    } else if (input.isEmpty()) {
      System.out.println("Input is empty");
    } else if (input.length() > 100) {
      System.out.println("Input too long");
    } else if (input.contains("DROP")) {
      System.out.println("Potential SQL injection");
    } else if (input.contains("script")) {
      System.out.println("Potential XSS");
    } else {
      System.out.println("Input validated");
    }
  }
  
  // 🚩 Error: Magic number without explanation
  private boolean isValidAge(int age) {
    return age > 18;  // What is 18? Adult age? Voting age?
  }
  
  // 🚩 Error: Unused import (example at top of file)
  private User getUserFromDB(String username) {
    return null;  // Simplified for demo
  }
  
  private void validateUser(String username) throws Exception {
    // Some validation logic
  }
}

class User {
  private String username;
  private String password;
  
  public String getPassword() {
    return password;
  }
}


// 🚩 Error: Too many blank lines below
