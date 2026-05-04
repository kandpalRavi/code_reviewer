import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaUpload, FaPlay, FaTimes, FaGithub } from 'react-icons/fa'
import Editor from '@monaco-editor/react'
import JSZip from 'jszip'

export default function CodeInput({
  code,
  setCode,
  language,
  setLanguage,
  onAnalyze,
  onBatchAnalyze,
  onRepoAnalyze = () => {},
  notify = () => {},
  isAnalyzing
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [batchFiles, setBatchFiles] = useState([])
  const [githubUrl, setGithubUrl] = useState('')

  const detectLanguage = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'py') return 'python'
    if (ext === 'js' || ext === 'jsx') return 'javascript'
    if (ext === 'java') return 'java'
    return null
  }

  const readTextFile = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => resolve(event.target?.result || '')
    reader.onerror = reject
    reader.readAsText(file)
  })

  const parseZipFiles = async (zipFile) => {
    const zip = await JSZip.loadAsync(zipFile)
    const parsed = []

    for (const [entryName, zipEntry] of Object.entries(zip.files)) {
      if (zipEntry.dir) continue
      const languageFromName = detectLanguage(entryName)
      if (!languageFromName) continue
      const content = await zipEntry.async('string')
      if (!content.trim()) continue
      parsed.push({
        file_name: entryName,
        language: languageFromName,
        code: content
      })
    }
    return parsed
  }

  const loadFilesForBatch = async (fileList) => {
    const loadedBatch = []

    for (const file of fileList) {
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (ext === 'zip') {
        const zipFiles = await parseZipFiles(file)
        loadedBatch.push(...zipFiles)
        continue
      }

      const languageFromName = detectLanguage(file.name)
      if (!languageFromName) continue

      const content = await readTextFile(file)
      if (!content.trim()) continue

      loadedBatch.push({
        file_name: file.name,
        language: languageFromName,
        code: content
      })
    }

    if (loadedBatch.length > 0) {
      setBatchFiles(loadedBatch)
      const first = loadedBatch[0]
      setCode(first.code)
      setLanguage(first.language)
      notify(`Loaded ${loadedBatch.length} file(s) for batch analysis`, 'success')
    } else {
      notify('No supported files found. Use .py, .js/.jsx, .java, or .zip containing these files.', 'error')
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files || [])
    if (files.length > 0) loadFilesForBatch(files)
  }

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      await loadFilesForBatch(files)
    }
  }

  const removeBatchFile = (indexToRemove) => {
    const updated = batchFiles.filter((_, index) => index !== indexToRemove)
    setBatchFiles(updated)
    if (updated.length > 0) {
      setCode(updated[0].code)
      setLanguage(updated[0].language)
    }
  }

  const clearBatchFiles = () => {
    setBatchFiles([])
  }

  return (
    <motion.div
      className="card mb-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <label className="font-medium text-gray-700">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
          </select>
        </div>

        <div className="flex gap-2">
          <label className="btn-secondary cursor-pointer flex items-center space-x-2">
            <FaUpload />
            <span>Upload File(s)/ZIP</span>
            <input
              type="file"
              accept=".py,.js,.jsx,.java,.zip"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          
          <motion.button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlay />
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Code'}</span>
          </motion.button>

          <motion.button
            onClick={() => onBatchAnalyze(batchFiles)}
            disabled={isAnalyzing || batchFiles.length === 0}
            className="btn-primary flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlay />
            <span>{isAnalyzing ? 'Analyzing...' : `Batch Analyze (${batchFiles.length})`}</span>
          </motion.button>
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <p className="mb-2 text-sm font-semibold text-gray-700">Analyze GitHub Repository (public repo)</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/owner/repository"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
          <motion.button
            onClick={() => onRepoAnalyze(githubUrl)}
            disabled={isAnalyzing || !githubUrl.trim()}
            className="btn-secondary flex items-center justify-center space-x-2 disabled:opacity-60"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaGithub />
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Repo'}</span>
          </motion.button>
        </div>
        <p className="mt-2 text-xs text-gray-500">Supports .py, .js/.jsx and .java files from the repository.</p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg overflow-hidden transition-all ${
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 bg-white'
        }`}
      >
        {code ? (
          <Editor
            height="400px"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <FaUpload className="text-6xl mb-4" />
            <p className="text-lg font-medium">Drag & drop your code file here</p>
            <p className="text-sm">or paste your code in the editor</p>
          </div>
        )}
      </div>

      {batchFiles.length > 0 && (
        <div className="mt-4 border border-gray-200 rounded-lg p-3 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">
              Batch files loaded ({batchFiles.length})
            </p>
            <button
              onClick={clearBatchFiles}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
            {batchFiles.map((file, index) => (
              <span
                key={`${file.file_name}-${index}`}
                className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-700"
              >
                <span className="max-w-[180px] truncate">{file.file_name}</span>
                <button
                  onClick={() => removeBatchFile(index)}
                  className="text-gray-400 hover:text-red-600"
                  title="Remove file"
                >
                  <FaTimes />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-primary-500 bg-opacity-10 flex items-center justify-center pointer-events-none"
        >
          <p className="text-2xl font-bold text-primary-700">Drop your file here</p>
        </motion.div>
      )}
    </motion.div>
  )
}
