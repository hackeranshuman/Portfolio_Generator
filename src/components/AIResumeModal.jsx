import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Upload,
  FileText,
  Key,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  ClipboardPaste,
  Wand2
} from 'lucide-react'
import {
  parseResumeWithGemini,
  getGeminiApiKey,
  setGeminiApiKey,
  SAMPLE_RESUME_TEXT
} from '../services/geminiParser'

const AIResumeModal = ({
  isOpen,
  onClose,
  onSuccess,
  isUpdateMode = false,
  currentResumeId = null
}) => {
  const [activeTab, setActiveTab] = useState('upload') // 'upload' | 'paste' | 'sample'
  const [resumeText, setResumeText] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(0)
  const [customTitle, setCustomTitle] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      const storedKey = getGeminiApiKey()
      setApiKey(storedKey)
      setError('')
      setLoading(false)
      setCurrentStep('')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setFileSize((file.size / 1024).toFixed(1))
    setError('')

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content === 'string') {
        setResumeText(content)
      }
    }
    reader.onerror = () => {
      setError('Failed to read the file. Please try again or paste the text directly.')
    }
    reader.readAsText(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (!file) return

    setFileName(file.name)
    setFileSize((file.size / 1024).toFixed(1))
    setError('')

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result
      if (typeof content === 'string') {
        setResumeText(content)
      }
    }
    reader.onerror = () => {
      setError('Failed to read the dropped file.')
    }
    reader.readAsText(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleLoadSample = () => {
    setResumeText(SAMPLE_RESUME_TEXT)
    setFileName('sample_software_engineer_resume.txt')
    setFileSize('1.8')
    setActiveTab('paste')
    setError('')
  }

  const handleGenerate = async (e) => {
    e?.preventDefault()
    setError('')

    const keyToUse = apiKey.trim()
    if (!keyToUse) {
      setError('Please provide your Google Gemini API Key to generate the portfolio.')
      return
    }

    if (!resumeText || resumeText.trim().length < 15) {
      setError('Please upload a .txt file or paste your resume content before generating.')
      return
    }

    // Save API key
    setGeminiApiKey(keyToUse)

    setLoading(true)
    setCurrentStep('1/3: Reading resume details...')

    try {
      await new Promise(r => setTimeout(r, 400))
      setCurrentStep('2/3: Analyzing with Gemini AI & extracting sections...')

      const structuredPortfolio = await parseResumeWithGemini(resumeText, keyToUse)

      setCurrentStep('3/3: Assembling portfolio layout & themes...')
      await new Promise(r => setTimeout(r, 300))

      if (customTitle.trim()) {
        structuredPortfolio.title = customTitle.trim()
      }

      if (isUpdateMode && currentResumeId) {
        structuredPortfolio._id = currentResumeId
      }

      onSuccess(structuredPortfolio)
      onClose()
    } catch (err) {
      console.error('AI Generation error:', err)
      setError(err.message || 'An error occurred during AI portfolio generation.')
    } finally {
      setLoading(false)
      setCurrentStep('')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient badge */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl shadow-inner">
                <Sparkles className="size-6 text-yellow-300 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {isUpdateMode ? 'Update Portfolio with AI (.txt)' : 'Generate Portfolio from Resume (.txt)'}
                </h2>
                <p className="text-xs text-purple-100 mt-0.5">
                  Powered by Google Gemini AI • Converts raw text into an interactive portfolio
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5">
          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Generation Notice</p>
                <p className="mt-0.5 leading-relaxed">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => setError('')}
                className="text-red-400 hover:text-red-700 text-sm font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* Gemini API Key Input Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Key className="size-3.5 text-purple-600" />
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-medium text-purple-600 hover:text-purple-700 hover:underline inline-flex items-center gap-1"
              >
                Get Free API Key <ExternalLink className="size-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                placeholder="AIzaSy... (Enter your Gemini API key)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full text-xs font-mono px-3 py-2 pr-10 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                title={showApiKey ? 'Hide Key' : 'Show Key'}
              >
                {showApiKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Your key is saved locally in your browser and used only for portfolio generation.
            </p>
          </div>

          {/* Portfolio Title (Optional) */}
          {!isUpdateMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Portfolio Title (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Senior Full Stack Engineer Portfolio (Leave blank to auto-detect)"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>
          )}

          {/* Source Selector Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">Resume Source</span>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Wand2 className="size-3" />
                Try with sample resume text
              </button>
            </div>

            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg text-xs font-medium mb-3">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'upload'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="size-3.5" />
                Upload .txt File
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className={`py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'paste'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ClipboardPaste className="size-3.5" />
                Paste Text
              </button>
            </div>

            {/* Tab 1: Upload File */}
            {activeTab === 'upload' && (
              <div>
                <label
                  htmlFor="ai-resume-file-input"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="border-2 border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50/40 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group"
                >
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-full group-hover:scale-110 transition-transform">
                    <FileText className="size-6" />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-800">
                    {fileName ? fileName : 'Click to select a .txt file or drag & drop'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {fileSize ? `${fileSize} KB • Ready for AI conversion` : 'Supports plain text files (.txt, .md)'}
                  </p>
                </label>
                <input
                  id="ai-resume-file-input"
                  type="file"
                  accept=".txt,.md,text/plain"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {resumeText && (
                  <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-semibold text-slate-700">Preview extracted text</span>
                      <span>{resumeText.length} characters</span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-mono line-clamp-3 bg-white p-2 rounded border border-slate-200">
                      {resumeText}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Paste Text */}
            {activeTab === 'paste' && (
              <div>
                <textarea
                  rows={8}
                  placeholder="Paste your complete resume details here, including contact info, professional summary, work experience, projects, education, and skills..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none leading-relaxed"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>Formatting is flexible; Gemini will intelligently structure it.</span>
                  <span>{resumeText.length} chars</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading || !resumeText.trim()}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>{currentStep || 'Generating with Gemini AI...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="size-4 text-yellow-300" />
                <span>{isUpdateMode ? 'Regenerate Portfolio with AI' : 'Generate Portfolio with AI'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIResumeModal
