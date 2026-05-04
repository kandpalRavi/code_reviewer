import re
from typing import Dict, List


class DeepScanService:
    """Security deep scan and performance hint detector."""

    def scan(self, code: str, language: str) -> Dict[str, List[Dict]]:
        language = (language or "").lower()
        security_findings = self._security_pattern_checks(code, language)
        dependency_advisories = self._dependency_advisories(code, language)
        performance_hints = self._performance_hints(code, language)

        return {
            "security_findings": security_findings,
            "dependency_advisories": dependency_advisories,
            "performance_hints": performance_hints,
        }

    def _security_pattern_checks(self, code: str, language: str) -> List[Dict]:
        findings: List[Dict] = []
        lines = code.split("\n")

        secret_regex = re.compile(
            r"(api[_-]?key|secret|token|password|passwd|private[_-]?key)\s*[:=]\s*['\"][^'\"]{8,}['\"]",
            re.IGNORECASE,
        )
        for idx, line in enumerate(lines, 1):
            if secret_regex.search(line):
                findings.append({
                    "severity": "critical",
                    "line": idx,
                    "message": "Potential hardcoded secret detected. Move sensitive values to env/config.",
                    "rule": "deep-hardcoded-secret",
                })

        risky_patterns = [
            (r"\beval\s*\(", "error", "Dynamic code execution via eval() is unsafe.", "deep-eval-usage"),
            (r"Runtime\.getRuntime\(\)\.exec|ProcessBuilder\s*\(", "error", "Command execution detected. Validate all input and avoid shell interpretation.", "deep-command-exec"),
            (r"ObjectInputStream|pickle\.loads|yaml\.load\s*\(", "error", "Deserialization of untrusted input can lead to code execution.", "deep-insecure-deserialization"),
            (r"SELECT\s+.*\+|INSERT\s+.*\+|UPDATE\s+.*\+", "error", "String concatenation in SQL detected. Use parameterized queries.", "deep-sql-concat"),
        ]

        for idx, line in enumerate(lines, 1):
            for pattern, severity, message, rule in risky_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    findings.append({
                        "severity": severity,
                        "line": idx,
                        "message": message,
                        "rule": rule,
                    })

        # Language-specific quick checks
        if language == "javascript":
            for idx, line in enumerate(lines, 1):
                if "innerHTML" in line and "=" in line:
                    findings.append({
                        "severity": "warning",
                        "line": idx,
                        "message": "Direct innerHTML assignment may allow XSS. Prefer safe DOM APIs/sanitization.",
                        "rule": "deep-dom-xss-risk",
                    })

        return findings[:30]

    def _dependency_advisories(self, code: str, language: str) -> List[Dict]:
        advisories: List[Dict] = []

        # Lightweight code-reference advisories (without lockfile resolution)
        package_patterns = [
            (r"node-serialize", "high", "Known unsafe serialization package usage referenced."),
            (r"serialize-javascript", "medium", "Historical XSS issues in older versions; verify latest patched release."),
            (r"\bvm2\b", "high", "Sandbox escape CVEs exist in older vm2 versions; keep fully patched."),
            (r"log4j", "high", "Ensure Log4j version is patched (Log4Shell class vulnerabilities)."),
            (r"pyyaml", "medium", "Use safe loader (yaml.safe_load) and keep PyYAML patched."),
        ]

        for pattern, severity, message in package_patterns:
            if re.search(pattern, code, re.IGNORECASE):
                advisories.append({
                    "severity": severity,
                    "package_hint": pattern.replace("\\b", ""),
                    "message": message,
                    "rule": "dependency-advisory",
                })

        if language in {"python", "javascript", "java"} and not advisories:
            advisories.append({
                "severity": "info",
                "package_hint": "manifest-scan",
                "message": "No explicit risky package references found in code snippet. For full dependency advisories, scan lockfiles/manifests.",
                "rule": "dependency-advisory-info",
            })

        return advisories[:10]

    def _performance_hints(self, code: str, language: str) -> List[Dict]:
        hints: List[Dict] = []
        lines = code.split("\n")

        loop_occurrences = len(re.findall(r"\b(for|while)\b", code))
        if loop_occurrences >= 3:
            hints.append({
                "severity": "warning",
                "line": 1,
                "message": "Multiple loop constructs detected (>=3). Check for O(n^2)/O(n^3) hotspots and optimize.",
                "rule": "perf-nested-loops",
            })

        for idx, line in enumerate(lines, 1):
            if re.search(r"\.append\(|\+\=", line) and re.search(r"\bfor\b|\bwhile\b", line):
                hints.append({
                    "severity": "info",
                    "line": idx,
                    "message": "Repeated accumulation inside loop can be expensive for large inputs.",
                    "rule": "perf-loop-accumulation",
                })

            if re.search(r"JSON\.parse\(|json\.loads\(", line) and re.search(r"\bfor\b|\bwhile\b", line):
                hints.append({
                    "severity": "warning",
                    "line": idx,
                    "message": "Parsing JSON inside loop detected. Parse once outside loop if possible.",
                    "rule": "perf-redundant-parse",
                })

            if language == "javascript" and ".filter(" in line and ".map(" in line:
                hints.append({
                    "severity": "info",
                    "line": idx,
                    "message": "Chained array operations can create intermediate arrays; consider a single pass for large datasets.",
                    "rule": "perf-array-chaining",
                })

        return hints[:20]
