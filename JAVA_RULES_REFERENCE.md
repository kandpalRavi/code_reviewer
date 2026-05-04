# Java Rules Reference Guide

Complete reference for all Java analysis rules with examples and explanations.

## Rule Categories

### 🔴 CRITICAL (Security)
- `sql-injection` - SQL Injection vulnerability
- `hardcoded-secret` - Hardcoded credentials
- `command-injection` - Command injection risk
- `insecure-deserialization` - Unsafe deserialization

### 🟠 ERROR (Major Issues)
- `string-comparison` - Incorrect String comparison
- `empty-catch` - Empty catch block

### 🟡 WARNING (Important)
- `avoid-system-out` - System.out usage
- `null-pointer-risk` - Potential NullPointerException
- `avoid-wildcard-imports` - Wildcard imports
- `magic-number` - Hardcoded magic numbers
- `unused-import` - Unused imports

### 🔵 INFO (Documentation)
- `missing-javadoc` - Missing Javadoc comments

---

## Detailed Rules

### 1. SQL Injection (`sql-injection`)
**Severity**: 🔴 CRITICAL  
**Tool**: Java Analyzer  
**Category**: Security

#### What it detects
```java
// ❌ VULNERABLE
String userId = getUserInput();
String query = "SELECT * FROM users WHERE id = " + userId;
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery(query);
```

#### Why it matters
- Attacker can modify SQL logic
- Can steal/delete/modify database records
- Most common web vulnerability (OWASP #1)
- Leads to complete database compromise

#### How to fix
```java
// ✅ SAFE
String userId = getUserInput();
String query = "SELECT * FROM users WHERE id = ?";
PreparedStatement pstmt = conn.prepareStatement(query);
pstmt.setInt(1, Integer.parseInt(userId));  // Validated and parameterized
ResultSet rs = pstmt.executeQuery();
```

#### Best Practices
- Always use PreparedStatement or parameterized queries
- Never concatenate user input into SQL
- Use ORM frameworks (Hibernate, JPA) when possible
- Validate input against whitelist
- Use connection pooling with proper timeouts

---

### 2. Hardcoded Secret (`hardcoded-secret`)
**Severity**: 🔴 CRITICAL  
**Tool**: Java Analyzer  
**Category**: Security

#### What it detects
```java
// ❌ VULNERABLE
String apiKey = "sk-1234567890abcdef";
String password = "admin123";
String dbPassword = "mydb_password";
String jwtSecret = "super-secret-key";
```

#### Why it matters
- Credentials exposed in source code
- Visible in version control history
- Included in compiled JAR/WAR files
- Accessible to anyone with code access
- Can't be rotated without code change

#### How to fix
```java
// ✅ SAFE - Environment Variables
String apiKey = System.getenv("API_KEY");
String password = System.getenv("DB_PASSWORD");

// ✅ SAFE - System Properties
String jwtSecret = System.getProperty("jwt.secret");

// ✅ SAFE - Spring Cloud Config
@Value("${api.key}")
private String apiKey;

// ✅ SAFE - AWS Secrets Manager, HashiCorp Vault, etc.
SecretsManager sm = new SecretsManager();
String secret = sm.getSecret("my-app/api-key");
```

#### Best Practices
- Use environment variables for development
- Use secrets management service in production
- Rotate secrets regularly
- Audit secret access
- Use separate credentials per environment
- Never commit secrets to version control

---

### 3. Command Injection (`command-injection`)
**Severity**: 🔴 CRITICAL  
**Tool**: Java Analyzer  
**Category**: Security

#### What it detects
```java
// ❌ VULNERABLE
String filename = getUserInput();
Runtime.getRuntime().exec("ls " + filename);
Runtime.getRuntime().exec("rm " + filename);

// ❌ VULNERABLE
ProcessBuilder pb = new ProcessBuilder("ls " + userInput);
pb.start();
```

#### Why it matters
- Attacker can execute arbitrary OS commands
- Can steal files, delete data, install malware
- Runs with application privileges
- Remote Code Execution (RCE)

#### How to fix
```java
// ✅ SAFE - Use array form (no shell interpretation)
String filename = getUserInput();
ProcessBuilder pb = new ProcessBuilder("ls", filename);
pb.start();

// ✅ SAFE - Validate input first
if (!filename.matches("^[a-zA-Z0-9._-]+$")) {
    throw new IllegalArgumentException("Invalid filename");
}
Runtime.getRuntime().exec(new String[] { "ls", filename });

// ✅ SAFE - Use whitelist for allowed commands
String[] allowedCommands = {"list", "info", "status"};
String command = getUserInput();
if (Arrays.stream(allowedCommands).anyMatch(command::equals)) {
    executeCommand(command);
}
```

#### Best Practices
- Never pass user input to exec()
- Use array form of exec(), not String concatenation
- Validate/sanitize all user input
- Use whitelist of allowed commands
- Run with minimal required privileges
- Avoid shell=True where possible

---

### 4. Insecure Deserialization (`insecure-deserialization`)
**Severity**: 🔴 CRITICAL  
**Tool**: Java Analyzer  
**Category**: Security

#### What it detects
```java
// ❌ VULNERABLE
ObjectInputStream ois = new ObjectInputStream(untrustedInput);
Object obj = ois.readObject();  // Can execute arbitrary code!
```

#### Why it matters
- Deserializing untrusted data can execute code
- Gadget chains allow code execution
- Affects all serialization frameworks
- Remote Code Execution (RCE)

#### How to fix
```java
// ✅ SAFE - Use JSON instead
String json = readInput();
User user = new Gson().fromJson(json, User.class);

// ✅ SAFE - Validate serialization
ObjectInputStream ois = new ObjectInputStream(input) {
    @Override
    protected Class<?> resolveClass(ObjectStreamClass desc) 
            throws IOException, ClassNotFoundException {
        if (!isAllowed(desc.getName())) {
            throw new InvalidClassException("Class not allowed");
        }
        return super.resolveClass(desc);
    }
};
Object obj = ois.readObject();

// ✅ SAFE - Use SerialKiller library
String data = loadUntrustedData();
Object obj = SerialKiller.deserialize(data);
```

#### Best Practices
- Prefer JSON over Java serialization
- Implement whitelisting for allowed classes
- Use SerialKiller or NotSoSerial filters
- Never deserialize untrusted data
- Log and monitor deserialization
- Update gadget chain libraries regularly

---

### 5. String Comparison (`string-comparison`)
**Severity**: 🟠 ERROR  
**Tool**: Java Analyzer  
**Category**: Error

#### What it detects
```java
// ❌ WRONG - Compares reference, not value
String username = "admin";
String input = getUserInput();
if (input == username) {  // Usually false even if values match!
    grantAccess();
}

// ❌ WRONG
if (input == "admin") {  // Always false - different object
    grantAccess();
}
```

#### Why it matters
- == compares object references, not values
- Two identical strings may not be equal
- Security bypass if used in authentication
- Logic errors and unexpected behavior

#### How to fix
```java
// ✅ CORRECT - Uses .equals() for value comparison
String input = getUserInput();
if (input.equals("admin")) {  // Compares string content
    grantAccess();
}

// ✅ CORRECT - Case-insensitive comparison
if (input.equalsIgnoreCase("admin")) {
    grantAccess();
}

// ✅ CORRECT - Null-safe comparison
if (Objects.equals(input, "admin")) {
    grantAccess();
}
```

#### Best Practices
- Always use .equals() for String comparison
- Use .equalsIgnoreCase() for case-insensitive
- Use Objects.equals() for null-safe comparison
- Use .compareTo() only when ordering is needed
- Consider interned strings only in specific cases

---

### 6. Empty Catch Block (`empty-catch`)
**Severity**: 🟠 ERROR  
**Tool**: Java Analyzer  
**Category**: Error

#### What it detects
```java
// ❌ WRONG - Silent failure
try {
    parseUserData(input);
} catch (ParseException e) {
    // Empty - exception swallowed, never logged!
}
// Code continues as if parsing succeeded
```

#### Why it matters
- Exception is silently ignored
- Debugging becomes impossible
- Application behaves unexpectedly
- Error conditions not reported
- Most common source of mysterious bugs

#### How to fix
```java
// ✅ CORRECT - Always log or rethrow
try {
    parseUserData(input);
} catch (ParseException e) {
    logger.error("Failed to parse user data", e);
    throw new ApplicationException("Invalid format", e);
}

// ✅ CORRECT - Log and continue (if appropriate)
try {
    parseOptionalField(input);
} catch (ParseException e) {
    logger.warn("Optional field parse failed, using default", e);
    field = getDefaultValue();
}

// ✅ CORRECT - Handle specific cases
try {
    int count = Integer.parseInt(input);
} catch (NumberFormatException e) {
    logger.debug("Invalid number format, using 0");
    count = 0;
}
```

#### Best Practices
- Never have empty catch blocks
- Always log the exception with context
- Log at appropriate level (error, warn, debug)
- Include exception cause chain
- Consider specific exceptions vs Exception
- Decide: rethrow, continue, or default value

---

### 7. Avoid System.out (`avoid-system-out`)
**Severity**: 🟡 WARNING  
**Tool**: Java Analyzer  
**Category**: Best Practice

#### What it detects
```java
// ❌ NOT RECOMMENDED
System.out.println("User logged in: " + username);
System.out.println("Error: " + error.getMessage());
System.err.println("Debug info");
```

#### Why it matters
- No log levels (info, warn, error, debug)
- No timestamp or structured format
- Output goes to console only
- No log file persistence
- Can't be configured at runtime
- Not suitable for production monitoring

#### How to fix
```java
// ✅ CORRECT - Use SLF4J
private static final Logger logger = LoggerFactory.getLogger(UserService.class);

logger.info("User logged in: {}", username);
logger.error("Error occurred", error);
logger.debug("Debug information");

// ✅ CORRECT - Use Log4j
private static final Logger logger = LogManager.getLogger(UserService.class);

logger.info("Processing user: {}", userId);
logger.warn("Unusual activity detected");
logger.error("Operation failed", exception);
```

#### Best Practices
- Use SLF4J as facade (with Log4j or Logback)
- Configure log levels per environment
- Use structured logging format
- Include context (user, request ID, etc.)
- Use appropriate log levels
- Redirect System.out to logging in tests

---

### 8. Null Pointer Risk (`null-pointer-risk`)
**Severity**: 🟡 WARNING  
**Tool**: Java Analyzer  
**Category**: Runtime

#### What it detects
```java
// ❌ RISKY - No null check
User user = getUserFromDB(id);
String email = user.getEmail();  // NPE if user is null!

// ❌ RISKY - No validation of collection
List<String> names = getNames();
String first = names.get(0);  // NPE if list is null or empty!
```

#### Why it matters
- Most common Java exception: NullPointerException
- Crashes application at runtime
- Difficult to debug in complex call chains
- Sudden service failures
- Poor user experience

#### How to fix
```java
// ✅ SAFE - Explicit null check
User user = getUserFromDB(id);
if (user != null) {
    String email = user.getEmail();
    sendEmail(email);
}

// ✅ SAFE - Modern Java with Optional
Optional<User> userOpt = getUserFromDB(id);
userOpt.ifPresent(user -> {
    sendEmail(user.getEmail());
});

// ✅ SAFE - Optional orElse
String email = getUserFromDB(id)
    .map(User::getEmail)
    .orElse("no-reply@example.com");

// ✅ SAFE - Collection validation
List<String> names = getNames();
if (names != null && !names.isEmpty()) {
    String first = names.get(0);
}
```

#### Best Practices
- Use Optional for values that may be absent
- Declare non-null when possible (@NonNull)
- Use method return types clearly (Optional, empty list)
- Null object pattern for common cases
- Avoid creating nulls, prefer empty collections
- Use Objects.requireNonNull() for preconditions

---

### 9. Wildcard Imports (`avoid-wildcard-imports`)
**Severity**: 🟡 WARNING  
**Tool**: Java Analyzer  
**Category**: Code Quality

#### What it detects
```java
// ❌ UNCLEAR - What classes are used?
import java.util.*;
import java.io.*;
import java.time.*;

List<String> list = new ArrayList<>();
```

#### Why it matters
- Unclear which classes are actually used
- Name conflicts/collisions possible
- IDE autocomplete less accurate
- Harder to understand dependencies
- Difficult for code review

#### How to fix
```java
// ✅ EXPLICIT - Clear what's imported
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.io.IOException;
import java.io.FileReader;

List<String> list = new ArrayList<>();
```

#### Best Practices
- Import specific classes
- Use IDE "Organize Imports" feature
- Never use wildcard imports in production
- Exception: static imports can be used sparingly
- Keep imports organized and sorted

---

### 10. Magic Number (`magic-number`)
**Severity**: 🟡 WARNING  
**Tool**: Java Analyzer  
**Category**: Code Quality

#### What it detects
```java
// ❌ UNCLEAR - What does 18 mean? 100? 3?
if (user.getAge() > 18) {
    grantAccess();
}

if (password.length() < 8) {
    throwError();
}

int maxRetries = 3;
```

#### Why it matters
- Unclear meaning of the number
- Difficult to maintain
- If it changes, must change everywhere
- Duplication and inconsistency
- Reduced code readability

#### How to fix
```java
// ✅ CLEAR - Named constants
private static final int ADULT_AGE = 18;
private static final int MIN_PASSWORD_LENGTH = 8;
private static final int MAX_RETRIES = 3;

if (user.getAge() > ADULT_AGE) {
    grantAccess();
}

if (password.length() < MIN_PASSWORD_LENGTH) {
    throwError();
}
```

#### Best Practices
- Define constants with clear names
- Use enum for related constants
- Place constants in appropriate class
- Centralize configuration values
- Use static final for immutable values
- Document what the value represents

---

### 11. Unused Import (`unused-import`)
**Severity**: 🟡 INFO  
**Tool**: Java Analyzer  
**Category**: Code Quality

#### What it detects
```java
// ❌ UNNECESSARY
import java.util.HashMap;
import java.util.TreeMap;  // Never used!
import java.time.LocalDate;  // Never used!

public class Service {
    Map<String, String> map = new HashMap<>();  // Only HashMap used
}
```

#### Why it matters
- Clutters code
- Confuses about actual dependencies
- Increases compilation time slightly
- Appears in IDE inspections
- Takes space in files

#### How to fix
```java
// ✅ CLEAN - Only necessary imports
import java.util.HashMap;
import java.util.Map;

public class Service {
    Map<String, String> map = new HashMap<>();
}
```

#### Best Practices
- Use IDE's "Optimize Imports" regularly
- Configure IDE to remove unused imports on save
- Check in code review
- Use static code analysis tools

---

### 12. Missing Javadoc (`missing-javadoc`)
**Severity**: 🔵 INFO  
**Tool**: Java Analyzer  
**Category**: Documentation

#### What it detects
```java
// ❌ NO DOCUMENTATION
public class UserService {
    public User createUser(String username, String email) {
        // ...
    }
    
    public void sendNotification(String message) {
        // ...
    }
}
```

#### Why it matters
- Other developers don't know what method does
- Hard to use API correctly
- Missing parameter documentation
- No return value explanation
- Maintenance burden increases

#### How to fix
```java
// ✅ WELL DOCUMENTED
/**
 * Creates a new user with the provided credentials.
 *
 * @param username the user's login name (must be unique)
 * @param email the user's email address
 * @return the created User object
 * @throws IllegalArgumentException if username is empty or duplicate
 * @throws InvalidEmailException if email format is invalid
 */
public User createUser(String username, String email) {
    // ...
}

/**
 * Sends a notification to all administrators.
 *
 * @param message the notification message (max 500 characters)
 * @throws MessagingException if sending fails
 */
public void sendNotification(String message) {
    // ...
}
```

#### Best Practices
- Document all public APIs
- Explain "why", not just "what"
- Include parameter documentation
- Document exceptions
- Provide usage examples
- Keep Javadoc current with code changes

---

## Summary Table

| Rule | Severity | Category | Fix Impact |
|------|----------|----------|-----------|
| sql-injection | 🔴 CRITICAL | Security | High |
| hardcoded-secret | 🔴 CRITICAL | Security | High |
| command-injection | 🔴 CRITICAL | Security | High |
| insecure-deserialization | 🔴 CRITICAL | Security | High |
| string-comparison | 🟠 ERROR | Error | High |
| empty-catch | 🟠 ERROR | Error | High |
| avoid-system-out | 🟡 WARNING | Best Practice | Medium |
| null-pointer-risk | 🟡 WARNING | Runtime | Medium |
| avoid-wildcard-imports | 🟡 WARNING | Quality | Low |
| magic-number | 🟡 WARNING | Quality | Low |
| unused-import | 🟡 INFO | Quality | Low |
| missing-javadoc | 🔵 INFO | Documentation | Low |

## Quick Links

- **Critical First**: Fix all 🔴 CRITICAL issues before deployment
- **High Priority**: Resolve 🟠 ERROR issues
- **Recommended**: Address 🟡 WARNING issues
- **Nice to Have**: 🔵 INFO issues improve code quality

## Tools & Resources

- Java Security Documentation: https://java.sun.com/security/
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- SonarQube: https://www.sonarqube.org/
- SpotBugs: https://spotbugs.readthedocs.io/
- Checkstyle: https://checkstyle.sourceforge.io/
