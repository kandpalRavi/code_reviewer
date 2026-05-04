import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Editor from '@monaco-editor/react'
import { FaPlus, FaTrash, FaDownload, FaSave, FaCopy } from 'react-icons/fa'

export default function CodeEditor({ onAnalyze, language, setLanguage, notify = () => {} }) {
  const [files, setFiles] = useState([
    { id: 1, name: 'main.py', language: 'python', content: '# Write your code here\n' }
  ])
  const [activeFileId, setActiveFileId] = useState(1)
  const [theme, setTheme] = useState('vs-light')
  const editorRef = useRef(null)

  const activeFile = files.find(f => f.id === activeFileId)

  const handleAddFile = () => {
    const newId = Math.max(...files.map(f => f.id)) + 1
    setFiles([
      ...files,
      { id: newId, name: `file${newId}.py`, language: 'python', content: '' }
    ])
    setActiveFileId(newId)
  }

  const handleDeleteFile = (id) => {
    if (files.length === 1) {
      notify('Cannot delete the last file', 'error')
      return
    }
    const newFiles = files.filter(f => f.id !== id)
    setFiles(newFiles)
    setActiveFileId(newFiles[0].id)
  }

  const handleCodeChange = (value) => {
    setFiles(files.map(f =>
      f.id === activeFileId ? { ...f, content: value || '' } : f
    ))
  }

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    setFiles(files.map(f =>
      f.id === activeFileId ? { ...f, language: lang } : f
    ))
  }

  const handleAnalyzeClick = () => {
    if (!activeFile || !activeFile.content.trim()) {
      alert('Please enter some code to analyze')
      return
    }
    // Call the parent's analyze function with the current file code and language
    onAnalyze(activeFile.content, activeFile.language)
  }

  const handleDownload = () => {
    if (!activeFile) return
    const element = document.createElement('a')
    const file = new Blob([activeFile.content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = activeFile.name
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleSaveLocally = () => {
    localStorage.setItem('codeReviewerFiles', JSON.stringify(files))
    notify('Files saved to browser storage', 'success')
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeFile.content)
    notify('Code copied to clipboard', 'success')
  }

  const handleLoadDemo = (lang) => {
    const demos = {
      python: `def calculate_sum(numbers):
    """Calculate sum of numbers"""
    total = 0
    for num in numbers:
        total += num
    return total

result = calculate_sum([1, 2, 3, 4, 5])
print(result)`,
      javascript: `function calculateSum(numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}

const result = calculateSum([1, 2, 3, 4, 5]);
console.log(result);`,
      java: `public class Calculator {
    public static int calculateSum(int[] numbers) {
        int sum = 0;
        for (int num : numbers) {
            sum += num;
        }
        return sum;
    }
    
    public static void main(String[] args) {
        int[] numbers = {1, 2, 3, 4, 5};
        System.out.println(calculateSum(numbers));
    }
}`
    }
    
    const ext = lang === 'python' ? '.py' : lang === 'javascript' ? '.js' : '.java'
    const newFile = {
      id: Math.max(...files.map(f => f.id)) + 1,
      name: `demo${ext}`,
      language: lang,
      content: demos[lang]
    }
    setFiles([...files, newFile])
    setActiveFileId(newFile.id)
    setLanguage(lang)
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Code Editor</h1>
          <p className="text-gray-600">Write, edit, and analyze your code in real-time</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-4 mb-6"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
        >
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Left Controls */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleAddFile}
                className="btn-primary flex items-center gap-2"
              >
                <FaPlus /> New File
              </button>

              <select
                value={activeFile?.language || 'python'}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 bg-white"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="typescript">TypeScript</option>
                <option value="cpp">C++</option>
              </select>

              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 bg-white"
              >
                <option value="vs-light">Light Theme</option>
                <option value="vs-dark">Dark Theme</option>
                <option value="hc-black">High Contrast</option>
              </select>
            </div>

            {/* Right Controls */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCopyCode}
                className="btn-secondary flex items-center gap-2"
                title="Copy code to clipboard"
              >
                <FaCopy /> Copy
              </button>
              <button
                onClick={handleDownload}
                className="btn-secondary flex items-center gap-2"
                title="Download code file"
              >
                <FaDownload /> Download
              </button>
              <button
                onClick={handleSaveLocally}
                className="btn-secondary flex items-center gap-2"
                title="Save to browser storage"
              >
                <FaSave /> Save
              </button>
            </div>
          </div>

          {/* Demo Files */}
          <div className="mt-4 border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">Load demo code:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleLoadDemo('python')}
                className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Python Demo
              </button>
              <button
                onClick={() => handleLoadDemo('javascript')}
                className="text-sm px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
              >
                JavaScript Demo
              </button>
              <button
                onClick={() => handleLoadDemo('java')}
                className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Java Demo
              </button>
            </div>
          </div>
        </motion.div>

        {/* Editor Tabs */}
        <motion.div
          className="bg-white rounded-t-lg shadow-md overflow-hidden mb-0"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
        >
          <div className="flex border-b border-gray-200 bg-gray-100 overflow-x-auto">
            {files.map(file => (
              <div
                key={file.id}
                className={`flex items-center gap-2 px-4 py-3 cursor-pointer transition-all ${
                  activeFileId === file.id
                    ? 'bg-white border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setActiveFileId(file.id)}
              >
                <span>{file.name}</span>
                {files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteFile(file.id)
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Editor */}
          <div className="h-96 md:h-screen/2 lg:h-[600px] border-b border-gray-200">
            {activeFile && (
              <Editor
                height="100%"
                language={activeFile.language}
                value={activeFile.content}
                onChange={handleCodeChange}
                theme={theme}
                onMount={(editor) => {
                  editorRef.current = editor
                }}
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  formatOnPaste: true,
                  formatOnType: true,
                  wordWrap: 'on',
                  tabSize: 2,
                }}
              />
            )}
          </div>

          {/* Status Bar */}
          <div className="bg-gray-100 border-t border-gray-200 px-4 py-2 text-sm text-gray-600 flex justify-between">
            <span>{activeFile?.language.toUpperCase() || 'CODE'}</span>
            <span>Lines: {activeFile?.content.split('\n').length || 0} | Characters: {activeFile?.content.length || 0}</span>
          </div>
        </motion.div>

        {/* Analyze Button */}
        <motion.button
          onClick={handleAnalyzeClick}
          className="w-full mt-6 btn-primary py-3 text-lg font-bold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🔍 Analyze Code
        </motion.button>

        {/* Info Section */}
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-lg shadow-md p-4 mt-4 text-sm text-blue-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p>💡 <strong>Tip:</strong> Write or paste your code above, then click "Analyze Code" to get detailed insights on code quality, security, and performance.</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
