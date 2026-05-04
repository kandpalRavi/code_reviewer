import tempfile
import os
import subprocess
import json
import re
from typing import Dict, List, Any

class JavaAnalyzer:
    """Java code analyzer using CheckStyle and regex patterns"""
    
    def __init__(self):
        self.temp_dir = tempfile.gettempdir()
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.backend_dir = backend_dir
        self.tools_dir = os.path.join(backend_dir, 'tools')
        self.checkstyle_jar = os.path.join(self.tools_dir, 'checkstyle-10.13.0-all.jar')
    
    def analyze(self, code: str) -> Dict[str, Any]:
        """Analyze Java code"""
        issues = self._detect_issues(code)
        metrics = self._calculate_metrics(code)
        security_vulns = self._detect_security_issues(code)

        # ── Score computation (same formula as Python/JS analyzers) ──────────
        quality_score  = self._calculate_quality_score(issues)
        complexity_score = self._calculate_complexity_score(metrics)
        security_score = self._calculate_security_score(security_vulns)
        final_score    = (quality_score + complexity_score + security_score) / 3

        return {
            "issues": issues,
            "metrics": metrics,
            "security_vulnerabilities": security_vulns,
            "scores": {
                "quality":    round(quality_score,   1),
                "complexity": round(complexity_score, 1),
                "security":   round(security_score,  1),
                "final":      round(final_score,     1),
            }
        }

    def _calculate_quality_score(self, issues: list) -> float:
        """Penalise for each issue by severity."""
        score = 100.0
        for issue in issues:
            sev = issue.get('severity', 'info')
            if sev in ('critical', 'error'):
                score -= 10
            elif sev == 'warning':
                score -= 5
            else:
                score -= 2
        return max(0.0, min(100.0, score))

    def _calculate_complexity_score(self, metrics: dict) -> float:
        """Use maintainability index minus complexity penalty."""
        maintainability   = metrics.get('maintainability', 100)
        complexity        = metrics.get('complexity', 1)
        complexity_penalty = min(30, complexity * 1.5)
        return max(0.0, min(100.0, maintainability - complexity_penalty))

    def _calculate_security_score(self, vulnerabilities: list) -> float:
        """Start at 100, deduct based on vulnerability severity."""
        score = 100.0
        for vuln in vulnerabilities:
            sev = vuln.get('severity', 'low').lower()
            if sev == 'critical':
                score -= 20
            elif sev == 'high':
                score -= 15
            elif sev == 'medium':
                score -= 8
            else:
                score -= 3
        return max(0.0, min(100.0, score))
    
    def _detect_issues(self, code: str) -> List[Dict]:
        """Detect issues using CheckStyle and regex patterns"""
        issues = []
        
        # Try CheckStyle first
        if os.path.exists(self.checkstyle_jar):
            checkstyle_issues = self._run_checkstyle(code)
            issues.extend(checkstyle_issues)
        
        # Supplement with regex-based detection
        regex_issues = self._detect_issues_regex(code)
        issues.extend(regex_issues)
        
        # Remove duplicates based on line number and keep production-relevant issues
        unique_issues = {}
        for issue in issues:
            key = (issue['line'], issue['rule'])
            if key not in unique_issues:
                unique_issues[key] = issue
        
        issues = list(unique_issues.values())
        # Keep the full issue set so reports do not hide production-relevant findings.
        return issues
    
    def _run_checkstyle(self, code: str) -> List[Dict]:
        """Run CheckStyle analysis"""
        issues = []
        try:
            # Create temporary Java file
            temp_file = os.path.join(self.temp_dir, "TempAnalysis.java")
            with open(temp_file, 'w', encoding='utf-8', errors='replace') as f:
                f.write(code)
            
            # Run CheckStyle
            result = subprocess.run(
                ['java', '-jar', self.checkstyle_jar, '-f', 'xml', temp_file],
                capture_output=True,
                text=True,
                timeout=15,
                encoding='utf-8',
                errors='replace'
            )
            
            # Parse XML output
            if result.stdout:
                issues = self._parse_checkstyle_output(result.stdout)
            
            # Cleanup
            if os.path.exists(temp_file):
                os.remove(temp_file)
        except Exception as e:
            print(f"CheckStyle error: {e}")
        
        return issues
    
    def _parse_checkstyle_output(self, xml_output: str) -> List[Dict]:
        """Parse CheckStyle XML output"""
        issues = []
        try:
            # Extract error elements using regex
            error_pattern = r'<error\s+line="(\d+)"\s+column="(\d+)"\s+severity="(\w+)"\s+message="([^"]+)"\s+source="([^"]+)"'
            matches = re.finditer(error_pattern, xml_output)
            
            for match in matches:
                line = int(match.group(1))
                column = int(match.group(2))
                severity = match.group(3).lower()
                message = match.group(4)
                source = match.group(5)
                
                # Extract rule name from source
                rule = source.split('.')[-1] if '.' in source else source
                
                # Filter for production-relevant issues
                if self._is_production_impacting(rule, message):
                    issues.append({
                        "id": len(issues) + 1,
                        "severity": "error" if severity in ["error", "fatal"] else "warning",
                        "line": line,
                        "message": message,
                        "rule": rule
                    })
        except Exception as e:
            print(f"Error parsing CheckStyle output: {e}")
        
        return issues
    
    def _is_production_impacting(self, rule: str, message: str) -> bool:
        """Filter to production-relevant issues"""
        # Production-critical patterns
        critical_patterns = [
            'NullPointer', 'Empty', 'Unused', 'Redundant', 'Duplicate',
            'Incorrect', 'Invalid', 'Missing', 'Uncaught', 'Magic',
            'String equality', 'Resource leak', 'SQL injection'
        ]
        
        for pattern in critical_patterns:
            if pattern.lower() in message.lower():
                return True
        
        # Filter out style-only issues
        style_only = [
            'LineLength', 'Indentation', 'FileTabCharacter', 'RegexpSingleline',
            'ImportOrder', 'SpacesAroundOperators', 'MethodNameFormat'
        ]
        
        for style in style_only:
            if style in rule:
                return False
        
        return True
    
    def _detect_issues_regex(self, code: str) -> List[Dict]:
        """Detect issues using regex patterns"""
        issues = []
        lines = code.split('\n')
        
        issue_id = 1
        seen_issues = set()
        
        # 1. Check for System.out (logging)
        for i, line in enumerate(lines, 1):
            if 'System.out' in line and i not in seen_issues:
                issues.append({
                    "id": issue_id,
                    "severity": "warning",
                    "line": i,
                    "message": "Use logging framework (SLF4J, Log4j) instead of System.out",
                    "rule": "avoid-system-out"
                })
                issue_id += 1
                seen_issues.add(i)
        
        # 2. Check for SQL injection risks
        if 'Statement' in code and 'executeQuery' in code:
            for i, line in enumerate(lines, 1):
                if 'executeQuery' in line and '+' in lines[max(0, i-3):i+3]:
                    issues.append({
                        "id": issue_id,
                        "severity": "error",
                        "line": i,
                        "message": "SQL injection risk: Use PreparedStatement with parameterized queries",
                        "rule": "sql-injection"
                    })
                    issue_id += 1
                    break
        
        # 3. Check for hardcoded credentials
        for i, line in enumerate(lines, 1):
            if re.search(r'(password|secret|api_key|apikey|token)\s*=\s*["\']', line, re.IGNORECASE):
                issues.append({
                    "id": issue_id,
                    "severity": "critical",
                    "line": i,
                    "message": "Hardcoded credential detected. Move to configuration/environment variables",
                    "rule": "hardcoded-secret"
                })
                issue_id += 1
        
        # 4. Check for String comparison with ==
        for i, line in enumerate(lines, 1):
            if re.search(r'(\w+)\s*==\s*"', line) and 'equals' not in line:
                issues.append({
                    "id": issue_id,
                    "severity": "error",
                    "line": i,
                    "message": "Use .equals() for String comparison instead of ==",
                    "rule": "string-comparison"
                })
                issue_id += 1
                break
        
        # 5. Check for empty catch blocks
        for i in range(len(lines) - 1):
            if 'catch' in lines[i]:
                # Check if next few lines have only closing brace
                block_text = ''.join(lines[i:min(i+3, len(lines))])
                if re.search(r'catch\s*\([^)]+\)\s*\{\s*\}', block_text) or \
                   (lines[i+1].strip() == '}' and 'catch' in lines[i]):
                    issues.append({
                        "id": issue_id,
                        "severity": "error",
                        "line": i + 1,
                        "message": "Empty catch block. Either handle exception or log it",
                        "rule": "empty-catch"
                    })
                    issue_id += 1
        
        # 6. Check for potential NullPointerException
        for i, line in enumerate(lines, 1):
            if ('.get(' in line or '.next()' in line) and 'null' not in lines[max(0,i-2):i]:
                issues.append({
                    "id": issue_id,
                    "severity": "warning",
                    "line": i,
                    "message": "Potential NullPointerException. Add null check or use Optional",
                    "rule": "null-pointer-risk"
                })
                issue_id += 1
                break
        
        # 7. Check for wildcard imports
        for i, line in enumerate(lines, 1):
            if re.search(r'import\s+\S+\.\*', line):
                issues.append({
                    "id": issue_id,
                    "severity": "warning",
                    "line": i,
                    "message": "Avoid wildcard imports. Import specific classes explicitly",
                    "rule": "avoid-wildcard-imports"
                })
                issue_id += 1
        
        # 8. Check for missing Javadoc on public methods
        for i, line in enumerate(lines, 1):
            if re.search(r'^\s*public\s+(static\s+)?(void|String|int|boolean|List|Map|Set|\w+)\s+\w+\s*\(', line):
                # Check if previous line has Javadoc
                if i > 1 and not re.search(r'/\*\*', lines[i - 2]):
                    issues.append({
                        "id": issue_id,
                        "severity": "warning",
                        "line": i,
                        "message": "Public method missing Javadoc comment",
                        "rule": "missing-javadoc"
                    })
                    issue_id += 1
        
        # 9. Check for unused imports (basic heuristic)
        imports = {}
        for i, line in enumerate(lines, 1):
            match = re.search(r'import\s+(?:static\s+)?(?:java\.util\.|[a-z]+\.)*(\w+)', line)
            if match:
                class_name = match.group(1)
                imports[class_name] = i
        
        # Check if imported classes are used
        for class_name, line_num in imports.items():
            if class_name not in code[code.index('\n', code.find('import')):]:
                # Skip java.* classes as they're often conditionally used
                if 'java' not in lines[line_num - 1]:
                    issues.append({
                        "id": issue_id,
                        "severity": "info",
                        "line": line_num,
                        "message": f"Potentially unused import: {class_name}",
                        "rule": "unused-import"
                    })
                    issue_id += 1
        
        # 10. Check for magic numbers
        for i, line in enumerate(lines, 1):
            if re.search(r'=\s*(\d{3,})\b', line) and 'import' not in line and line.strip() and not line.strip().startswith('//'):
                issues.append({
                    "id": issue_id,
                    "severity": "warning",
                    "line": i,
                    "message": "Magic number detected. Define as named constant (final)",
                    "rule": "magic-number"
                })
                issue_id += 1
                break
        
        return issues
    
    def _detect_security_issues(self, code: str) -> List[Dict]:
        """Detect security vulnerabilities"""
        vulnerabilities = []
        lines = code.split('\n')
        
        # 1. SQL injection detection
        if 'Statement' in code and 'executeQuery' in code:
            for i, line in enumerate(lines, 1):
                if 'Statement' in line and ('+' in line or 'concat' in line.lower()):
                    vulnerabilities.append({
                        "id": len(vulnerabilities) + 1,
                        "severity": "high",
                        "line": i,
                        "message": "SQL injection risk detected. Use PreparedStatement",
                        "rule": "sql-injection"
                    })
        
        # 2. Hardcoded secrets
        for i, line in enumerate(lines, 1):
            if re.search(r'(password|secret|key|token)\s*=\s*["\'][\w!@#$%^&*]{6,}["\']', line, re.IGNORECASE):
                vulnerabilities.append({
                    "id": len(vulnerabilities) + 1,
                    "severity": "critical",
                    "line": i,
                    "message": "Hardcoded secret found. Move to environment variables or config",
                    "rule": "hardcoded-secret"
                })
        
        # 3. Insecure deserialization
        if 'ObjectInputStream' in code or 'readObject' in code:
            vulnerabilities.append({
                "id": len(vulnerabilities) + 1,
                "severity": "high",
                "line": 1,
                "message": "Insecure deserialization. Validate all deserialized data",
                "rule": "insecure-deserialization"
            })
        
        # 4. Command injection
        if 'Runtime.getRuntime().exec' in code or 'ProcessBuilder' in code:
            for i, line in enumerate(lines, 1):
                if 'exec' in line or 'ProcessBuilder' in line:
                    vulnerabilities.append({
                        "id": len(vulnerabilities) + 1,
                        "severity": "high",
                        "line": i,
                        "message": "Command injection risk. Sanitize and validate user input",
                        "rule": "command-injection"
                    })
        
        return vulnerabilities[:10]  # Limit security findings
    
    def _calculate_metrics(self, code: str) -> Dict:
        """Calculate Java code metrics"""
        lines = code.split('\n')
        
        # Lines of code (excluding comments and empty lines)
        non_empty_lines = [l for l in lines if l.strip() and not l.strip().startswith('//')]
        lines_of_code = len(non_empty_lines)
        
        # Cyclomatic complexity
        complexity = 1
        complexity_keywords = {
            'if': code.count('if ') + code.count('if('),
            'else': code.count('else '),
            'else if': code.count('else if'),
            'for': code.count('for ') + code.count('for('),
            'while': code.count('while ') + code.count('while('),
            'switch': code.count('switch'),
            'case': code.count('case '),
            'catch': code.count('catch'),
            'ternary': code.count('?') // 2,  # Ternary operators
            '&&': code.count('&&'),
            '||': code.count('||'),
            'throw': code.count('throw'),
            'return': max(0, code.count('return') - 1),
        }
        
        for keyword, count in complexity_keywords.items():
            complexity += count
        
        # Method count
        method_count = len(re.findall(r'(public|private|protected)\s+\w+\s+\w+\s*\(', code))
        
        # Comment ratio
        comment_lines = len([l for l in lines if l.strip().startswith('//') or l.strip().startswith('/*')])
        comment_ratio = (comment_lines / max(1, lines_of_code)) * 100
        
        # Maintainability Index
        maintainability = 100
        maintainability -= complexity * 1.5
        maintainability -= (lines_of_code / 10) if lines_of_code > 100 else 0
        maintainability += (method_count * 1.5)
        maintainability += (comment_ratio * 0.5)
        
        maintainability = max(0, min(100, maintainability))
        
        return {
            "lines_of_code": max(lines_of_code, 1),
            "complexity": min(complexity, 50),
            "maintainability": round(maintainability, 1)
        }
    
    def generate_suggestions(self, metrics: Dict, issues: List[Dict]) -> List[str]:
        """Generate suggestions for Java code"""
        suggestions = []
        
        if metrics['complexity'] > 15:
            suggestions.append("High complexity detected. Refactor using Extract Method pattern.")
        
        if metrics['lines_of_code'] > 500:
            suggestions.append("Large file. Consider splitting into smaller, focused classes.")
        
        if metrics['maintainability'] < 50:
            suggestions.append("Low maintainability score. Add documentation and reduce complexity.")
        
        system_out_issues = [i for i in issues if 'system.out' in i.get('message', '').lower()]
        if system_out_issues:
            suggestions.append("Replace System.out with proper logging (SLF4J/Log4j).")
        
        security_issues = [i for i in issues if i.get('severity') == 'critical']
        if security_issues:
            suggestions.append("Fix critical security issues before production deployment.")
        
        suggestions.append("Add unit tests using JUnit 5 and Mockito for better coverage.")
        suggestions.append("Use Optional<T> for null safety instead of explicit null checks.")
        suggestions.append("Follow SOLID principles for better code design and maintainability.")
        
        return suggestions
