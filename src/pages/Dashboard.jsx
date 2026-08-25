import {
  FilePenLineIcon,
  PencilIcon,
  PlusIcon,
  Sparkles,
  TrashIcon,
  UploadCloudIcon,
  XIcon,
  Key,
  Eye
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { dummyResumeData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import AIResumeModal from '../components/AIResumeModal'
import { getGeminiApiKey } from '../services/geminiParser'

const Dashboard = () => {
  const color = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"]

  const [allresume, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [title, setTitle] = useState('')
  const [editResumeID, setEditResumeID] = useState('')
  const [user, setUser] = useState(null)
  const [hasApiKey, setHasApiKey] = useState(false)

  const navigate = useNavigate()

  const loadAllResumes = async () => {
    const localResumes = localStorage.getItem('resumes')
    if (localResumes) {
      setAllResumes(JSON.parse(localResumes))
    } else {
      setAllResumes(dummyResumeData)
      localStorage.setItem('resumes', JSON.stringify(dummyResumeData))
    }
  }

  const checkApiKey = () => {
    const key = getGeminiApiKey()
    setHasApiKey(Boolean(key && key !== 'YOUR_GEMINI_API_KEY_HERE'))
  }

  const createResume = async (event) => {
    event.preventDefault()
    setShowCreateResume(false)
    const newResumeId = 'resume_' + Date.now()
    const storedUser = localStorage.getItem('user')
    const userName = storedUser ? JSON.parse(storedUser).name : 'Your Name'
    const newResume = {
      _id: newResumeId,
      title: title || 'New Resume',
      personal_info: {
        full_name: userName,
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        website: '',
        profession: '',
        image: null
      },
      professional_summary: '',
      experience: [],
      education: [],
      project: [],
      skills: [],
      template: 'modern',
      accent_color: '#EC4899',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
    const updatedResumes = [newResume, ...allresume]
    setAllResumes(updatedResumes)
    localStorage.setItem('resumes', JSON.stringify(updatedResumes))
    setTitle('')
    navigate(`/app/builder/${newResumeId}`)
  }

  const handleAISuccess = (generatedPortfolio) => {
    const updatedResumes = [generatedPortfolio, ...allresume]
    setAllResumes(updatedResumes)
    localStorage.setItem('resumes', JSON.stringify(updatedResumes))
    checkApiKey()
    navigate(`/app/builder/${generatedPortfolio._id}`)
  }

  const editTitle = async (event) => {
    event.preventDefault()
    const updated = allresume.map(res => {
      if (res._id === editResumeID) {
        return { ...res, title: title, updatedAt: new Date().toISOString() }
      }
      return res
    })
    setAllResumes(updated)
    localStorage.setItem('resumes', JSON.stringify(updated))
    setEditResumeID('')
    setTitle('')
  }

  const deleteResume = async (resumeID) => {
    const confirm = window.confirm("Are you sure you want to delete this resume?")
    if (confirm) {
      const updated = allresume.filter(resume => resume._id !== resumeID)
      setAllResumes(updated)
      localStorage.setItem('resumes', JSON.stringify(updated))
    }
  }

  useEffect(() => {
    loadAllResumes()
    checkApiKey()
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      setUser({ name: 'Guest' })
    }
  }, [])

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Welcome, {user?.name || 'Guest'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Create, edit, and generate AI-powered portfolios effortlessly.
            </p>
          </div>

          {/* Gemini API Key status button */}
          <button
            type="button"
            onClick={() => setShowAIModal(true)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              hasApiKey
                ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Key className="size-3.5" />
            <span>{hasApiKey ? 'Gemini API Connected' : 'Set Gemini API Key'}</span>
            <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
          </button>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">

          {/* 1. Generate with AI from .txt */}
          <button
            onClick={() => setShowAIModal(true)}
            className="w-full bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-blue-500/10 sm:max-w-40 h-48 flex flex-col items-center justify-center rounded-xl gap-2.5 text-slate-700 border-2 border-dashed border-purple-400 group hover:border-purple-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
              AI Powered
            </div>

            <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-2xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Sparkles className="size-6 text-yellow-300" />
            </div>

            <div className="text-center px-2">
              <p className="text-xs font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                AI .txt to Portfolio
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Convert resume file with Gemini
              </p>
            </div>
          </button>

          {/* 2. Create Resume Manually */}
          <button
            onClick={() => setShowCreateResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-xl gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <PlusIcon
              className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-400 to-blue-500 text-white rounded-full group-hover:scale-105"
            />

            <p className="text-xs font-semibold group-hover:text-indigo-600 transition-colors">
              Create Blank
            </p>
          </button>

          {/* 3. Upload Existing (Also triggers AI modal for .txt/paste) */}
          <button
            onClick={() => setShowAIModal(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-xl gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-emerald-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <UploadCloudIcon
              className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-full group-hover:scale-105"
            />

            <p className="text-xs font-semibold group-hover:text-emerald-600 transition-colors">
              Import Resume
            </p>
          </button>

        </div>

        <hr className="border-slate-200 my-6 sm:w-[470px]" />

        {/* Resumes */}
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-4">
          {allresume.map((resume, index) => {
            const basecolor = color[index % color.length]

            return (
              <button
                key={index}
                onClick={() => navigate(`/app/builder/${resume._id}`)}
                className="relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${basecolor}10, ${basecolor}40)`,
                  borderColor: basecolor + '40'
                }}
              >
                <FilePenLineIcon
                  className="size-7 group-hover:scale-105 transition-all"
                  style={{ color: basecolor }}
                />

                <p
                  className="text-sm group-hover:scale-105 transition-all px-2 text-center"
                  style={{ color: basecolor }}
                >
                  {resume.title}
                </p>

                <p
                  className="absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center"
                  style={{ color: basecolor + '90' }}
                >
                  Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                <div
                  onClick={e => e.stopPropagation()}
                  className="absolute top-1 right-1 group-hover:flex items-center gap-0.5 hidden bg-white/80 backdrop-blur-xs p-0.5 rounded-lg shadow-xs"
                >
                  <Eye
                    title="Live Portfolio View"
                    onClick={() => navigate(`/view/${resume._id}`)}
                    className="size-6 p-1 hover:bg-slate-200/80 rounded text-slate-700 hover:text-purple-600 transition-colors"
                  />

                  <PencilIcon
                    title="Rename"
                    onClick={() => {
                      setEditResumeID(resume._id)
                      setTitle(resume.title)
                    }}
                    className="size-6 p-1 hover:bg-slate-200/80 rounded text-slate-700 hover:text-blue-600 transition-colors"
                  />

                  <TrashIcon
                    title="Delete"
                    onClick={() => deleteResume(resume._id)}
                    className="size-6 p-1 hover:bg-red-100 rounded text-slate-700 hover:text-red-600 transition-colors"
                  />
                </div>

              </button>
            )
          })}
        </div>

        {showCreateResume && (
          <form
            onSubmit={createResume}
            onClick={() => setShowCreateResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">
                Create a Resume
              </h2>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                required
              />

              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Create Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowCreateResume(false)
                  setTitle('')
                }}
              />
            </div>
          </form>
        )}

        {/* AI Resume Importer Modal */}
        <AIResumeModal
          isOpen={showAIModal}
          onClose={() => setShowAIModal(false)}
          onSuccess={handleAISuccess}
        />

        {editResumeID && (
          <form
            onSubmit={editTitle}
            onClick={() => setEditResumeID('')}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">
                Edit Resume Title
              </h2>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                required
              />

              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Update
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setEditResumeID('')
                  setTitle('')
                }}
              />
            </div>
          </form>
        )}

      </div>
    </div>
  )
}

export default Dashboard