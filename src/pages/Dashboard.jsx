import {
  FilePenLineIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UploadCloudIcon,
  XIcon
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { dummyResumeData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const color = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"]

  const [allresume, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeID, setEditResumeID] = useState('')
  const [user, setUser] = useState(null)

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

  const uploadResume = async (event) => {
    event.preventDefault()
    setShowUploadResume(false)
    const newResumeId = 'resume_' + Date.now()
    const storedUser = localStorage.getItem('user')
    const userName = storedUser ? JSON.parse(storedUser).name : 'Your Name'
    const newResume = {
      _id: newResumeId,
      title: title || 'Uploaded Resume',
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
    setResume(null)
    navigate(`/app/builder/${newResumeId}`)
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

        <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden">
          Welcome, {user?.name || 'Guest'}
        </p>

        <div className="flex gap-4">

          {/* Create Resume */}
          <button
            onClick={() => setShowCreateResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <PlusIcon
              className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-blue-500 text-white rounded-full"
            />

            <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
              Create Resume
            </p>
          </button>

          {/* Upload Existing */}
          <button
            onClick={() => setShowUploadResume(true)}
            className="w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            <UploadCloudIcon
              className="size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full"
            />

            <p className="text-sm group-hover:text-purple-600 transition-all duration-300">
              Upload Existing
            </p>
          </button>

        </div>

        <hr className="border-slate-300 my-6 sm:w-[305px]" />

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
                  className="absolute top-1 right-1 group-hover:flex items-center hidden"
                >
                  <TrashIcon
                    onClick={() => deleteResume(resume._id)}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
                  />

                  <PencilIcon
                    onClick={() => {
                      setEditResumeID(resume._id)
                      setTitle(resume.title)
                    }}
                    className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"
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

        {/* Upload Resume Modal */}
        {showUploadResume && (
          <form
            onSubmit={uploadResume}
            onClick={() => setShowUploadResume(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center"
          >
            <div
              onClick={e => e.stopPropagation()}
              className="relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6"
            >
              <h2 className="text-xl font-bold mb-4">
                Upload Resume
              </h2>

              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                placeholder="Enter resume title"
                className="w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600"
                required
              />

              <div>
                <label
                  htmlFor="resume-input"
                  className="block text-sm text-slate-700"
                >
                  Select Resume File

                  <div className="flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors">

                    {resume ? (
                      <p className="text-green-700">
                        {resume.name}
                      </p>
                    ) : (
                      <>
                        <UploadCloudIcon className="size-14 stroke-1" />

                        <p>
                          Upload Resume
                        </p>
                      </>
                    )}

                  </div>
                </label>

                <input
                  type="file"
                  id="resume-input"
                  accept=".pdf"
                  hidden
                  onChange={(e) => setResume(e.target.files[0])}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Upload Resume
              </button>

              <XIcon
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                onClick={() => {
                  setShowUploadResume(false)
                  setTitle('')
                  setResume(null)
                }}
              />
            </div>
          </form>
        )}

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