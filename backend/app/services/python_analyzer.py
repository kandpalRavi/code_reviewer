import tempfile
import os
import subprocess
import json
from typing import Dict, List, Any
import re

class PythonAnalyzer:
    """Analyze Python code using Pylint, Radon, and Bandit"""
    
    def __init__(self):
        self.temp_dir = tempfile.gettempdir()
        # Get venv bin directory
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.venv_bin = os.path.join(backend_dir, 'venv', 'Scripts')
    
    def analyze(self, code: str) -> Dict[str, Any]:
        """Run complete analysis on Python code"""
        # Create temporary file
        temp_file = self._create_temp_file(code)
        
        try:
            pylint_results = self._run_pylint(temp_file)
            radon_results = self._run_radon(temp_file)
            bandit_results = self._run_bandit(temp_file)
            
            # Aggregate results
            issues = self._parse_pylint_issues(pylint_results)
            metrics = self._parse_radon_metrics(radon_results, code)
            security = self._parse_bandit_issues(bandit_results)
            
            # Calculate combined scores
            quality_score = self._calculate_quality_score(len(issues), pylint_results)
            complexity_score = self._calculate_complexity_score(metrics)
            security_score = self._calculate_security_score(security, bandit_results)
            final_score = (quality_score + complexity_score + security_score) / 3
            
            return {
                "issues": issues,
                "metrics": metrics,
                "security_vulnerabilities": security,
                "scores": {
                    "quality": round(quality_score, 1),
                    "complexity": round(complexity_score, 1),
                    "security": round(security_score, 1),
                    "final": round(final_score, 1)
                }
            }
        finally:
            # Cleanup
            if os.path.exists(temp_file):
                os.remove(temp_file)
    
    def _create_temp_file(self, code: str) -> str:
        """Create temporary Python file"""
        temp_file = os.path.join(self.temp_dir, "temp_analysis.py")
        with open(temp_file, 'w', encoding='utf-8') as f:
            f.write(code)
        return temp_file
    
    def _run_pylint(self, file_path: str) -> str:
        """Run Pylint analysis"""
        try:
            pylint_exe = os.path.join(self.venv_bin, 'pylint.exe')
            result = subprocess.run(
                [pylint_exe, file_path, '--output-format=json'],
                capture_output=True,
                text=True,
                timeout=30
            )
            return result.stdout
        except Exception as e:
            print(f"Pylint error: {e}")
            return "[]"
    
    def _run_radon(self, file_path: str) -> Dict:
        """Run Radon complexity analysis"""
        results = {}
        
        try:
            radon_exe = os.path.join(self.venv_bin, 'radon.exe')
            
            # Cyclomatic complexity
            cc_result = subprocess.run(
                [radon_exe, 'cc', file_path, '-j'],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            # Maintainability index
            mi_result = subprocess.run(
                [radon_exe, 'mi', file_path, '-j'],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            results['cc'] = cc_result.stdout
            results['mi'] = mi_result.stdout
            
        except Exception as e:
            print(f"Radon error: {e}")
        
        return results
    
    def _run_bandit(self, file_path: str) -> str:
        """Run Bandit security analysis"""
        try:
            bandit_exe = os.path.join(self.venv_bin, 'bandit.exe')
            result = subprocess.run(
                [bandit_exe, '-r', file_path, '-f', 'json'],
                capture_output=True,
                text=True,
                timeout=30
            )
            return result.stdout
        except Exception as e:
            print(f"Bandit error: {e}")
            return "{}"
    
    def _parse_pylint_issues(self, pylint_output: str) -> List[Dict]:
        """Parse Pylint JSON output - only production-impacting issues"""
        issues = []
        try:
            pylint_data = json.loads(pylint_output) if pylint_output else []
            
            for idx, issue in enumerate(pylint_data):
                issue_type = issue.get('type', 'info')
                message_id = issue.get('message-id', 'unknown')
                
                # Only include issues that affect code performance/correctness
                if self._is_production_impacting_issue(issue_type, message_id):
                    severity = self._map_pylint_severity(issue_type)
                    issues.append({
                        "id": len(issues) + 1,
                        "severity": severity,
                        "line": issue.get('line', 0),
                        "message": issue.get('message', ''),
                        "rule": message_id
                    })
                    
                    # Keep all qualifying issues so the UI/report can show the full set.
        except json.JSONDecodeError:
            pass
        
        return issues
    
    def _is_production_impacting_issue(self, issue_type: str, message_id: str) -> bool:
        """Check if issue actually affects code quality/performance in production"""
        
        # EXCLUDE: Style and convention issues that don't affect functionality
        excluded_prefixes = {
            'C',  # Convention issues (naming, style, line length, trailing whitespace)
            'R0902',  # Too many instance attributes (design, not functional)
            'R0903',  # Too few public methods (design, not functional)
        }
        
        # Check if message_id starts with excluded prefixes
        for prefix in excluded_prefixes:
            if message_id.startswith(prefix):
                return False
        
        # INCLUDE: Production-critical issues
        production_critical = {
            # Errors - actual bugs
            'E0401',  # Import error
            'E0602',  # Undefined variable
            'E1101',  # No member
            'E1121',  # Too many function arguments
            'E1123',  # Unexpected keyword argument
            'E1125',  # Missing required argument
            
            # Warnings - potential runtime issues
            'W0101',  # Unreachable code
            'W0102',  # Dangerous default value (BUG!)
            'W0104',  # Pointless statement
            'W0105',  # Pointless string statement
            'W0231',  # Super init not called (inheritance bug)
            'W0611',  # Unused import
            'W0612',  # Unused variable
            'W0613',  # Unused argument
            'W0614',  # Wildcard import
            'W0631',  # Undefined loop variable
            'W1201',  # Logging format string (performance)
            'W1203',  # Lazy logging formatting (performance)
            
            # Refactor - affects performance/maintainability
            'R0901',  # Too many ancestors
            'R0904',  # Too many public methods
            'R0911',  # Too many return statements
            'R0912',  # Too many branches (complexity)
            'R0913',  # Too many arguments (affects calls)
            'R0914',  # Too many local variables
            'R0915',  # Too many statements (code too long)
        }
        
        # Include if in production-critical list
        if message_id in production_critical:
            return True
        
        # Include all error and warning types except conventions
        if issue_type in ['error', 'fatal', 'warning']:
            return True
        
        # Exclude all other types (convention, refactor suggestions, info)
        return False
    
    def _map_pylint_severity(self, pylint_type: str) -> str:
        """Map Pylint message types to severity levels"""
        mapping = {
            'error': 'error',
            'fatal': 'error',
            'warning': 'warning',
            'convention': 'info',
            'refactor': 'info',
            'info': 'info'
        }
        return mapping.get(pylint_type.lower(), 'info')
    
    def _parse_radon_metrics(self, radon_output: Dict, code: str) -> Dict:
        """Parse Radon metrics"""
        lines_of_code = len(code.split('\n'))
        complexity = 1
        maintainability = 100.0
        
        try:
            # Parse cyclomatic complexity
            if radon_output.get('cc'):
                cc_data = json.loads(radon_output['cc'])
                if cc_data:
                    # Get average complexity
                    complexities = []
                    for file_data in cc_data.values():
                        for func in file_data:
                            complexities.append(func.get('complexity', 1))
                    if complexities:
                        complexity = int(sum(complexities) / len(complexities))
            
            # Parse maintainability index
            if radon_output.get('mi'):
                mi_data = json.loads(radon_output['mi'])
                if mi_data:
                    for file_data in mi_data.values():
                        maintainability = file_data.get('mi', 100.0)
                        break
        except Exception as e:
            print(f"Error parsing Radon metrics: {e}")
        
        return {
            "lines_of_code": lines_of_code,
            "complexity": complexity,
            "maintainability": round(maintainability, 2)
        }
    
    def _parse_bandit_issues(self, bandit_output: str) -> List[Dict]:
        """Parse Bandit security issues"""
        vulnerabilities = []
        try:
            bandit_data = json.loads(bandit_output) if bandit_output else {}
            results = bandit_data.get('results', [])
            
            for result in results:
                vulnerabilities.append({
                    "severity": result.get('issue_severity', 'LOW').lower(),
                    "confidence": result.get('issue_confidence', 'LOW'),
                    "line": result.get('line_number', 0),
                    "issue": result.get('issue_text', ''),
                    "cwe": result.get('issue_cwe', {}).get('id', 'N/A')
                })
        except json.JSONDecodeError:
            pass
        
        return vulnerabilities
    
    def _calculate_quality_score(self, issue_count: int, pylint_output: str) -> float:
        """Calculate Code Quality Score (0-100) from Pylint analysis"""
        # Base score starts at 100
        score = 100.0
        
        try:
            pylint_data = json.loads(pylint_output) if pylint_output else []
            
            # Penalize for each severity level
            for issue in pylint_data:
                issue_type = issue.get('type', 'info')
                
                if issue_type == 'error':
                    score -= 10  # Each error: -10
                elif issue_type == 'warning':
                    score -= 5   # Each warning: -5
                elif issue_type == 'refactor':
                    score -= 2   # Each refactor: -2
        except:
            pass
        
        # Ensure score is between 0 and 100
        return max(0, min(100, score))
    
    def _calculate_complexity_score(self, metrics: Dict) -> float:
        """Calculate Complexity Score (0-100) based on code metrics"""
        # Use maintainability index as base (already 0-100 scale)
        maintainability = metrics.get('maintainability', 100)
        
        # Also factor in complexity
        complexity = metrics.get('complexity', 0)
        loc = metrics.get('lines_of_code', 0)
        
        # Penalize high complexity
        complexity_penalty = min(30, complexity * 1.5)  # Max -30 points for complexity
        
        score = maintainability - complexity_penalty
        
        return max(0, min(100, score))
    
    def _calculate_security_score(self, vulnerabilities: List[Dict], bandit_output: str) -> float:
        """Calculate Security Score (0-100) from Bandit analysis"""
        # Start with perfect score
        score = 100.0
        
        try:
            bandit_data = json.loads(bandit_output) if bandit_output else {}
            results = bandit_data.get('results', [])
            
            for result in results:
                severity = result.get('issue_severity', 'LOW').upper()
                confidence = result.get('issue_confidence', 'LOW').upper()
                
                # High severity issues: -20 points each
                if severity == 'HIGH' and confidence in ['HIGH', 'MEDIUM']:
                    score -= 20
                # Medium severity issues: -10 points each
                elif severity == 'MEDIUM' or (severity == 'HIGH' and confidence == 'LOW'):
                    score -= 10
                # Low severity issues: -3 points each
                elif severity == 'LOW':
                    score -= 3
        except:
            pass
        
        # Ensure score is between 0 and 100
        return max(0, min(100, score))
    
    def generate_suggestions(self, metrics: Dict, issues: List[Dict]) -> List[str]:
        """Generate AI-powered suggestions"""
        suggestions = []
        
        # Complexity-based suggestions
        if metrics['complexity'] > 10:
            suggestions.append("High complexity detected. Consider breaking down complex functions into smaller, more manageable ones.")
        
        # Maintainability suggestions
        if metrics['maintainability'] < 60:
            suggestions.append("Low maintainability score. Add docstrings, improve naming, and reduce code duplication.")
        
        # Issue-based suggestions
        error_count = sum(1 for issue in issues if issue['severity'] == 'error')
        if error_count > 5:
            suggestions.append(f"Found {error_count} errors. Prioritize fixing critical errors before refactoring.")
        
        # General best practices
        if metrics['lines_of_code'] > 300:
            suggestions.append("Large file detected. Consider splitting into multiple modules for better organization.")
        
        suggestions.append("Use type hints to improve code clarity and catch type-related bugs early.")
        suggestions.append("Add comprehensive unit tests to ensure code reliability.")
        
        return suggestions
