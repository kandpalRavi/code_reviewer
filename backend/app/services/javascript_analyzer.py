from typing import Dict, List, Any
import re
import tempfile
import os
import subprocess
import json

class JavaScriptAnalyzer:
    """JavaScript code analyzer using ESLint"""
    
    def __init__(self):
        self.temp_dir = tempfile.gettempdir()
        # Get node_modules eslint path
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.backend_dir = backend_dir
        self.eslint_bin = os.path.join(backend_dir, 'node_modules', '.bin', 'eslint.cmd')
        if not os.path.exists(self.eslint_bin):
            # Try .js file on Unix
            self.eslint_bin = os.path.join(backend_dir, 'node_modules', '.bin', 'eslint')
    
    def analyze(self, code: str) -> Dict[str, Any]:
        """Analyze JavaScript code with ESLint"""
        issues = self._detect_issues_eslint(code)
        metrics = self._calculate_metrics(code)
        
        # Calculate combined scores
        quality_score = self._calculate_quality_score(issues)
        complexity_score = self._calculate_complexity_score(metrics)
        security_score = self._calculate_security_score(issues)
        final_score = (quality_score + complexity_score + security_score) / 3
        
        return {
            "issues": issues,
            "metrics": metrics,
            "security_vulnerabilities": [],
            "scores": {
                "quality": round(quality_score, 1),
                "complexity": round(complexity_score, 1),
                "security": round(security_score, 1),
                "final": round(final_score, 1)
            }
        }
    
    def _detect_issues_eslint(self, code: str) -> List[Dict]:
        """Detect issues using ESLint"""
        temp_file = None
        try:
            # Normalize common non-JS paste artifacts (e.g. coding platform headers)
            # while preserving line numbers for accurate issue reporting.
            normalized_code = self._normalize_code_for_linting(code)

            # Create a unique temporary JS file in backend dir so ESLint can find config
            # and concurrent requests do not collide on Windows file locks.
            with tempfile.NamedTemporaryFile(
                mode='w',
                encoding='utf-8',
                suffix='.js',
                prefix='temp_analysis_eslint_',
                dir=self.backend_dir,
                delete=False
            ) as temp_handle:
                temp_file = temp_handle.name
                f = temp_handle
                f.write(normalized_code)
            
            # Use ESLint from node_modules
            if not os.path.exists(self.eslint_bin):
                print(f"ESLint not found at {self.eslint_bin}")
                if os.path.exists(temp_file):
                    os.remove(temp_file)
                return []
            
            # Run ESLint with JSON output using eslint.config.js
            result = subprocess.run(
                [self.eslint_bin, temp_file, '--format=json'],
                capture_output=True,
                encoding='utf-8',  # Explicit UTF-8 encoding
                errors='replace',  # Replace unencodable chars instead of failing
                timeout=15,
                cwd=self.backend_dir  # Use backend dir so it finds eslint.config.js
            )
            
            if result.stdout:
                try:
                    eslint_data = json.loads(result.stdout)
                    issues = []
                    
                    for file_result in eslint_data:
                        for message in file_result.get('messages', []):
                            # Keep fatal/parse errors visible to UI instead of dropping them.
                            # ESLint uses ruleId=None for parser failures.
                            rule_id = message.get('ruleId') or 'parse-error'
                            severity = 'error' if message.get('severity') == 2 else 'warning'
                            issues.append({
                                "id": len(issues) + 1,
                                "severity": severity,
                                "line": message.get('line', 0),
                                "message": message.get('message', ''),
                                "rule": rule_id
                            })
                    
                    return issues
                except json.JSONDecodeError as e:
                    print(f"Error parsing ESLint output: {e}")
                    return []
        except Exception as e:
            print(f"ESLint error: {e}")
        finally:
            if temp_file and os.path.exists(temp_file):
                try:
                    os.remove(temp_file)
                except OSError:
                    pass
        
        return []

    def _normalize_code_for_linting(self, code: str) -> str:
        """Convert known non-JS starter lines into JS comments."""
        normalized_lines = []
        for line in code.splitlines():
            stripped = line.lstrip()
            indent = line[:len(line) - len(stripped)]

            if stripped.startswith('#'):
                normalized_lines.append(f"{indent}// {stripped[1:].lstrip()}")
            else:
                normalized_lines.append(line)

        return '\n'.join(normalized_lines)
    
    def _calculate_metrics(self, code: str) -> Dict:
        """Calculate comprehensive metrics for JavaScript code"""
        lines = code.split('\n')
        
        # Lines of code (excluding comments and empty lines)
        non_empty_lines = [l for l in lines if l.strip() and not l.strip().startswith('//')]
        lines_of_code = len(non_empty_lines)
        
        # Cyclomatic Complexity (control flow statements)
        # Base complexity is 1, add 1 for each:
        # if, else, case, for, while, do-while, catch, ternary, logical operators
        complexity = 1
        
        # Count control flow statements
        control_flow = {
            'if': code.count('if ') + code.count('if('),
            'else if': code.count('else if'),
            'else': code.count('else '),
            'case': code.count('case '),
            'for': code.count('for ') + code.count('for('),
            'while': code.count('while ') + code.count('while('),
            'do': code.count('do '),
            'catch': code.count('catch'),
            '? :': code.count('?'),  # Ternary operators
            '&&': code.count('&&'),
            '||': code.count('||'),
            'switch': code.count('switch'),
            'throw': code.count('throw'),
            'return': code.count('return')
        }
        
        # Add 1 for each control flow element
        for keyword, count in control_flow.items():
            complexity += count
        
        # Function count (rough estimate)
        function_count = code.count('function ') + code.count('=>') + code.count('function(')
        
        # Maintainability Index calculation (simplified)
        # Factors:
        # - Lines of code (longer = harder to maintain)
        # - Complexity (more complex = harder to maintain)
        # - Number of functions (more functions = better modularity)
        # - Comment ratio (more comments = better maintainability)
        
        comment_lines = len([l for l in lines if l.strip().startswith('//') or l.strip().startswith('/*')])
        comment_ratio = (comment_lines / max(1, lines_of_code)) * 100
        
        # Maintainability Index (0-100, higher is better)
        # Base: 100
        # Subtract: complexity impact, LOC impact, lack of comments
        # Add: bonus for functions (modularity)
        maintainability = 100
        maintainability -= complexity * 1.5  # Complexity penalty
        maintainability -= (lines_of_code / 10)  # LOC penalty
        maintainability += (function_count * 2)  # Modularity bonus
        maintainability += (comment_ratio * 0.5)  # Comment bonus
        
        # Clamp maintainability between 0-100
        maintainability = max(0, min(100, maintainability))
        
        return {
            "lines_of_code": lines_of_code,
            "complexity": min(complexity, 50),  # Cap at 50 for display
            "maintainability": round(maintainability, 1)
        }

    def _calculate_quality_score(self, issues: List[Dict]) -> float:
        """Calculate Code Quality Score (0-100) from ESLint issues."""
        score = 100.0
        for issue in issues:
            sev = issue.get('severity', 'info')
            if sev == 'error':
                score -= 10
            elif sev == 'warning':
                score -= 5
            else:
                score -= 2
        return max(0.0, min(100.0, score))

    def _calculate_complexity_score(self, metrics: Dict) -> float:
        """Calculate Complexity Score (0-100) from Radon-style metrics."""
        maintainability = metrics.get('maintainability', 100)
        complexity = metrics.get('complexity', 0)
        complexity_penalty = min(30, complexity * 1.5)
        return max(0.0, min(100.0, maintainability - complexity_penalty))

    def _calculate_security_score(self, issues: List[Dict]) -> float:
        """Calculate Security Score (0-100) from ESLint security rules."""
        score = 100.0
        security_rules = {'no-eval', 'no-implied-eval', 'no-new-func'}
        for issue in issues:
            rule = issue.get('rule', '')
            sev  = issue.get('severity', 'info')
            if rule in security_rules:
                score -= 20          # Security-specific rules hit harder
            elif sev == 'error':
                score -= 5
            elif sev == 'warning':
                score -= 3
        return max(0.0, min(100.0, score))
    
    def generate_suggestions(self, metrics: Dict, issues: List[Dict]) -> List[str]:
        """Generate suggestions for JavaScript code"""
        suggestions = []
        
        if metrics['complexity'] > 15:
            suggestions.append("High complexity detected. Break down complex functions using the Single Responsibility Principle.")
        
        var_issues = [i for i in issues if i['rule'] == 'no-var']
        if var_issues:
            suggestions.append("Replace 'var' with 'let' or 'const' for better scoping and to prevent hoisting issues.")
        
        suggestions.append("Consider using async/await instead of callbacks for better readability.")
        suggestions.append("Add JSDoc comments to document function parameters and return types.")
        suggestions.append("Use ES6+ features like arrow functions, destructuring, and template literals.")
        
        return suggestions
