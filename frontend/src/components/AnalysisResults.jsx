import { motion } from 'framer-motion'
import { FaBug, FaExclamationTriangle, FaInfoCircle, FaLightbulb, FaChartLine, FaChevronDown, FaShieldAlt, FaCode, FaCubes, FaDownload, FaFileCode, FaFileAlt, FaFilePdf } from 'react-icons/fa'
import MetricsChart from './MetricsChart'
import AdvancedVisualizations from './AdvancedVisualizations'
import { useState } from 'react'

// ── Score colour helpers ──────────────────────────────────────────────────────
function scoreColor(score) {
  if (score >= 80) return { text: 'text-emerald-600', bg: 'from-emerald-400 to-green-500',  ring: '#10b981', label: 'Excellent' }
  if (score >= 60) return { text: 'text-yellow-600', bg: 'from-yellow-400 to-amber-500',   ring: '#f59e0b', label: 'Good'      }
  if (score >= 40) return { text: 'text-orange-600', bg: 'from-orange-400 to-orange-500',  ring: '#f97316', label: 'Fair'      }
  return               { text: 'text-red-600',     bg: 'from-red-400 to-rose-600',        ring: '#ef4444', label: 'Poor'      }
}

// ── Animated SVG ring ────────────────────────────────────────────────────────
function ScoreRing({ score, size = 96, strokeWidth = 8, color }) {
  const r   = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const pct  = Math.min(100, Math.max(0, score))

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {/* track */}
      <circle cx={size/2} cy={size/2} r={r}
        fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
      {/* progress */}
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - (pct / 100) * circ }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  )
}

// ── Individual score pill ────────────────────────────────────────────────────
function ScorePill({ label, tool, score, icon: Icon }) {
  const c = scoreColor(score)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-1 min-w-[130px]"
    >
      <div className="relative flex items-center justify-center">
        <ScoreRing score={score} color={c.ring} />
        <div className="absolute flex flex-col items-center">
          <span className={`text-xl font-black ${c.text}`}>{Math.round(score)}</span>
        </div>
      </div>
      <div className="text-center">
        <p className="font-bold text-gray-800 text-sm">{label}</p>
        <p className="text-xs text-gray-400">{tool}</p>
        <span className={`text-xs font-semibold ${c.text}`}>{c.label}</span>
      </div>
    </motion.div>
  )
}

// ── Final Score banner ───────────────────────────────────────────────────────
function FinalScoreBanner({ scores }) {
  const final   = scores?.final    ?? 0
  const quality = scores?.quality  ?? 0
  const complex = scores?.complexity ?? 0
  const security= scores?.security ?? 0
  const c = scoreColor(final)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card border-0 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1e3a5f 100%)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-white/10 rounded-xl p-2.5">
          <FaChartLine className="text-white text-xl" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Combined Analysis Score</h2>
          <p className="text-slate-400 text-xs">Pylint · Radon · Bandit  —  Final = (Quality + Complexity + Security) / 3</p>
        </div>
      </div>

      {/* Score grid */}
      <div className="flex flex-wrap gap-4 items-center justify-center">

        {/* Three individual scores */}
        <ScorePill label="Code Quality"  tool="Pylint"  score={quality}  icon={FaCode}     />
        <ScorePill label="Complexity"    tool="Radon"   score={complex}  icon={FaCubes}    />
        <ScorePill label="Security"      tool="Bandit"  score={security} icon={FaShieldAlt}/>

        {/* Arrow */}
        <div className="text-slate-400 text-2xl font-bold px-1 hidden sm:block">→</div>

        {/* Final score – bigger ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex flex-col items-center gap-2 bg-white/10 backdrop-blur rounded-2xl p-5 min-w-[150px]"
        >
          <div className="relative flex items-center justify-center">
            <ScoreRing score={final} size={112} strokeWidth={10} color={c.ring} />
            <div className="absolute flex flex-col items-center">
              <span className={`text-3xl font-black ${c.text}`}>{Math.round(final)}</span>
              <span className="text-white/50 text-[10px]">/100</span>
            </div>
          </div>
          <div className="text-center">
            <p className="font-bold text-white text-sm">Final Score</p>
            <span className={`text-xs font-semibold ${c.text}`}>{c.label}</span>
          </div>
        </motion.div>
      </div>

      {/* Breakdown bar */}
      <div className="mt-6 space-y-2">
        {[
          { label: 'Quality',    val: quality,  color: '#6366f1' },
          { label: 'Complexity', val: complex,  color: '#8b5cf6' },
          { label: 'Security',   val: security, color: '#ec4899' },
        ].map(({ label, val, color }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="text-slate-400 text-xs w-20 text-right">{label}</span>
            <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: `${val}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
            <span className="text-white text-xs font-semibold w-8">{Math.round(val)}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

const severityConfig = {
  error: {
    icon: FaBug,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-800',
  },
  warning: {
    icon: FaExclamationTriangle,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-800',
  },
  info: {
    icon: FaInfoCircle,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800',
  },
}

const ruleInfo = {
  // Pylint Convention Rules (C)
  'C0103': {
    ruleName: 'Invalid Name',
    tool: 'Pylint',
    category: 'Convention',
    meaning: 'Variable/function name doesn\'t match naming convention (should be lowercase_with_underscores)'
  },
  'C0114': {
    ruleName: 'Missing Module Docstring',
    tool: 'Pylint',
    category: 'Convention',
    meaning: 'Module file is missing a docstring at the top describing its purpose'
  },
  'C0115': {
    ruleName: 'Missing Class Docstring',
    tool: 'Pylint',
    category: 'Convention',
    meaning: 'Class definition is missing a docstring explaining what it does'
  },
  'C0116': {
    ruleName: 'Missing Function Docstring',
    tool: 'Pylint',
    category: 'Convention',
    meaning: 'Function is missing a docstring explaining its purpose and parameters'
  },
  'C0301': {
    ruleName: 'Line Too Long',
    tool: 'Pylint',
    category: 'Convention',
    meaning: 'Line exceeds maximum length (usually 100 chars). Break into multiple lines'
  },
  'C0302': {
    ruleName: 'Too Many Lines',
    tool: 'Pylint',
    category: 'Convention',
    meaning: 'Module has too many lines (usually > 1000). Consider splitting into smaller files'
  },
  'C0303': {
    ruleName: 'Trailing Whitespace',
    tool: 'Pylint',
    category: 'Convention',
    meaning: 'Line has unnecessary spaces/tabs at the end. C=Convention, 03=Style'
  },
  'C0304': {
    ruleName: 'Missing Final Newline',
    tool: 'Pylint',
    category: 'Convention',
    meaning: 'File should end with a newline character'
  },
  'C0305': {
    ruleName: 'Trailing Newlines',
    tool: 'Pylint',
    category: 'Convention',
    meaning: 'Too many blank lines at end of file'
  },
  'C0325': {
    ruleName: 'Unnecessary Parens',
    tool: 'Pylint',
    category: 'Convention',
    meaning: 'Unnecessary parentheses around expression can be removed'
  },
  
  // Pylint Refactor Rules (R)
  'R0901': {
    ruleName: 'Too Many Ancestors',
    tool: 'Pylint',
    category: 'Refactor',
    meaning: 'Class has too many parent classes. Consider simplifying inheritance hierarchy'
  },
  'R0902': {
    ruleName: 'Too Many Instance Attributes',
    tool: 'Pylint',
    category: 'Refactor',
    meaning: 'Class has too many attributes (usually > 7). Consider breaking into smaller classes'
  },
  'R0903': {
    ruleName: 'Too Few Public Methods',
    tool: 'Pylint',
    category: 'Refactor',
    meaning: 'Class should define at least some public methods. Maybe use a dict/tuple instead'
  },
  'R0904': {
    ruleName: 'Too Many Public Methods',
    tool: 'Pylint',
    category: 'Refactor',
    meaning: 'Class has too many public methods (usually > 20). Consider breaking into multiple classes'
  },
  'R0911': {
    ruleName: 'Too Many Return Statements',
    tool: 'Pylint',
    category: 'Refactor',
    meaning: 'Function has too many return statements. Use early returns or restructure logic'
  },
  'R0912': {
    ruleName: 'Too Many Branches',
    tool: 'Pylint',
    category: 'Refactor',
    meaning: 'Function has too many if/elif branches. Extract conditions into helper functions'
  },
  'R0913': {
    ruleName: 'Too Many Arguments',
    tool: 'Pylint',
    category: 'Refactor',
    meaning: 'Function has too many parameters (usually > 5). Use a class or dict to group related params'
  },
  'R0914': {
    ruleName: 'Too Many Local Variables',
    tool: 'Pylint',
    category: 'Refactor',
    meaning: 'Function has too many local variables (usually > 15). Break into smaller functions'
  },
  'R0915': {
    ruleName: 'Too Many Statements',
    tool: 'Pylint',
    category: 'Refactor',
    meaning: 'Function is too long (usually > 50 lines). Extract into helper functions'
  },
  
  // Pylint Warning Rules (W)
  'W0101': {
    ruleName: 'Unreachable Code',
    tool: 'Pylint',
    category: 'Warning',
    meaning: 'Code after return/raise/break can never be executed. Remove or fix control flow'
  },
  'W0102': {
    ruleName: 'Dangerous Default Value',
    tool: 'Pylint',
    category: 'Warning',
    meaning: 'Using mutable default (list/dict) can cause bugs. Use None and create new instance'
  },
  'W0104': {
    ruleName: 'Pointless Statement',
    tool: 'Pylint',
    category: 'Warning',
    meaning: 'Statement has no effect. Remove or assign the result to a variable'
  },
  'W0105': {
    ruleName: 'Pointless String Statement',
    tool: 'Pylint',
    category: 'Warning',
    meaning: 'String literal on its own line has no effect (unless it\'s a docstring)'
  },
  'W1203': {
    ruleName: 'Lazy Formatting in Logging',
    tool: 'Pylint',
    category: 'Warning',
    meaning: 'Use lazy % formatting. Don\'t use f-strings or .format() in logging - let the logger do it'
  },
  'W1201': {
    ruleName: 'Logging Format String',
    tool: 'Pylint',
    category: 'Warning',
    meaning: 'Logging takes string formatting. Perform formatting in the logger call, not before'
  },
  'W0231': {
    ruleName: 'Super Init Not Called',
    tool: 'Pylint',
    category: 'Warning',
    meaning: '__init__ method doesn\'t call super().__init__(). Parent initialization may be skipped'
  },
  'W0612': {
    ruleName: 'Unused Variable',
    tool: 'Pylint',
    category: 'Warning',
    meaning: 'Variable is assigned but never used. Delete it or use an underscore (_) prefix'
  },
  'W0613': {
    ruleName: 'Unused Argument',
    tool: 'Pylint',
    category: 'Warning',
    meaning: 'Function argument is never used. Remove it or prefix with underscore'
  },
  'W0614': {
    ruleName: 'Unused Wildcard Import',
    tool: 'Pylint',
    category: 'Warning',
    meaning: 'from module import * makes it unclear what\'s imported. Use explicit imports'
  },
  'W0631': {
    ruleName: 'Undefined Loop Variable',
    tool: 'Pylint',
    category: 'Warning',
    meaning: 'Variable used outside loop that defined it. Loop might not execute'
  },
  'W1113': {
    ruleName: 'Unnecessary Pass Statement',
    tool: 'Pylint',
    category: 'Warning',
    meaning: 'Pass statement is not needed here. Remove it'
  },

  // Pylint Error Rules (E)
  'E0401': {
    ruleName: 'Import Error',
    tool: 'Pylint',
    category: 'Error',
    meaning: 'Module/package cannot be imported. Check if it\'s installed or typo in name'
  },
  'E0602': {
    ruleName: 'Undefined Variable',
    tool: 'Pylint',
    category: 'Error',
    meaning: 'Variable is used but never defined. Define it before using or check for typos'
  },
  'E1101': {
    ruleName: 'No Member',
    tool: 'Pylint',
    category: 'Error',
    meaning: 'Object has no attribute/method. Check spelling or object type'
  },
  'E1121': {
    ruleName: 'Too Many Function Arguments',
    tool: 'Pylint',
    category: 'Error',
    meaning: 'Function called with too many arguments. Check function signature'
  },
  'E1123': {
    ruleName: 'Unexpected Keyword Argument',
    tool: 'Pylint',
    category: 'Error',
    meaning: 'Function doesn\'t accept this keyword argument. Check spelling or function definition'
  },
  'E1125': {
    ruleName: 'Missing Required Argument',
    tool: 'Pylint',
    category: 'Error',
    meaning: 'Function called with missing required argument. Add it'
  },

  // ESLint Rules (JavaScript)
  'no-undef': {
    ruleName: 'Undefined Variable',
    tool: 'ESLint',
    category: 'Error',
    meaning: 'Variable is used without being declared or imported. Causes ReferenceError'
  },
  'no-unused-vars': {
    ruleName: 'Unused Variable',
    tool: 'ESLint',
    category: 'Warning',
    meaning: 'Variable is declared but never used. Remove it or prefix with _'
  },
  'no-var': {
    ruleName: 'No var Keyword',
    tool: 'ESLint',
    category: 'Best Practice',
    meaning: 'Avoid var. Use let for mutable, const for immutable. Better scoping and safety'
  },
  'prefer-const': {
    ruleName: 'Prefer Const',
    tool: 'ESLint',
    category: 'Best Practice',
    meaning: 'Variable never reassigned. Use const instead of let for clarity'
  },
  'eqeqeq': {
    ruleName: 'Strict Equality',
    tool: 'ESLint',
    category: 'Best Practice',
    meaning: 'Use === instead of ==. Avoids type coercion bugs like "5" == 5 being true'
  },
  'no-console': {
    ruleName: 'No Console',
    tool: 'ESLint',
    category: 'Best Practice',
    meaning: 'Remove console.log from production. Use proper logging library'
  },
  'no-constant-condition': {
    ruleName: 'No Constant Condition',
    tool: 'ESLint',
    category: 'Error',
    meaning: 'Condition is always true/false. Use proper conditional logic'
  },
  'no-empty': {
    ruleName: 'No Empty Block',
    tool: 'ESLint',
    category: 'Error',
    meaning: 'Empty block statement (if/catch/etc). Add code or remove the block'
  },
  'no-extra-boolean-cast': {
    ruleName: 'Unnecessary Boolean Cast',
    tool: 'ESLint',
    category: 'Warning',
    meaning: 'Using !!expr or Boolean(expr) unnecessarily. Already boolean'
  },
  'no-extra-semi': {
    ruleName: 'Extra Semicolon',
    tool: 'ESLint',
    category: 'Warning',
    meaning: 'Unnecessary semicolon. Remove it'
  },
  'no-func-assign': {
    ruleName: 'Function Assignment',
    tool: 'ESLint',
    category: 'Error',
    meaning: 'Function is being reassigned like a variable. Use function declaration'
  },
  'no-irregular-whitespace': {
    ruleName: 'Irregular Whitespace',
    tool: 'ESLint',
    category: 'Error',
    meaning: 'Contains irregular whitespace characters that may cause issues'
  },
  'no-unreachable': {
    ruleName: 'Unreachable Code',
    tool: 'ESLint',
    category: 'Error',
    meaning: 'Code after return/throw/break/continue is unreachable. Remove it'
  },
  'curly': {
    ruleName: 'Require Curly Braces',
    tool: 'ESLint',
    category: 'Best Practice',
    meaning: 'if/else/for/while should use curly braces for clarity and safety'
  },
  'no-const-assign': {
    ruleName: 'Const Reassignment',
    tool: 'ESLint',
    category: 'Error',
    meaning: 'Attempting to reassign a const variable. Use let for mutable vars'
  },
  'indent': {
    ruleName: 'Indentation',
    tool: 'ESLint',
    category: 'Style',
    meaning: 'Incorrect indentation. Use consistent spaces (usually 2 or 4)'
  },
  'key-spacing': {
    ruleName: 'Key Spacing',
    tool: 'ESLint',
    category: 'Style',
    meaning: 'Inconsistent spacing around colons in object properties'
  },
  'max-len': {
    ruleName: 'Line Too Long',
    tool: 'ESLint',
    category: 'Style',
    meaning: 'Line exceeds maximum length. Break into multiple lines'
  },
  'semi': {
    ruleName: 'Semicolon',
    tool: 'ESLint',
    category: 'Style',
    meaning: 'Missing or extra semicolon. Maintain consistent style'
  },
  'no-eval': {
    ruleName: 'No eval()',
    tool: 'ESLint',
    category: 'Security',
    meaning: 'eval() executes strings as code. MASSIVE SECURITY RISK. Use JSON.parse for data or Function constructor with caution'
  },
  'no-shadow': {
    ruleName: 'No Variable Shadowing',
    tool: 'ESLint',
    category: 'Best Practice',
    meaning: 'Variable redeclared in inner scope shadows outer variable. Confusing and bug-prone'
  },
  'camelcase': {
    ruleName: 'Naming Convention',
    tool: 'ESLint',
    category: 'Style',
    meaning: 'Variable/function should use camelCase (not snake_case). Classes use PascalCase'
  },
  'no-debugger': {
    ruleName: 'No Debugger',
    tool: 'ESLint',
    category: 'Error',
    meaning: 'debugger statement left in code. Will freeze browser in production'
  },
  'no-multiple-empty-lines': {
    ruleName: 'No Multiple Empty Lines',
    tool: 'ESLint',
    category: 'Style',
    meaning: 'Too many consecutive blank lines. Keep code compact and readable'
  },
  'semi': {
    ruleName: 'Missing Semicolon',
    tool: 'ESLint',
    category: 'Style',
    meaning: 'Statement is missing a semicolon. JavaScript uses semicolons to terminate statements'
  },
  'no-constant-condition': {
    ruleName: 'No Constant Condition',
    tool: 'ESLint',
    category: 'Error',
    meaning: 'Condition is always true or always false. Likely a logic bug or dead code'
  },
  'no-irregular-whitespace': {
    ruleName: 'Irregular Whitespace',
    tool: 'ESLint',
    category: 'Warning',
    meaning: 'Line contains unusual whitespace characters (non-breaking space etc.) that may cause encoding issues'
  },
  'B101': {
    ruleName: 'Assert Used',
    tool: 'Bandit',
    category: 'Security',
    meaning: 'assert used for production validation. Use proper error handling'
  },
  'B303': {
    ruleName: 'Use of Insecure MD2, MD4, or MD5',
    tool: 'Bandit',
    category: 'Security',
    meaning: 'MD5 is cryptographically broken. Use SHA256 or better'
  },
  'B322': {
    ruleName: 'Temporary File Insecure',
    tool: 'Bandit',
    category: 'Security',
    meaning: 'Temporary file creation is insecure. Use tempfile.NamedTemporaryFile'
  },
  'B602': {
    ruleName: 'Shell Injection',
    tool: 'Bandit',
    category: 'Security',
    meaning: 'Shell=True is dangerous. Sanitize input or use shell=False'
  },
  'B607': {
    ruleName: 'Partial Path Traversal',
    tool: 'Bandit',
    category: 'Security',
    meaning: 'Potential path traversal vulnerability. Validate file paths'
  },
  
  // Java CheckStyle/Custom Rules
  'avoid-system-out': {
    ruleName: 'Avoid System.out',
    tool: 'Java Analyzer',
    category: 'Best Practice',
    meaning: 'System.out.print should not be used in production. Use proper logging framework'
  },
  'sql-injection': {
    ruleName: 'SQL Injection Risk',
    tool: 'Java Analyzer',
    category: 'Security',
    meaning: 'SQL query built with string concatenation. Use PreparedStatement with parameters'
  },
  'hardcoded-secret': {
    ruleName: 'Hardcoded Secret',
    tool: 'Java Analyzer',
    category: 'Security',
    meaning: 'Credentials or secrets hardcoded in source. Store in environment variables or config files'
  },
  'string-comparison': {
    ruleName: 'String Equality Comparison',
    tool: 'Java Analyzer',
    category: 'Error',
    meaning: 'Using == to compare Strings instead of .equals(). This compares object references, not values'
  },
  'empty-catch': {
    ruleName: 'Empty Catch Block',
    tool: 'Java Analyzer',
    category: 'Error',
    meaning: 'Catch block swallows exception silently. Either handle it or log it for debugging'
  },
  'null-pointer-risk': {
    ruleName: 'Potential NullPointerException',
    tool: 'Java Analyzer',
    category: 'Warning',
    meaning: 'Method call on potentially null object. Add null check or use Optional'
  },
  'avoid-wildcard-imports': {
    ruleName: 'Wildcard Imports',
    tool: 'Java Analyzer',
    category: 'Best Practice',
    meaning: 'Using import * is unclear and can cause name conflicts. Import specific classes'
  },
  'missing-javadoc': {
    ruleName: 'Missing Javadoc',
    tool: 'Java Analyzer',
    category: 'Documentation',
    meaning: 'Public methods and classes should have Javadoc comments explaining their purpose'
  },
  'unused-import': {
    ruleName: 'Unused Import',
    tool: 'Java Analyzer',
    category: 'Warning',
    meaning: 'Import statement for class that is never used. Remove for cleaner code'
  },
  'magic-number': {
    ruleName: 'Magic Number',
    tool: 'Java Analyzer',
    category: 'Warning',
    meaning: 'Hardcoded number without explanation. Define as named constant for readability'
  },
  'insecure-deserialization': {
    ruleName: 'Insecure Deserialization',
    tool: 'Java Analyzer',
    category: 'Security',
    meaning: 'ObjectInputStream can deserialize malicious objects. Validate all deserialized data'
  },
  'command-injection': {
    ruleName: 'Command Injection Risk',
    tool: 'Java Analyzer',
    category: 'Security',
    meaning: 'Runtime.exec() or ProcessBuilder with unsanitized input. Leads to RCE vulnerability'
  }
}

const issueDetails = {
  // Common Issues
  'trailing-whitespace': {
    title: 'Trailing Whitespace',
    description: 'Unnecessary whitespace at the end of a line',
    impact: 'Can cause inconsistencies in version control and make diffs harder to read',
    fix: 'Remove extra spaces/tabs at the end of lines. Use an editor that strips trailing whitespace automatically.',
    example: `Before: "const x = 5;   " (spaces at end)
After:  "const x = 5;"`,
    severity_reason: 'Low - mainly a code style issue'
  },
  'no-undef': {
    title: 'Undefined Variable',
    description: 'Variable is used before being defined',
    impact: 'Will cause a runtime error when the code executes',
    fix: 'Define the variable before using it, or check if it\'s imported from another module',
    example: `Before: console.log(myVar);  // ❌ ReferenceError
After:  const myVar = 5; console.log(myVar); // ✅ Works`,
    severity_reason: 'High - will break code execution'
  },
  'complexity': {
    title: 'High Function Complexity',
    description: 'Function has too many conditional branches or is too complex',
    impact: 'Hard to understand, test, and maintain. More prone to bugs',
    fix: 'Break the function into smaller, single-purpose functions following the Single Responsibility Principle',
    example: `Before: function processData(x) { if(...) { if(...) { if(...) { ... } } } }
After:  function processA() { } function processB() { } // Smaller functions`,
    severity_reason: 'Medium - affects maintainability'
  },
  'prefer-const': {
    title: 'Use const Instead of let',
    description: 'Variable declared with let but never reassigned',
    impact: 'Using const makes intent clearer and prevents accidental reassignment',
    fix: 'Replace let with const for variables that are not reassigned',
    example: `Before: let name = "John"; // Never changes
After:  const name = "John"; // Clear intent`,
    severity_reason: 'Low - best practice suggestion'
  },
  'no-var': {
    title: 'Avoid var Keyword',
    description: 'Variable declared with var instead of let/const',
    impact: 'var has function scope (confusing), let/const have block scope (more predictable)',
    fix: 'Replace var with let or const. Use const by default, let if reassignment is needed',
    example: `Before: var x = 5; // Function scope - confusing
After:  const x = 5; // Block scope - clear`,
    severity_reason: 'Medium - old JavaScript pattern'
  },
  'eqeqeq': {
    title: 'Use Strict Equality (===)',
    description: 'Using == instead of === for comparison',
    impact: 'Type coercion can lead to unexpected results (e.g., "5" == 5 is true)',
    fix: 'Replace == with === and != with !== for predictable comparisons',
    example: `Before: if (x == 5) { } // Type coercion!
After:  if (x === 5) { } // Strict comparison`,
    severity_reason: 'Medium - can cause subtle bugs'
  },
  'no-console': {
    title: 'console.log in Production Code',
    description: 'Debug console statements left in production code',
    impact: 'Creates performance overhead and exposes internal logic in browser console',
    fix: 'Remove console statements or replace with proper logging library',
    example: `Before: console.log(userData); // Visible in browser
After:  logger.debug(userData); // Proper logging`,
    severity_reason: 'Medium - production readiness'
  },
  'unused-import': {
    title: 'Unused Import Statement',
    description: 'Module imported but never used in the code',
    impact: 'Increases bundle size and makes code harder to understand',
    fix: 'Remove the unused import statement',
    example: `Before: import os from "os"; // Never used
After:  // Removed`,
    severity_reason: 'Low - cleaner code'
  },
  'missing-docstring': {
    title: 'Missing Documentation',
    description: 'Function or class without proper documentation',
    impact: 'Others (and you) won\'t understand what this code does or how to use it',
    fix: 'Add docstrings/comments explaining the function purpose and parameters',
    example: `Before: def process(x): return x * 2
After:  def process(x): """Doubles the input value""" return x * 2`,
    severity_reason: 'Low - maintainability'
  },

  // Python Pylint Warnings (W)
  'unused-variable': {
    title: 'Unused Variable',
    description: 'Variable is assigned but never used in the code',
    impact: 'Wastes memory and makes code harder to understand. Often indicates incomplete refactoring',
    fix: 'Remove the variable assignment or use it. If intentionally unused, prefix with underscore (_)',
    example: `Before: result = calculate()  # Never used
       return "done"
After:  return "done"  # Or: _ = calculate()`,
    severity_reason: 'Low - code cleanliness'
  },
  'unused-argument': {
    title: 'Unused Function Argument',
    description: 'Function parameter is never used in the function body',
    impact: 'Confusing API and may indicate incomplete implementation',
    fix: 'Remove the parameter or use it. If needed for compatibility, prefix with underscore',
    example: `Before: def process(data, unused): return len(data)
After:  def process(data, _unused): return len(data)
       # Or: def process(data): return len(data)`,
    severity_reason: 'Low - API clarity'
  },
  'unreachable-code': {
    title: 'Unreachable Code',
    description: 'Code after return, break, raise, or continue cannot be executed',
    impact: 'Dead code wastes space and indicates logic errors',
    fix: 'Remove unreachable code or restructure control flow',
    example: `Before: def foo():
           return 5
           print("Never runs")  # Unreachable
After:  def foo():
           print("Will run")
           return 5`,
    severity_reason: 'Medium - logic error'
  },
  'W1203': {
    title: 'Use Lazy % Formatting in Logging',
    description: 'Logging call uses eager string formatting (f-string or .format()) instead of lazy % formatting',
    impact: 'Performance issue: string is created even if log level won\'t show it. Wastes CPU and memory on expensive operations',
    fix: 'Use % formatting with lazy evaluation. Logger only formats if log level is enabled',
    example: `Before: import logging
       logger = logging.getLogger(__name__)
       user_data = fetch_expensive_data()
       logger.debug(f"User: {user_data}")  # WRONG - data fetched even if DEBUG not enabled!
       logger.debug("User: {}".format(user_data))  # WRONG - string created always
       
After:  logger.debug("User: %s", user_data)  # RIGHT - only evaluates if DEBUG level is enabled
       # If logging level is INFO, the string won't be formatted at all`,
    severity_reason: 'Medium - performance optimization'
  },
  'W1201': {
    title: 'Logging Format String',
    description: 'String formatting should be done in the logging call, not before',
    impact: 'Performance issue: string is created even if the log message won\'t be displayed',
    fix: 'Pass format arguments to logger instead of pre-formatting',
    example: `Before: import logging
       logger = logging.getLogger(__name__)
       msg = "Processing file: " + expensive_operation()  # Always executes!
       logger.debug(msg)
       
After:  logger.debug("Processing file: %s", expensive_operation())  # Only calls if level enabled
       # Or even better, do expensive work only if needed:
       if logger.isEnabledFor(logging.DEBUG):
           logger.debug("Processing: %s", expensive_operation())`,
    severity_reason: 'Medium - performance optimization'
  },
  'dangerous-default-value': {
    title: 'Dangerous Default Mutable Value',
    description: 'Function uses mutable default argument (list, dict, set)',
    impact: 'Mutable defaults are shared across calls, causing unexpected behavior',
    fix: 'Use None as default and create new instance inside function',
    example: `Before: def add(item, list=[]):  # BUG!
           list.append(item)
           return list
After:  def add(item, list=None):
           if list is None:
               list = []
           list.append(item)
           return list`,
    severity_reason: 'High - subtle bug'
  },
  'pointless-statement': {
    title: 'Pointless Statement',
    description: 'Statement has no effect on the program',
    impact: 'Wastes space and may indicate unfinished code',
    fix: 'Remove the statement or assign its result',
    example: `Before: x + 5  # Does nothing
After:  y = x + 5  # Or remove completely`,
    severity_reason: 'Low - dead code'
  },
  'wildcard-import': {
    title: 'Wildcard Import',
    description: 'Using "from module import *" instead of explicit imports',
    impact: 'Unclear what symbols are imported, pollutes namespace, makes debugging hard',
    fix: 'Use explicit imports: from module import func1, func2, func3',
    example: `Before: from os import *  # What gets imported?
After:  from os import path, getcwd, listdir  # Clear imports`,
    severity_reason: 'Medium - code clarity'
  },
  'super-init-not-called': {
    title: 'Super __init__ Not Called',
    description: 'Child class __init__ doesn\'t call parent\'s __init__',
    impact: 'Parent class initialization is skipped, may cause unexpected behavior',
    fix: 'Call super().__init__() or Parent.__init__(self) in child class',
    example: `Before: class Child(Parent):
           def __init__(self):
               pass  # Parent not initialized!
After:  class Child(Parent):
           def __init__(self):
               super().__init__()  # Parent initialized`,
    severity_reason: 'High - inheritance bug'
  },
  'W0101': {
    title: 'Unreachable Code',
    description: 'Code after return, break, raise, or continue cannot be executed',
    impact: 'Dead code wastes space and indicates logic errors',
    fix: 'Remove unreachable code or restructure control flow',
    example: `Before: def foo():
           return 5
           print("Never runs")  # Unreachable
After:  def foo():
           print("Will run")
           return 5`,
    severity_reason: 'Medium - logic error'
  },
  'W0102': {
    title: 'Dangerous Default Mutable Value',
    description: 'Function uses mutable default argument (list, dict, set)',
    impact: 'Mutable defaults are shared across calls, causing unexpected behavior and bugs',
    fix: 'Use None as default and create new instance inside function',
    example: `Before: def add(item, items=[]):  # BUG!
           items.append(item)
           return items
       add(1)  # [1]
       add(2)  # [1, 2] - list was shared!
       
After:  def add(item, items=None):
           if items is None:
               items = []
           items.append(item)
           return items`,
    severity_reason: 'High - subtle bug'
  },
  'W0104': {
    title: 'Pointless Statement',
    description: 'Statement has no effect on the program',
    impact: 'Wastes code space and may indicate unfinished implementation',
    fix: 'Remove the statement or assign its result to a variable',
    example: `Before: def calculate(x):
           x + 5  # Does nothing!
           return 0
       
After:  def calculate(x):
           result = x + 5
           return result`,
    severity_reason: 'Low - dead code'
  },
  'W0105': {
    title: 'Pointless String Statement',
    description: 'String literal on its own line with no effect (unless it\'s a docstring)',
    impact: 'Wastes space, confusing to readers',
    fix: 'Remove the string or assign it, unless it\'s a docstring at function start',
    example: `Before: def process():
           "This is not a docstring"  # Wrong location!
           return True
       
After:  def process():
           """This is a proper docstring"""  # At start
           return True`,
    severity_reason: 'Low - code clarity'
  },
  'W0611': {
    title: 'Unused Import',
    description: 'Module is imported but never used in the code',
    impact: 'Wastes memory, makes dependencies unclear, clutters code',
    fix: 'Remove the unused import statement',
    example: `Before: import os  # Never used
       import sys
       print(sys.version)
       
After:  import sys
       print(sys.version)`,
    severity_reason: 'Low - code cleanliness'
  },
  'W0612': {
    title: 'Unused Variable',
    description: 'Variable is assigned but never used in the code',
    impact: 'Wastes memory and makes code harder to understand',
    fix: 'Remove the variable or use it. Prefix with _ if intentionally unused',
    example: `Before: data = fetch_data()
       print("Processing done")
       
After:  print("Processing done")
       # Or if needed for side effects:
       _ = fetch_data()`,
    severity_reason: 'Low - code cleanliness'
  },
  'W0613': {
    title: 'Unused Function Argument',
    description: 'Function parameter is never used in the function body',
    impact: 'Confusing API, may indicate incomplete implementation',
    fix: 'Remove parameter or use it. Prefix with _ if needed for compatibility',
    example: `Before: def process(data, unused_config):
           return len(data)
       
After:  def process(data, _unused_config):
           return len(data)
       # Or: def process(data):`,
    severity_reason: 'Low - API clarity'
  },
  'W0614': {
    title: 'Wildcard Import (Unused)',
    description: 'Wildcard import "from X import *" makes code harder to understand',
    impact: 'Unclear what symbols are imported, namespace pollution, debugging difficult',
    fix: 'Use explicit imports listing all needed symbols',
    example: `Before: from os import *
       print(getcwd())  # Where did getcwd come from?
       
After:  from os import getcwd, chdir
       print(getcwd())  # Clear!`,
    severity_reason: 'Medium - code clarity'
  },
  'W0631': {
    title: 'Undefined Loop Variable',
    description: 'Variable used outside a loop that defined it, but loop might not execute',
    impact: 'Code may crash if loop never runs (UnboundLocalError)',
    fix: 'Initialize variable before loop or check if loop executed',
    example: `Before: for item in empty_list:
           result = item
       print(result)  # Crashes if loop never runs!
       
After:  result = None
       for item in empty_list:
           result = item
       if result:
           print(result)`,
    severity_reason: 'High - runtime error risk'
  },
  'W1201': {
    title: 'Logging Format String',
    description: 'String formatting should be done in the logging call, not before',
    impact: 'Performance issue: string is created even if log level won\'t show it',
    fix: 'Pass format arguments to logger instead of pre-formatting the string',
    example: `Before: logger.debug("Processing: " + str(expensive_op()))  # Always runs!
       
After:  logger.debug("Processing: %s", expensive_op())  # Only if DEBUG level`,
    severity_reason: 'Medium - performance'
  },
  'W1203': {
    title: 'Use Lazy % Formatting in Logging',
    description: 'Logging uses eager f-string/format() instead of lazy % formatting',
    impact: 'Performance issue: expensive string formatting happens even if log won\'t show it',
    fix: 'Use % formatting with lazy evaluation - let logger handle formatting',
    example: `Before: logger.debug(f"Data: {get_data()}")  # Expensive call always made!
       logger.debug("Data: {}".format(get_data()))  # Same problem!
       
After:  logger.debug("Data: %s", get_data())  # Only evaluates if DEBUG enabled`,
    severity_reason: 'Medium - performance'
  },

  // JavaScript ESLint Warnings
  'no-unused-vars': {
    title: 'Unused Variable',
    description: 'Variable is declared but never used',
    impact: 'Clutters code and wastes memory. Often leftover from refactoring',
    fix: 'Remove the variable or use it. Prefix with _ if intentionally unused',
    example: `Before: const result = getData();
       console.log("done");  // result not used
After:  console.log("done");
       // Or: const _ = getData(); // if needed for side effects`,
    severity_reason: 'Low - code cleanliness'
  },
  'no-constant-condition': {
    title: 'Constant Condition',
    description: 'if/while condition is always true or always false',
    impact: 'Dead code or infinite loops. Indicates logic error',
    fix: 'Fix the condition or remove dead code',
    example: `Before: if (true) {  // Always executes
           process();
       }
After:  if (shouldProcess) {
           process();
       }`,
    severity_reason: 'Medium - logic error'
  },
  'no-empty': {
    title: 'Empty Block Statement',
    description: 'Empty if, catch, loop, or function block',
    impact: 'Usually a mistake. Code was forgotten or incomplete',
    fix: 'Add code to the block or remove it',
    example: `Before: if (error) {
       }  // What should happen?
After:  if (error) {
           console.error("Error occurred");
       }`,
    severity_reason: 'Medium - incomplete code'
  },
  'no-extra-semi': {
    title: 'Extra Semicolon',
    description: 'Unnecessary semicolon after statements',
    impact: 'Unnecessary. Makes code inconsistent',
    fix: 'Remove the extra semicolon',
    example: `Before: const x = 5;;
       console.log(x);;
After:  const x = 5;
       console.log(x);`,
    severity_reason: 'Low - style issue'
  },
  'no-unreachable': {
    title: 'Code After Return',
    description: 'Code after return, throw, or break is unreachable',
    impact: 'Dead code that never executes. Wastes space',
    fix: 'Remove unreachable code or restructure logic',
    example: `Before: function test() {
           return 5;
           console.log("Never runs");
       }
After:  function test() {
           console.log("Will run");
           return 5;
       }`,
    severity_reason: 'Medium - logic error'
  },
  'no-func-assign': {
    title: 'Function Reassignment',
    description: 'Function expression is being reassigned like a variable',
    impact: 'Confusing and may indicate misunderstanding of function declarations',
    fix: 'Use a new variable name or restructure the code',
    example: `Before: let process = function() { };
       process = function() { };  // Reassigning
After:  const process = function() { };
       const processV2 = function() { };`,
    severity_reason: 'Medium - design issue'
  },
  'no-irregular-whitespace': {
    title: 'Irregular Whitespace',
    description: 'Line contains special whitespace characters (non-breaking space, etc)',
    impact: 'May cause encoding issues and inconsistent indentation',
    fix: 'Remove irregular whitespace and use regular spaces/tabs',
    example: `Before: const x = 5;  // Contains special unicode space
After:  const x = 5;  // Regular space character`,
    severity_reason: 'Low - encoding issue'
  },
  'no-var': {
    title: 'Avoid var Keyword',
    description: 'Variable declared with var instead of let/const',
    impact: 'var has function scope (confusing), let/const have block scope (safer)',
    fix: 'Replace var with let (for mutable) or const (for immutable)',
    example: `Before: var x = 5;  // Function scope - hoisting!
       for (var i = 0; i < 3; i++) { }
       console.log(i);  // 3 - leaks to outer scope!
       
After:  const x = 5;  // Block scope - safe
       for (let i = 0; i < 3; i++) { }
       console.log(i);  // Error - i not defined`,
    severity_reason: 'Medium - scope issues'
  },
  'prefer-const': {
    title: 'Use const Instead of let',
    description: 'Variable declared with let but never reassigned',
    impact: 'Using const makes intent clear and prevents accidental reassignment',
    fix: 'Replace let with const for variables that are not reassigned',
    example: `Before: let name = "John";
       console.log(name);  // Never changes
       
After:  const name = "John";  // Intent is clear`,
    severity_reason: 'Low - best practice'
  },
  'eqeqeq': {
    title: 'Use Strict Equality (===)',
    description: 'Using == instead of === for comparison',
    impact: 'Type coercion causes unexpected results. "5" == 5 is true!',
    fix: 'Replace == with === and != with !==',
    example: `Before: if (x == 5) { }  // Type coercion!
       if (x != "5") { }
       
After:  if (x === 5) { }  // Strict comparison
       if (x !== "5") { }`,
    severity_reason: 'Medium - bug risk'
  },
  'no-console': {
    title: 'console.log in Production',
    description: 'Debug console methods left in production code',
    impact: 'Performance issue and exposes internal logic in browser console',
    fix: 'Remove console statements or replace with proper logging',
    example: `Before: console.log(userData);  // Visible in browser!
       console.debug(apiKey);  // Security risk!
       
After:  logger.info(userData);  // Use proper logging
       // Remove sensitive logs entirely`,
    severity_reason: 'Medium - production readiness'
  },
  'no-undef': {
    title: 'Undefined Variable',
    description: 'Variable is used but never defined or imported',
    impact: 'Will cause ReferenceError at runtime',
    fix: 'Define the variable before using or import it',
    example: `Before: console.log(myVar);  // Error!
       
After:  const myVar = 5;
       console.log(myVar);  // Works!`,
    severity_reason: 'High - runtime error'
  },
  'no-const-assign': {
    title: 'Reassign Const',
    description: 'Trying to reassign a const variable',
    impact: 'Causes TypeError at runtime',
    fix: 'Use let for variables that need reassignment',
    example: `Before: const x = 5;
       x = 10;  // Error!
       
After:  let x = 5;
       x = 10;  // Works!`,
    severity_reason: 'High - runtime error'
  },
  'no-func-assign': {
    title: 'Function Reassignment',
    description: 'Function expression is being reassigned like a variable',
    impact: 'Confusing and may break function references',
    fix: 'Create separate variables or use function declarations',
    example: `Before: let process = function() { };
       process = function() { };  // Overwrites!
       
After:  const process = function() { };
       const processV2 = function() { };`,
    severity_reason: 'Medium - design issue'
  },
  'no-unreachable': {
    title: 'Code After Return',
    description: 'Code after return, throw, or break is unreachable',
    impact: 'Dead code that never executes, confusing',
    fix: 'Remove unreachable code or restructure logic',
    example: `Before: function test() {
           return 5;
           console.log("Never runs");  // Dead code!
       }
       
After:  function test() {
           console.log("Will run");
           return 5;
       }`,
    severity_reason: 'Medium - logic error'
  },
  'no-empty': {
    title: 'Empty Block Statement',
    description: 'Empty if, catch, loop, or function block',
    impact: 'Usually incomplete code or a mistake',
    fix: 'Add code to the block or remove it',
    example: `Before: if (error) {
       }  // What should happen here?
       try { doSomething(); } catch(e) { }  // Ignores error!
       
After:  if (error) {
           console.error(error);
       }
       try { doSomething(); } catch(e) {
           handleError(e);
       }`,
    severity_reason: 'Medium - incomplete code'
  },
  'no-extra-semi': {
    title: 'Extra Semicolon',
    description: 'Unnecessary semicolons after statements',
    impact: 'Style inconsistency and confusing to readers',
    fix: 'Remove extra semicolons',
    example: `Before: const x = 5;;
       console.log(x);;
       
After:  const x = 5;
       console.log(x);`,
    severity_reason: 'Low - style'
  },
  'curly': {
    title: 'Missing Curly Braces',
    description: 'if/else/for/while should use curly braces',
    impact: 'Error-prone: future changes can break logic unexpectedly',
    fix: 'Always use curly braces, even for single statements',
    example: `Before: if (x > 5)
               console.log(x);
           else
               console.log("small");
           
After:  if (x > 5) {
           console.log(x);
       } else {
           console.log("small");
       }`,
    severity_reason: 'Medium - best practice'
  },

  // Python Pylint Refactor (R)
  'too-many-locals': {
    title: 'Too Many Local Variables',
    description: 'Function has too many local variables (usually > 15)',
    impact: 'Hard to understand and maintain. Indicates the function does too much',
    fix: 'Break the function into smaller helper functions',
    example: `Before: def process(x):
           var1 = ...
           var2 = ...
           ... (15+ variables)
           return result
After:  def step1(x): return result1
       def step2(result1): return result2
       def process(x): return step2(step1(x))`,
    severity_reason: 'Medium - maintainability'
  },
  'too-many-branches': {
    title: 'Too Many Branches',
    description: 'Function has too many if/elif branches (usually > 12)',
    impact: 'Complex logic that\'s hard to test and understand',
    fix: 'Use polymorphism, strategy pattern, or extract conditions into helper functions',
    example: `Before: if x == 1: ...
       elif x == 2: ...
       elif x == 3: ...  (12+ branches)
After:  dispatch = {1: handler1, 2: handler2, 3: handler3}
       dispatch[x]()`,
    severity_reason: 'Medium - complexity'
  },
  'too-many-arguments': {
    title: 'Too Many Function Arguments',
    description: 'Function has too many parameters (usually > 5)',
    impact: 'Hard to call and understand. Indicates function lacks cohesion',
    fix: 'Group related parameters into a class or use keyword-only arguments',
    example: `Before: def process(name, age, address, phone, email, dept):
           ...
After:  class Person:
           def __init__(self, name, age, address, phone, email, dept):
               ...
       def process(person):
           ...`,
    severity_reason: 'Medium - API design'
  },
  'too-many-returns': {
    title: 'Too Many Return Statements',
    description: 'Function has many return statements scattered throughout',
    impact: 'Hard to follow control flow and test all exit paths',
    fix: 'Use single return or early-exit pattern',
    example: `Before: def validate(x):
           if not x: return False
           if x < 0: return False
           if x > 100: return False
           if not is_valid(x): return False
           return True
After:  def validate(x):
           checks = [
               lambda x: x is not None,
               lambda x: x >= 0,
               lambda x: x <= 100,
               lambda x: is_valid(x)
           ]
           return all(check(x) for check in checks)`,
    severity_reason: 'Medium - control flow'
  },
  'too-many-instance-attrs': {
    title: 'Too Many Instance Attributes',
    description: 'Class has too many attributes (usually > 7)',
    impact: 'Class is doing too much. Should be broken into smaller classes',
    fix: 'Refactor into multiple focused classes or use composition',
    example: `Before: class User:
           self.name, self.age, self.address, self.phone,
           self.email, self.dept, self.salary, self.role, ...
After:  class User:
           self.personal_info = PersonalInfo(...)
           self.contact = Contact(...)
           self.job = Job(...)`,
    severity_reason: 'Medium - design'
  },

  // Security (Bandit)
  'assert-used': {
    title: 'Assert Used for Production',
    description: 'Using assert() for input validation in production code',
    impact: 'Assertions can be disabled with -O flag. Not safe for validation',
    fix: 'Use proper error handling with raise Exception instead',
    example: `Before: assert x > 0, "x must be positive"  # Can be disabled!
After:  if x <= 0:
           raise ValueError("x must be positive")`,
    severity_reason: 'High - security'
  },
  'insecure-hash': {
    title: 'Insecure Hash Function',
    description: 'Using weak hash like MD5 or SHA1 for security',
    impact: 'Cryptographically broken. Can be cracked easily',
    fix: 'Use SHA256, SHA3, bcrypt, or argon2 instead',
    example: `Before: import hashlib
       hash = hashlib.md5(password.encode()).hexdigest()
After:  import hashlib
       hash = hashlib.sha256(password.encode()).hexdigest()`,
    severity_reason: 'High - security'
  },
  'shell-injection': {
    title: 'Shell Injection Vulnerability',
    description: 'Using shell=True with user input in subprocess',
    impact: 'Attackers can execute arbitrary commands',
    fix: 'Use shell=False or use shlex.quote() for input validation',
    example: `Before: os.system(f"process {user_input}")  # VULNERABLE!
After:  subprocess.run(["process", user_input], shell=False)`,
    severity_reason: 'Critical - security'
  },
  'no-eval': {
    title: 'Using eval() - CRITICAL SECURITY RISK',
    description: 'eval() executes arbitrary strings as code',
    impact: 'MASSIVE SECURITY VULNERABILITY. Attackers can execute malicious code. Performance killer. Debugger nightmare.',
    fix: 'Never use eval(). Use JSON.parse() for data parsing or Function constructor with extreme caution.',
    example: `Before: eval("console.log('Direct code execution')");  // NEVER DO THIS!
        eval("alert(" + userInput + ")");  // Attacker controls code!
        
After:  const data = JSON.parse(jsonString);  // Safe for data
        // For dynamic code, use safer alternatives`,
    severity_reason: 'CRITICAL - security exploit'
  },
  'no-shadow': {
    title: 'Variable Shadowing',
    description: 'Inner scope variable redeclares outer scope variable',
    impact: 'Confusing bugs where you lose access to outer variable. Hard to debug.',
    fix: 'Use different variable names or restructure scope',
    example: `Before: const prop = "outer";
        {
          const prop = "inner";  // Shadows outer!
        }
        
After:  const prop = "outer";
        {
          const innerProp = "inner";  // Different name
        }`,
    severity_reason: 'Medium - maintainability'
  },
  'camelcase': {
    title: 'Naming Convention Violation',
    description: 'Variable/function uses snake_case instead of camelCase. Classes use snake_case instead of PascalCase.',
    impact: 'Inconsistent with JavaScript conventions. Harder to read.',
    fix: 'Use camelCase for variables/functions. Use PascalCase for classes.',
    example: `Before: var user_name = "John";
        class data_service { }
        const process_data = () => { };
        
After:  const userName = "John";
        class DataService { }
        const processData = () => { };`,
    severity_reason: 'Low - style consistency'
  },
  'no-debugger': {
    title: 'Debugger Statement in Code',
    description: 'debugger; statement left in production code',
    impact: 'Browser will FREEZE and halt execution when hit. Destroys user experience.',
    fix: 'Remove all debugger statements before deployment. Use console.log instead.',
    example: `Before: function processPayment(amount) {
        debugger;  // FREEZES BROWSER!
        return charge(amount);
      }
      
After:  function processPayment(amount) {
        console.log("Processing:", amount);
        return charge(amount);
      }`,
    severity_reason: 'Critical - production readiness'
  },
  'no-multiple-empty-lines': {
    title: 'Too Many Empty Lines',
    description: 'Multiple consecutive blank lines in code',
    impact: 'Reduces readability. Harder to see full function at once.',
    fix: 'Keep maximum 1-2 blank lines between sections.',
    example: `Before: const x = 5;


      const y = 10;  // Too many blanks!
      
After:  const x = 5;
      const y = 10;`,
    severity_reason: 'Low - style'
  },
  
  // Java Issues
  'avoid-system-out': {
    title: 'Use Logging Framework Instead of System.out',
    description: 'Direct use of System.out.print/println in code',
    impact: 'No log levels, no timestamp, no log files. Hard to debug in production. No control over output.',
    fix: 'Use SLF4J or Log4j. Configure logger at class level, call logger.info(), logger.warn(), logger.error()',
    example: `Before: System.out.println("User logged in: " + username);
         System.out.println("Error: " + error);
         
After:  private static final Logger logger = LoggerFactory.getLogger(UserService.class);
        logger.info("User logged in: {}", username);
        logger.error("Error:", error);`,
    severity_reason: 'Medium - production best practice'
  },
  'sql-injection': {
    title: 'SQL Injection Vulnerability',
    description: 'SQL query built by concatenating user input',
    impact: 'CRITICAL SECURITY: Attacker can modify query logic, steal/delete data, compromise database',
    fix: 'Use PreparedStatement with parameterized queries. Never concatenate user input into SQL.',
    example: `Before: String query = "SELECT * FROM users WHERE id = " + userId;
         Statement stmt = conn.createStatement();
         ResultSet rs = stmt.executeQuery(query);  // VULNERABLE!
         
After:  String query = "SELECT * FROM users WHERE id = ?";
        PreparedStatement pstmt = conn.prepareStatement(query);
        pstmt.setInt(1, userId);  // Safe parameter binding
        ResultSet rs = pstmt.executeQuery();`,
    severity_reason: 'Critical - security vulnerability'
  },
  'hardcoded-secret': {
    title: 'Hardcoded Secret/Credential',
    description: 'Password, API key, or secret embedded in source code',
    impact: 'CRITICAL: Secret exposed in version control, backups, and distributed binaries. Complete compromise.',
    fix: 'Move to environment variables, system properties, or secure config service. Never commit secrets.',
    example: `Before: private String apiKey = "sk-1234567890abcdef";
         String password = "admin123";
         
After:  private String apiKey = System.getenv("API_KEY");
        String password = System.getProperty("app.password");
        // Or use Spring Cloud Config, AWS Secrets Manager, etc.`,
    severity_reason: 'Critical - security exposure'
  },
  'string-comparison': {
    title: 'Incorrect String Comparison with ==',
    description: 'Using == or != to compare Strings instead of .equals()',
    impact: 'Compares object references, not values. Two identical strings may not be equal. Logic errors.',
    fix: 'Always use .equals() or .equalsIgnoreCase() for String comparison',
    example: `Before: String name = getUserInput();
         if (name == "admin") {  // WRONG! Compares reference
           grantAdminAccess();
         }
         
After:  String name = getUserInput();
        if (name.equals("admin")) {  // Correct! Compares value
          grantAdminAccess();
        }
        if (name.equalsIgnoreCase("ADMIN")) {  // Case-insensitive`,
    severity_reason: 'Error - logic bug'
  },
  'empty-catch': {
    title: 'Empty Catch Block',
    description: 'Exception caught but not handled (empty block)',
    impact: 'Silent failure. Exception swallowed, you never know it happened. Debugging nightmare.',
    fix: 'Log exception or rethrow. At minimum log with logger.error(). Never leave empty.',
    example: `Before: try {
           parseUserData(input);
         } catch (ParseException e) {
           // Empty - silently ignores error!
         }
         
After:  try {
          parseUserData(input);
        } catch (ParseException e) {
          logger.error("Failed to parse user data", e);
          throw new ApplicationException("Invalid format", e);
        }`,
    severity_reason: 'Error - silent failure'
  },
  'null-pointer-risk': {
    title: 'Potential NullPointerException',
    description: 'Calling method on potentially null object without null check',
    impact: 'Runtime crash. NPE is the most common Java exception. Application hangs or crashes.',
    fix: 'Add null check before use or use Optional<T>. Modern Java (8+) prefers Optional',
    example: `Before: String email = getUser().getEmail();  // What if getUser() returns null?
         sender.send(email);
         
After:  User user = getUser();
        if (user != null) {
          sender.send(user.getEmail());
        }
        
        // Or with Optional:
        getUser().ifPresent(user -> sender.send(user.getEmail()));`,
    severity_reason: 'Warning - runtime crash risk'
  },
  'avoid-wildcard-imports': {
    title: 'Wildcard Import Statement',
    description: 'Using import java.util.*; instead of importing specific classes',
    impact: 'Unclear which classes are used. Name collisions possible. Hard to understand dependencies.',
    fix: 'Import specific classes. Most IDEs can auto-organize imports correctly.',
    example: `Before: import java.util.*;  // Imports 100+ classes
         List<String> list = new ArrayList<>();
         
After:  import java.util.List;
        import java.util.ArrayList;
        List<String> list = new ArrayList<>();`,
    severity_reason: 'Low - code clarity'
  },
  'missing-javadoc': {
    title: 'Missing Javadoc Comment',
    description: 'Public method or class lacks Javadoc documentation',
    impact: 'Other developers don\'t know what this does. Harder to use correctly. Poor maintainability.',
    fix: 'Add /** ... */ comment above public method/class. Document parameters, return value, exceptions.',
    example: `Before: public String formatDate(Date date) {
         return date.toString();
       }
       
After:  /**
         * Formats a date as a human-readable string.
         * @param date the Date to format
         * @return formatted date string (MM/DD/YYYY)
         */
        public String formatDate(Date date) {
          return date.toString();
        }`,
    severity_reason: 'Low - documentation'
  },
  'unused-import': {
    title: 'Unused Import Statement',
    description: 'Import for a class that is never used in the file',
    impact: 'Clutters code, confuses about actual dependencies. Larger bytecode.',
    fix: 'Remove unused import. Use IDE\'s "Optimize Imports" feature.',
    example: `Before: import java.util.HashMap;
         import java.util.TreeMap;  // UNUSED
         Map<String, String> map = new HashMap<>();
         
After:  import java.util.HashMap;
        import java.util.Map;
        Map<String, String> map = new HashMap<>();`,
    severity_reason: 'Info - code cleanliness'
  },
  'magic-number': {
    title: 'Magic Number Without Explanation',
    description: 'Hardcoded number (usually > 100) without context or constant name',
    impact: 'Unclear what the number means. Hard to maintain. If it changes, must change everywhere.',
    fix: 'Define as named constant. Makes code self-documenting.',
    example: `Before: if (user.getAge() > 18) {  // What is 18?
           allowAccess();
         }
         int maxRetries = 3;  // Magic number
         
After:  private static final int ADULT_AGE = 18;
        private static final int MAX_RETRIES = 3;
        if (user.getAge() > ADULT_AGE) {
          allowAccess();
        }`,
    severity_reason: 'Low - code readability'
  },
  'insecure-deserialization': {
    title: 'Insecure Deserialization',
    description: 'Using ObjectInputStream to deserialize untrusted data',
    impact: 'CRITICAL: Attacker can execute arbitrary code via crafted serialized objects.',
    fix: 'Validate data before deserializing. Use JSON instead. Implement readObject() validation.',
    example: `Before: ObjectInputStream ois = new ObjectInputStream(untrustedInput);
         Object obj = ois.readObject();  // DANGEROUS! Code execution!
         
After:  // Use JSON with validation
        String json = readUntrustedInput();
        User user = gson.fromJson(json, User.class);  // Safer`,
    severity_reason: 'Critical - RCE vulnerability'
  },
  'command-injection': {
    title: 'Command Injection Vulnerability',
    description: 'Using Runtime.exec() or ProcessBuilder with unsanitized user input',
    impact: 'CRITICAL: Attacker can execute arbitrary OS commands with app privileges.',
    fix: 'Never pass user input to exec(). Use ProcessBuilder with array (not string). Validate/sanitize.',
    example: `Before: Runtime.getRuntime().exec("ls " + userInput);  // VULNERABLE!
         
After:  // Use array form, no shell interpretation
        ProcessBuilder pb = new ProcessBuilder("ls", userInput);
        pb.start();
        
        // Better: validate input first
        if (!userInput.matches("[a-zA-Z0-9_-]+")) {
          throw new IllegalArgumentException("Invalid path");
        }`,
    severity_reason: 'Critical - RCE vulnerability'
  }
}

function IssueCard({ issue, index }) {
  const [expanded, setExpanded] = useState(false)
  const config = severityConfig[issue.severity]
  const Icon = config.icon
  const details = issueDetails[issue.rule] || {}

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`border-l-4 ${config.border} ${config.bg} rounded-r-lg overflow-hidden mb-3`}
    >
      <div 
        onClick={() => setExpanded(!expanded)}
        className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Icon className={`${config.color} mt-1 text-xl flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-bold ${config.color} capitalize text-lg`}>
                  {details.title || issue.message}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${config.badge}`}>
                  {issue.severity.toUpperCase()}
                </span>
                <span className="text-sm text-gray-500 ml-auto flex-shrink-0">
                  Line {issue.line}
                </span>
              </div>
              <p className="text-gray-700 mt-1 text-sm">{issue.message}</p>
              {details.description && (
                <p className="text-gray-600 text-xs mt-1 italic">{details.description}</p>
              )}
            </div>
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            className="ml-4 flex-shrink-0"
          >
            <FaChevronDown className={config.color} />
          </motion.div>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`border-t ${config.border} p-4 bg-gradient-to-br ${config.bg} to-white`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {details.description && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">📝 What is this?</h4>
                <p className="text-gray-700">{details.description}</p>
              </div>
            )}
            
            {details.impact && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">⚠️ Why does it matter?</h4>
                <p className="text-gray-700">{details.impact}</p>
              </div>
            )}
            
            {details.fix && (
              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-800 mb-1">✅ How to fix it?</h4>
                <p className="text-gray-700 bg-white rounded px-3 py-2 border border-gray-200">
                  {details.fix}
                </p>
              </div>
            )}
            
            {details.example && (
              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-800 mb-1">📝 Example:</h4>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto font-mono border border-gray-700">
                  {details.example}
                </pre>
              </div>
            )}
            
            {details.severity_reason && (
              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-800 mb-1">🎯 Severity</h4>
                <p className="text-gray-700">{details.severity_reason}</p>
              </div>
            )}

            <div className="md:col-span-2">
              <h4 className="font-semibold text-gray-800 mb-1">🔗 Rule Code</h4>
              <div className="flex items-start gap-3">
                <code className="bg-gray-800 text-yellow-400 px-3 py-2 rounded text-xs font-mono flex-shrink-0">
                  {issue.rule}
                </code>
                <div className="bg-white rounded px-3 py-2 border border-gray-200 text-sm flex-1">
                  {ruleInfo[issue.rule] ? (
                    <div>
                      <p className="font-semibold text-gray-900">{ruleInfo[issue.rule].ruleName}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        <strong>Tool:</strong> {ruleInfo[issue.rule].tool} • <strong>Category:</strong> {ruleInfo[issue.rule].category}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {ruleInfo[issue.rule].meaning}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-600 text-xs">Rule: {issue.rule}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

function getComplexityLevel(complexity = 0) {
  if (complexity < 10) return { label: 'Low', percent: 30, color: 'bg-emerald-500' }
  if (complexity < 20) return { label: 'Medium', percent: 65, color: 'bg-yellow-500' }
  return { label: 'High', percent: 100, color: 'bg-red-500' }
}

function getSecurityAlertsCount(issues = []) {
  const securityRules = new Set([
    'no-eval',
    'no-implied-eval',
    'no-new-func',
    'sql-injection',
    'hardcoded-secret',
    'shell-injection',
    'command-injection',
    'insecure-deserialization',
    'parse-error',
  ])

  return issues.filter((issue) => securityRules.has(issue.rule)).length
}

function DashboardCard({ title, value, icon: Icon, barPercent, barColor, subtitle }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">{title}</p>
        <Icon className="text-gray-500" />
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {subtitle ? <p className="text-xs text-gray-500 mt-1">{subtitle}</p> : null}
      <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, barPercent))}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function CompactFindingList({ title, items, emptyMessage, icon: Icon, tone = 'blue' }) {
  const toneMap = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
  }
  const toneClass = toneMap[tone] || toneMap.blue

  return (
    <div className="card">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Icon className="text-gray-600" />
        {title}
      </h2>
      {items.length === 0 ? (
        <div className={`border rounded-lg p-4 ${toneClass}`}>
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={`${item.rule || 'item'}-${idx}`} className="border border-gray-200 rounded-lg p-3 bg-white">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-wide font-semibold text-gray-500">
                  {item.severity || 'info'}
                </span>
                <span className="text-xs text-gray-500">Line {item.line ?? '-'}</span>
              </div>
              <p className="text-sm text-gray-800 mt-1">{item.message || item.issue || 'No message'}</p>
              {item.package_hint ? (
                <p className="text-xs text-gray-500 mt-1">Package hint: {item.package_hint}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function downloadTextFile(content, fileName, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function getComplexityLabel(value = 0) {
  if (value < 10) return 'Low'
  if (value < 20) return 'Medium'
  return 'High'
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export default function AnalysisResults({ results }) {
  const { metrics, issues, suggestions, scores, security_deep_scan_findings = [], dependency_advisories = [], performance_hints = [] } = results
  const [issueFilter, setIssueFilter] = useState('all')
  const [issueSort, setIssueSort] = useState('severity')
  const [activeTab, setActiveTab] = useState('overview')
  const finalScore = Math.round(scores?.final ?? 0)
  const complexity = metrics?.complexity ?? 0
  const complexityLevel = getComplexityLevel(complexity)
  const securityAlerts = getSecurityAlertsCount(issues)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const severityRank = { error: 0, warning: 1, info: 2 }
  const filteredIssues = (issues || []).filter((issue) => {
    if (issueFilter === 'all') return true
    if (issueFilter === 'security') {
      const securityKeywords = ['security', 'secret', 'eval', 'injection', 'xss', 'vulnerability']
      return securityKeywords.some((keyword) =>
        `${issue.rule} ${issue.message}`.toLowerCase().includes(keyword)
      )
    }
    if (issueFilter === 'performance') {
      return `${issue.rule}`.toLowerCase().includes('perf-')
    }
    return issue.severity === issueFilter
  }).sort((a, b) => {
    if (issueSort === 'line') return (a.line || 0) - (b.line || 0)
    if (issueSort === 'rule') return `${a.rule || ''}`.localeCompare(`${b.rule || ''}`)
    return (severityRank[a.severity] ?? 9) - (severityRank[b.severity] ?? 9)
  })

  const generatedAt = new Date().toISOString()
  const baseFileName = `code-review-report-${new Date().toISOString().slice(0, 10)}`

  const reportPayload = {
    generated_at: generatedAt,
    summary: {
      score: finalScore,
      issues_count: issues.length,
      complexity_level: getComplexityLabel(complexity),
      security_alerts: securityAlerts,
    },
    scores: scores || {},
    metrics: metrics || {},
    issues: issues || [],
    suggestions: suggestions || [],
    security_deep_scan_findings: security_deep_scan_findings || [],
    dependency_advisories: dependency_advisories || [],
    performance_hints: performance_hints || [],
  }

  const handleExportJson = () => {
    downloadTextFile(
      JSON.stringify(reportPayload, null, 2),
      `${baseFileName}.json`,
      'application/json'
    )
  }

  const buildMarkdownReport = () => {
    const issueLines = (issues || []).length
      ? issues.map((issue, index) => `${index + 1}. [${issue.severity?.toUpperCase() || 'INFO'}] Line ${issue.line} - ${issue.rule}: ${issue.message}`).join('\n')
      : 'No issues found.'

    const suggestionLines = (suggestions || []).length
      ? suggestions.map((suggestion, index) => `${index + 1}. ${suggestion}`).join('\n')
      : 'No suggestions available.'

    return `# Code Analysis Report

- Generated At: ${generatedAt}
- Overall Score: ${finalScore}/100
- Issues Count: ${issues.length}
- Complexity Level: ${getComplexityLabel(complexity)}
- Security Alerts: ${securityAlerts}

## Score Breakdown

- Quality: ${Math.round(scores?.quality ?? 0)}
- Complexity: ${Math.round(scores?.complexity ?? 0)}
- Security: ${Math.round(scores?.security ?? 0)}
- Final: ${finalScore}

## Metrics

- Lines of Code: ${metrics?.lines_of_code ?? 0}
- Cyclomatic Complexity: ${metrics?.complexity ?? 0}
- Maintainability Index: ${metrics?.maintainability ?? 0}

## Issues

${issueLines}

## Recommendations

${suggestionLines}

## Security Deep Scan Findings

${(security_deep_scan_findings || []).length
  ? security_deep_scan_findings.map((item, index) => `${index + 1}. [${(item.severity || 'info').toUpperCase()}] Line ${item.line ?? '-'} - ${item.rule}: ${item.message || item.issue}`).join('\n')
  : 'No additional deep scan findings.'}

## Dependency Advisories

${(dependency_advisories || []).length
  ? dependency_advisories.map((item, index) => `${index + 1}. [${(item.severity || 'info').toUpperCase()}] ${item.package_hint || 'package'} - ${item.message}`).join('\n')
  : 'No dependency advisories.'}

## Performance Hints

${(performance_hints || []).length
  ? performance_hints.map((item, index) => `${index + 1}. [${(item.severity || 'info').toUpperCase()}] Line ${item.line ?? '-'} - ${item.message}`).join('\n')
  : 'No performance hints.'}
`
  }

  const handleExportMarkdown = () => {
    downloadTextFile(buildMarkdownReport(), `${baseFileName}.md`, 'text/markdown')
  }

  const handleExportPdf = () => {
    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Code Analysis Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; color: #111827; }
    h1, h2 { margin-bottom: 8px; }
    .muted { color: #6b7280; font-size: 12px; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 16px 0; }
    .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
    .card strong { display: block; font-size: 12px; color: #6b7280; margin-bottom: 6px; }
    .value { font-size: 24px; font-weight: 700; }
    ul { padding-left: 18px; }
    li { margin-bottom: 8px; }
    code { background: #f3f4f6; padding: 2px 4px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Code Analysis Report</h1>
  <p class="muted">Generated at ${escapeHtml(generatedAt)}</p>

  <div class="grid">
    <div class="card"><strong>Score</strong><div class="value">${finalScore}</div></div>
    <div class="card"><strong>Issues Count</strong><div class="value">${issues.length}</div></div>
    <div class="card"><strong>Complexity Level</strong><div class="value">${escapeHtml(getComplexityLabel(complexity))}</div></div>
    <div class="card"><strong>Security Alerts</strong><div class="value">${securityAlerts}</div></div>
  </div>

  <h2>Issues</h2>
  <ul>
    ${issues.length
      ? issues.map((issue) => `<li><strong>[${escapeHtml(issue.severity?.toUpperCase() || 'INFO')}]</strong> Line ${escapeHtml(issue.line)} - <code>${escapeHtml(issue.rule)}</code><br/>${escapeHtml(issue.message)}</li>`).join('')
      : '<li>No issues found.</li>'}
  </ul>

  <h2>Recommendations</h2>
  <ul>
    ${(suggestions || []).length
      ? suggestions.map((suggestion) => `<li>${escapeHtml(suggestion)}</li>`).join('')
      : '<li>No suggestions available.</li>'}
  </ul>
</body>
</html>`

    const printWindow = window.open('', '_blank', 'width=900,height=700')
    if (!printWindow) {
      alert('Please allow popups to export PDF.')
      return
    }
    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 mt-8"
    >
      {/* Tab Navigation */}
      <motion.div variants={itemVariants} className="border-b border-gray-200">
        <div className="flex space-x-8 overflow-x-auto">
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'visualizations', label: '📈 Visualizations', icon: '📈' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
      {/* Quick Dashboard */}
      <motion.div variants={itemVariants}>
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard
              title="Score"
              value={finalScore}
              icon={FaChartLine}
              barPercent={finalScore}
              barColor="bg-blue-500"
              subtitle="Overall / 100"
            />
            <DashboardCard
              title="Issues Count"
              value={issues.length}
              icon={FaBug}
              barPercent={Math.min(100, issues.length * 10)}
              barColor="bg-orange-500"
              subtitle={issues.length === 0 ? 'Clean' : 'Needs attention'}
            />
            <DashboardCard
              title="Complexity Level"
              value={complexityLevel.label}
              icon={FaCubes}
              barPercent={complexityLevel.percent}
              barColor={complexityLevel.color}
              subtitle={`Cyclomatic: ${complexity}`}
            />
            <DashboardCard
              title="Security Alerts"
              value={securityAlerts}
              icon={FaShieldAlt}
              barPercent={Math.min(100, securityAlerts * 20)}
              barColor="bg-red-500"
              subtitle={securityAlerts === 0 ? 'No critical flags' : 'Review required'}
            />
          </div>
        </div>
      </motion.div>

      {/* Report Export */}
      <motion.div variants={itemVariants} className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Export Report</h2>
            <p className="text-sm text-gray-600">Download analysis as PDF, JSON, or Markdown.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={handleExportJson} className="btn-secondary flex items-center gap-2">
              <FaFileCode /> JSON
            </button>
            <button onClick={handleExportMarkdown} className="btn-secondary flex items-center gap-2">
              <FaFileAlt /> Markdown
            </button>
            <button onClick={handleExportPdf} className="btn-primary flex items-center gap-2">
              <FaFilePdf /> PDF
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Combined Score Banner ── */}
      <motion.div variants={itemVariants} className="card">
        <FinalScoreBanner scores={scores} />
      </motion.div>

      {/* Metrics Overview */}
      <motion.div variants={itemVariants} className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <FaChartLine className="mr-2 text-primary-600" />
          Code Metrics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Lines of Code</p>
            <p className="text-3xl font-bold text-blue-700">{metrics.lines_of_code}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Cyclomatic Complexity</p>
            <p className="text-3xl font-bold text-purple-700">{metrics.complexity}</p>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.complexity < 10 ? '✅ Simple' : metrics.complexity < 20 ? '⚠️ Moderate' : '❌ Complex'}
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Maintainability Index</p>
            <p className="text-3xl font-bold text-green-700">{metrics.maintainability}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.maintainability >= 80 ? '✅ Excellent' : metrics.maintainability >= 60 ? '👍 Good' : '⚠️ Needs Work'}
            </p>
          </div>
        </div>

        <MetricsChart metrics={metrics} />
      </motion.div>

      {/* Issues */}
      <motion.div variants={itemVariants} className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
          Issues Found ({issues.length})
          </h2>
          <div className="flex flex-wrap gap-2">
            {['all', 'error', 'warning', 'security', 'performance'].map((filter) => (
              <button
                key={filter}
                onClick={() => setIssueFilter(filter)}
                className={`px-3 py-1 text-xs rounded-full border ${
                  issueFilter === filter
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300'
                }`}
              >
                {filter}
              </button>
            ))}
            <select
              value={issueSort}
              onChange={(e) => setIssueSort(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
            >
              <option value="severity">Sort: Severity</option>
              <option value="line">Sort: Line</option>
              <option value="rule">Sort: Rule</option>
            </select>
          </div>
        </div>
        
        {filteredIssues.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <p className="text-green-700 font-semibold">✨ No matching issues for current filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredIssues.map((issue, index) => (
              <IssueCard key={issue.id} issue={issue} index={index} />
            ))}
          </div>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <CompactFindingList
          title="Security Deep Scan"
          items={[...security_deep_scan_findings, ...dependency_advisories]}
          emptyMessage="No additional deep-scan security findings."
          icon={FaShieldAlt}
          tone="red"
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <CompactFindingList
          title="Performance Hints"
          items={performance_hints}
          emptyMessage="No performance hotspots detected."
          icon={FaChartLine}
          tone="amber"
        />
      </motion.div>

      {/* AI Suggestions */}
      <motion.div variants={itemVariants} className="card bg-gradient-to-br from-primary-50 to-primary-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <FaLightbulb className="mr-2 text-yellow-500" />
          AI-Powered Suggestions
        </h2>
        
        {suggestions.length === 0 ? (
          <p className="text-gray-600">No suggestions at this time.</p>
        ) : (
          <ul className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start bg-white p-4 rounded-lg shadow-sm"
              >
                <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-gray-800">{suggestion}</p>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
        </>
      )}

      {/* Visualizations Tab */}
      {activeTab === 'visualizations' && (
        <motion.div variants={itemVariants}>
          <AdvancedVisualizations results={results} />
        </motion.div>
      )}

    </motion.div>
  )
}
