from app.services.python_analyzer import PythonAnalyzer
from app.services.javascript_analyzer import JavaScriptAnalyzer
from app.services.java_analyzer import JavaAnalyzer
from app.services.deep_scan_service import DeepScanService
from typing import Dict, Any, List

class CodeAnalyzerService:
    """Main service to analyze code based on language"""
    
    def __init__(self):
        self.analyzers = {
            'python': PythonAnalyzer(),
            'javascript': JavaScriptAnalyzer(),
            'java': JavaAnalyzer()
        }
        self.deep_scan_service = DeepScanService()
    
    def analyze_code(
        self,
        code: str,
        language: str,
        security_deep_scan: bool = True,
        performance_hints: bool = True
    ) -> Dict[str, Any]:
        """
        Analyze code and return comprehensive results
        
        Args:
            code: Source code string
            language: Programming language (python, javascript, java)
        
        Returns:
            Dictionary with analysis results
        """
        language = language.lower()
        
        if language not in self.analyzers:
            raise ValueError(f"Unsupported language: {language}. Supported: {list(self.analyzers.keys())}")
        
        analyzer = self.analyzers[language]
        
        # Run analysis
        analysis_result = analyzer.analyze(code)
        deep_scan_result = self.deep_scan_service.scan(code, language)

        merged_issues = list(analysis_result['issues'])
        if security_deep_scan:
            merged_issues.extend(deep_scan_result.get('security_findings', []))
        if performance_hints:
            merged_issues.extend(deep_scan_result.get('performance_hints', []))

        # De-duplicate and normalize IDs
        unique = {}
        for issue in merged_issues:
            key = (
                issue.get('line', 0),
                issue.get('rule', 'unknown'),
                issue.get('message', '')
            )
            if key not in unique:
                unique[key] = issue

        normalized_issues = []
        for idx, issue in enumerate(unique.values(), 1):
            normalized_issue = dict(issue)
            normalized_issue['id'] = idx
            normalized_issues.append(normalized_issue)
        
        # Generate AI suggestions
        suggestions = analyzer.generate_suggestions(
            analysis_result['metrics'],
            normalized_issues
        )

        if security_deep_scan and deep_scan_result.get('security_findings'):
            suggestions.append("Deep security scan found additional risky patterns. Prioritize these before release.")
        if performance_hints and deep_scan_result.get('performance_hints'):
            suggestions.append("Performance hints detected optimization opportunities in loops/data processing paths.")
        
        # Combine results
        security_vulnerabilities = list(analysis_result.get('security_vulnerabilities', []))
        if security_deep_scan:
            security_vulnerabilities.extend(deep_scan_result.get('security_findings', []))

        return {
            "language": language,
            "metrics": analysis_result['metrics'],
            "issues": normalized_issues,
            "suggestions": suggestions,
            "security_vulnerabilities": security_vulnerabilities,
            "security_deep_scan_findings": deep_scan_result.get('security_findings', []) if security_deep_scan else [],
            "dependency_advisories": deep_scan_result.get('dependency_advisories', []) if security_deep_scan else [],
            "performance_hints": deep_scan_result.get('performance_hints', []) if performance_hints else [],
            "scores": analysis_result.get('scores', {
                "quality": 100.0,
                "complexity": 100.0,
                "security": 100.0,
                "final": 100.0
            })
        }

    def analyze_batch(
        self,
        files: List[Dict[str, str]],
        security_deep_scan: bool = True,
        performance_hints: bool = True
    ) -> Dict[str, Any]:
        """Analyze multiple files and return summary with worst offenders."""
        file_results = []
        score_totals = {
            "quality": 0.0,
            "complexity": 0.0,
            "security": 0.0,
            "final": 0.0
        }

        for file_item in files:
            file_name = file_item.get("file_name", "unknown")
            code = file_item.get("code", "")
            language = (file_item.get("language", "") or "").lower()

            if not code.strip():
                continue
            if language not in self.analyzers:
                continue

            result = self.analyze_code(
                code=code,
                language=language,
                security_deep_scan=security_deep_scan,
                performance_hints=performance_hints
            )

            issue_count = len(result.get("issues", []))
            security_alerts = len(result.get("security_deep_scan_findings", [])) + len(result.get("security_vulnerabilities", []))
            scores = result.get("scores", {})
            quality_score = float(scores.get("quality", 100.0))
            complexity_score = float(scores.get("complexity", 100.0))
            security_score = float(scores.get("security", 100.0))
            final_score = float(scores.get("final", 0.0))
            score_totals["quality"] += quality_score
            score_totals["complexity"] += complexity_score
            score_totals["security"] += security_score
            score_totals["final"] += final_score
            metrics = result.get("metrics", {})
            lines_of_code = metrics.get("lines_of_code", 0)
            complexity = metrics.get("complexity", 0)
            maintainability = metrics.get("maintainability", 0)
            offender_score = (issue_count * 2) + security_alerts + max(0, 100 - final_score) / 10

            file_results.append({
                "file_name": file_name,
                "language": language,
                "result": result,
                "summary": {
                    "issue_count": issue_count,
                    "security_alerts": security_alerts,
                    "final_score": round(final_score, 1),
                    "lines_of_code": lines_of_code,
                    "complexity": complexity,
                    "maintainability": round(maintainability, 1) if isinstance(maintainability, (int, float)) else maintainability,
                    "offender_score": round(offender_score, 2)
                }
            })

        total_files = len(file_results)
        total_issues = sum(item["summary"]["issue_count"] for item in file_results)
        avg_score = round(score_totals["final"] / total_files, 1) if total_files else 0.0
        avg_quality = round(score_totals["quality"] / total_files, 1) if total_files else 0.0
        avg_complexity = round(score_totals["complexity"] / total_files, 1) if total_files else 0.0
        avg_security = round(score_totals["security"] / total_files, 1) if total_files else 0.0

        worst_offenders = sorted(
            [
                {
                    "file_name": item["file_name"],
                    "language": item["language"],
                    "issue_count": item["summary"]["issue_count"],
                    "security_alerts": item["summary"]["security_alerts"],
                    "final_score": item["summary"]["final_score"],
                    "offender_score": item["summary"]["offender_score"]
                }
                for item in file_results
            ],
            key=lambda item: item["offender_score"],
            reverse=True
        )[:5]

        return {
            "mode": "batch",
            "summary": {
                "total_files": total_files,
                "total_issues": total_issues,
                "average_score": avg_score,
                "average_quality_score": avg_quality,
                "average_complexity_score": avg_complexity,
                "average_security_score": avg_security
            },
            "files": file_results,
            "worst_offenders": worst_offenders
        }
