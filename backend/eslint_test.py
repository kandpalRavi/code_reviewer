import subprocess, os, json

os.chdir(r"C:\Users\Ravindra Kandpal\Desktop\code_reviewer\backend")
eslint_bin = os.path.join(os.getcwd(), 'node_modules', '.bin', 'eslint.cmd')

# Simulate EXACTLY what javascript_analyzer.py does
code = """// 🚩 Error 1: 'var' used instead of 'const' (no-var)
var secret_key = "12345-DEBUG"
const createErrorTracker = (target) => {
  let handler = {
    get(obj, prop) {
      const value = obj[prop];
      if (typeof value == 'function') {
        return (...args) => {
          try {
            eval("console.log('Intercepting call to " + prop + "')");
            return value.apply(obj, args);
          } catch (err) {
            const prop = "Error Context";
            console.error(prop, err);
            throw err;
          }
        };
      }
      return value;
    }
  };
  return new Proxy(target, handler);
};
class data_service {
  process(input) {
    if (input === undefined)
      return "No data";
    return input;
  }
  helper(unusedParam) {
    debugger;
    return true;
  }
}


const service = createErrorTracker(new data_service());
"""

# Exactly as javascript_analyzer.py does it
backend_dir = os.getcwd()
temp_file = os.path.join(backend_dir, "temp_analysis_eslint.js")
with open(temp_file, 'w', encoding='utf-8') as f:
    f.write(code)

result = subprocess.run(
    [eslint_bin, temp_file, '--format=json'],
    capture_output=True,
    encoding='utf-8',   # <-- this is what analyzer uses
    errors='replace',   # <-- this is what analyzer uses
    timeout=15,
    cwd=backend_dir
)

print("returncode:", result.returncode)
print("stdout length:", len(result.stdout))
print("stderr:", result.stderr[:200])

if result.stdout:
    try:
        eslint_data = json.loads(result.stdout)
        issues = []
        for file_result in eslint_data:
            for message in file_result.get('messages', [])[:20]:  # EXACT copy of analyzer code
                severity = 'error' if message.get('severity') == 2 else 'warning'
                issues.append({
                    "id": len(issues) + 1,
                    "severity": severity,
                    "line": message.get('line', 0),
                    "message": message.get('message', ''),
                    "rule": message.get('ruleId', 'unknown')
                })
        print(f"\nIssues found: {len(issues)}")
        for i in issues:
            print(f"  {i}")
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        print("First 500 chars of stdout:", result.stdout[:500])

if os.path.exists(temp_file):
    os.remove(temp_file)
