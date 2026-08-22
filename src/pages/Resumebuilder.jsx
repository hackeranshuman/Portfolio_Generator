import React, { useEffect, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Briefcase,
  FileText,
  FolderIcon,
  GraduationCap,
  User,
  Palette,
  Layout,
  Download,
  Eye,
  EyeOff,
  CheckCircle2,
  Plus,
  Trash2,
  ChevronDown,
  Globe,
  Lock,
  Sparkles,
  Check,
  Key,
  Loader2,
  X
} from 'lucide-react'
import PersonalInfoFrom from '../components/PersonalInfoFrom'

const TEMPLATE_OPTIONS = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'A clean, traditional resume format with clear sections and professional typography'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Sleek design with strategic use of color and modern font choices'
  },
  {
    id: 'minimal-image',
    name: 'Minimal Image',
    description: 'Minimal design with a single image and clean typography'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean minimalist single-column design focused on content and clarity'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Polished corporate layout with accent sidebars and structured sections'
  }
]

const ACCENT_COLORS = [
  { name: 'Magenta Pink', hex: '#EC4899' },
  { name: 'Royal Blue', hex: '#3B82F6' },
  { name: 'Emerald Green', hex: '#10B981' },
  { name: 'Indigo Purple', hex: '#6366F1' },
  { name: 'Deep Violet', hex: '#8B5CF6' },
  { name: 'Vibrant Orange', hex: '#F97316' },
  { name: 'Teal', hex: '#14B8A6' },
  { name: 'Coral Red', hex: '#EF4444' },
  { name: 'Dark Slate', hex: '#1E293B' },
  { name: 'Rose', hex: '#F43F5E' }
]

const FORM_SECTIONS = [
  { id: 'personal', name: 'Personal Info', icon: User },
  { id: 'summary', name: 'Summary', icon: FileText },
  { id: 'experience', name: 'Experience', icon: Briefcase },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'project', name: 'Project', icon: FolderIcon },
  { id: 'skills', name: 'Skills', icon: FolderIcon }
]

const Resumebuilder = () => {
  const { resumeID } = useParams()
  const previewRef = useRef(null)

  const [activeTab, setActiveTab] = useState('template') // 'template' | 'accent' | 'form'
  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false)
  const [skillInput, setSkillInput] = useState('')

  // Gemini AI state
  const [geminiApiKey, setGeminiApiKey] = useState(
    () => localStorage.getItem('gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || ''
  )
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [tempApiKey, setTempApiKey] = useState('')
  const [loadingAiField, setLoadingAiField] = useState(null)
  const [aiError, setAiError] = useState('')
  const [lastRequestTime, setLastRequestTime] = useState(0)
  const [requestCount, setRequestCount] = useState(0)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: "Anshuman's Resume",
    personal_info: {
      full_name: 'Anshuman Singh',
      email: 'ansh@example.com',
      phone: '0 123456789',
      location: 'NY, USA',
      linkedin: 'https://www.linkedin.com',
      website: 'https://www.example.com',
      profession: 'Full Stack Developer',
      image: null
    },
    professional_summary:
      'Highly analytical Data Analyst with 6 years of experience transforming complex datasets into actionable insights using SQL, Python, and advanced visualization tools.',
    experience: [
      {
        company: 'Example Technologies.',
        position: 'Senior Full Stack Developer',
        start_date: '2023-06',
        end_date: 'Present',
        description:
          'Architected, developed, and deployed innovative full-stack applications at Example Technologies.\ncreating robust back-end systems and intuitive front-end interfaces to deliver meaningful digital experiences.',
        is_current: true,
        _id: '1'
      }
    ],
    education: [
      {
        institution: 'Example Institute of Technology',
        degree: 'B.TECH',
        field: 'CSE',
        graduation_date: '2023-05',
        gpa: '8.7',
        _id: '1'
      }
    ],
    project: [
      {
        name: 'Team Task Management System',
        type: 'Web Application',
        description:
          'Collaborative task management system designed for teams to create, assign, track, and manage tasks in real time.',
        _id: '1'
      }
    ],
    skills: ['JavaScript', 'React JS', 'Full Stack Development', 'Git', 'NodeJS', 'TypeScript'],
    template: 'modern',
    accent_color: '#EC4899',
    public: false
  })
  
  // Cooldown timer interval
  useEffect(() => {
    let timer
    if (cooldownSeconds > 0) {
      timer = setInterval(() => {
        setCooldownSeconds(prev => (prev > 0 ? prev - 1 : 0))
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [cooldownSeconds])

  const loadExistingResume = async () => {
    const localResumes = localStorage.getItem('resumes')
    const resumesList = localResumes ? JSON.parse(localResumes) : dummyResumeData
    const resume = resumesList.find(r => r._id === resumeID)
    if (resume) {
      setResumeData({
        ...resume,
        template: resume.template || resume.templete || 'modern',
        accent_color: resume.accent_color || '#EC4899'
      })
      document.title = resume.title || 'Resume Builder'
    }
  }

  useEffect(() => {
    if (resumeID) {
      loadExistingResume()
    }
  }, [resumeID])

  useEffect(() => {
    if (resumeData && resumeData._id) {
      const localResumes = localStorage.getItem('resumes')
      const resumesList = localResumes ? JSON.parse(localResumes) : dummyResumeData
      const index = resumesList.findIndex(r => r._id === resumeData._id)
      if (index !== -1) {
        resumesList[index] = {
          ...resumeData,
          updatedAt: new Date().toISOString()
        }
        localStorage.setItem('resumes', JSON.stringify(resumesList))
      }
    }
  }, [resumeData])

  const activeSection = FORM_SECTIONS[activeSectionIndex]

  const handleSaveApiKey = () => {
    const key = tempApiKey.trim()
    if (!key) {
      setAiError('Please enter a valid Gemini API key.')
      return
    }
    localStorage.setItem('gemini_api_key', key)
    setGeminiApiKey(key)
    setShowApiKeyModal(false)
    setTempApiKey('')
    setAiError('')
  }

  // Google Gemini API Call Handler with Rate Limiting
  const enhanceWithAI = async (type, itemIndex = null) => {
    setAiError('')
    const now = Date.now()

    // Rate Limit 1: 5-second cooldown between requests
    const timeSinceLast = Math.floor((now - lastRequestTime) / 1000)
    if (timeSinceLast < 5) {
      const waitTime = 5 - timeSinceLast
      setCooldownSeconds(waitTime)
      setAiError(`⏳ Cooldown active: Please wait ${waitTime}s before generating again.`)
      return
    }

    // Rate Limit 2: Max 10 requests per 2 minutes
    if (requestCount >= 10) {
      setAiError('⚠️ Rate limit reached (Max 10 AI enhancements per session). Please wait a minute before trying again.')
      return
    }

    if (!geminiApiKey || geminiApiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      setAiError('⚠️ Gemini API key not configured. Please add your VITE_GEMINI_API_KEY in the .env file.')
      return
    }

    let fieldId = type
    let promptText = ''
    let currentContent = ''

    if (type === 'summary') {
      fieldId = 'summary'
      currentContent = resumeData.professional_summary || ''
      promptText = `You are an expert resume reviewer and career coach. Please enhance and refine the following professional summary for a ${resumeData.personal_info?.profession || 'professional'}. Make it impactful, professional, and clear with active phrasing. Output ONLY the enhanced summary text directly without conversational intro or markdown bolding:\n\nOriginal Text:\n${currentContent || 'Experienced software developer skilled in building scalable applications.'}`
    } else if (type === 'experience' && itemIndex !== null) {
      fieldId = `experience-${itemIndex}`
      currentContent = resumeData.experience?.[itemIndex]?.description || ''
      const pos = resumeData.experience?.[itemIndex]?.position || 'position'
      const comp = resumeData.experience?.[itemIndex]?.company || 'company'
      promptText = `You are an expert technical resume writer. Enhance the following work experience description for the position of "${pos}" at "${comp}". Use strong action verbs, quantifiable achievements where possible, and bullet points. Output ONLY the improved description directly without conversational intro or commentary:\n\nOriginal Description:\n${currentContent || 'Developed features and fixed bugs.'}`
    } else if (type === 'project' && itemIndex !== null) {
      fieldId = `project-${itemIndex}`
      currentContent = resumeData.project?.[itemIndex]?.description || ''
      const projName = resumeData.project?.[itemIndex]?.name || 'project'
      promptText = `You are a technical resume writer. Enhance the following description for the project "${projName}". Make it sound technically impressive, professional, and concise. Output ONLY the improved project description directly without conversational commentary:\n\nOriginal Description:\n${currentContent || 'Built a web app.'}`
    }

    setLoadingAiField(fieldId)
    setLastRequestTime(now)
    setCooldownSeconds(5)
    setRequestCount(prev => prev + 1)

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: promptText }]
              }
            ]
          })
        }
      )

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}))
        throw new Error(errJson?.error?.message || `API error (${response.status})`)
      }

      const resData = await response.json()
      const generatedText = resData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

      if (generatedText) {
        if (type === 'summary') {
          setResumeData(prev => ({
            ...prev,
            professional_summary: generatedText
          }))
        } else if (type === 'experience' && itemIndex !== null) {
          updateExperience(itemIndex, 'description', generatedText)
        } else if (type === 'project' && itemIndex !== null) {
          updateProject(itemIndex, 'description', generatedText)
        }
      }
    } catch (err) {
      console.error('Gemini AI error:', err)
      setAiError(`AI Enhancement failed: ${err.message}`)
    } finally {
      setLoadingAiField(null)
    }
  }

  // Handlers for experience, education, project, skills updates
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        {
          _id: Date.now().toString(),
          company: '',
          position: '',
          start_date: '',
          end_date: '',
          description: '',
          is_current: false
        }
      ]
    }))
  }

  const updateExperience = (index, field, value) => {
    setResumeData(prev => {
      const updated = [...(prev.experience || [])]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, experience: updated }
    })
  }

  const removeExperience = index => {
    setResumeData(prev => ({
      ...prev,
      experience: (prev.experience || []).filter((_, i) => i !== index)
    }))
  }

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...(prev.education || []),
        {
          _id: Date.now().toString(),
          institution: '',
          degree: '',
          field: '',
          graduation_date: '',
          gpa: ''
        }
      ]
    }))
  }

  const updateEducation = (index, field, value) => {
    setResumeData(prev => {
      const updated = [...(prev.education || [])]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, education: updated }
    })
  }

  const removeEducation = index => {
    setResumeData(prev => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index)
    }))
  }

  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      project: [
        ...(prev.project || []),
        {
          _id: Date.now().toString(),
          name: '',
          type: '',
          description: ''
        }
      ]
    }))
  }

  const updateProject = (index, field, value) => {
    setResumeData(prev => {
      const updated = [...(prev.project || [])]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, project: updated }
    })
  }

  const removeProject = index => {
    setResumeData(prev => ({
      ...prev,
      project: (prev.project || []).filter((_, i) => i !== index)
    }))
  }

  const handleAddSkill = () => {
    if (!skillInput.trim()) return
    setResumeData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), skillInput.trim()]
    }))
    setSkillInput('')
  }

  const removeSkill = index => {
    setResumeData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter((_, i) => i !== index)
    }))
  }

  // Export / Download Handlers
  const handleDownloadPDF = () => {
    setDownloadMenuOpen(false)
    window.print()
  }

  const handleDownloadJSON = () => {
    setDownloadMenuOpen(false)
    const jsonString = JSON.stringify(resumeData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(resumeData.personal_info?.full_name || 'Resume').replace(/\s+/g, '_')}_data.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadTXT = () => {
    setDownloadMenuOpen(false)
    const info = resumeData.personal_info || {}
    let text = `${info.full_name || 'Your Name'}\n`
    text += `${info.profession || ''}\n`
    text += `Email: ${info.email || ''} | Phone: ${info.phone || ''} | Location: ${info.location || ''}\n`
    if (info.linkedin) text += `LinkedIn: ${info.linkedin}\n`
    if (info.website) text += `Website: ${info.website}\n`
    text += `\n=========================================\nSUMMARY\n=========================================\n`
    text += `${resumeData.professional_summary || ''}\n`

    if (resumeData.experience?.length) {
      text += `\n=========================================\nEXPERIENCE\n=========================================\n`
      resumeData.experience.forEach(exp => {
        text += `\n${exp.position} - ${exp.company} (${exp.start_date} - ${exp.end_date})\n${exp.description}\n`
      })
    }

    if (resumeData.education?.length) {
      text += `\n=========================================\nEDUCATION\n=========================================\n`
      resumeData.education.forEach(edu => {
        text += `\n${edu.degree} in ${edu.field} - ${edu.institution} (${edu.graduation_date})\n`
      })
    }

    if (resumeData.skills?.length) {
      text += `\n=========================================\nSKILLS\n=========================================\n`
      text += resumeData.skills.join(', ') + '\n'
    }

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(info.full_name || 'Resume').replace(/\s+/g, '_')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadPNG = () => {
    setDownloadMenuOpen(false)
    const element = previewRef.current
    if (!element) return

    const htmlString = new XMLSerializer().serializeToString(element)
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${element.offsetWidth}" height="${element.offsetHeight}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${htmlString}
        </div>
      </foreignObject>
    </svg>`

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      canvas.width = element.offsetWidth * 2
      canvas.height = element.offsetHeight * 2
      ctx.scale(2, 2)
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)

      const a = document.createElement('a')
      a.download = `${(resumeData.personal_info?.full_name || 'Resume').replace(/\s+/g, '_')}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
    }
    img.src = url
  }

  // Render template preview based on selected template ID
  const renderResumeContent = () => {
    const currentTemplate = resumeData.template || resumeData.templete || 'modern'
    const accent = resumeData.accent_color || '#EC4899'
    const info = resumeData.personal_info || {}

    const profileImgSrc = info.image
      ? removeBackground && info.processed_image
        ? info.processed_image
        : typeof info.image === 'string'
        ? info.image
        : URL.createObjectURL(info.image)
      : null

    if (currentTemplate === 'modern') {
      return (
        <div className='bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden text-slate-800'>
          {/* Header Banner filled with accent color - matches screenshot! */}
          <div
            style={{ backgroundColor: accent }}
            className='p-8 text-white transition-colors duration-300 flex justify-between items-center'
          >
            <div>
              <h1 className='text-3xl sm:text-4xl font-bold tracking-tight'>
                {info.full_name || 'Your Name'}
              </h1>
              <p className='text-lg font-medium opacity-90 mt-1'>
                {info.profession || 'Your Profession'}
              </p>
            </div>
            {profileImgSrc && (
              <img
                src={profileImgSrc}
                alt='Profile'
                style={{
                  borderColor: 'white',
                  backgroundColor:
                    removeBackground && info.bg_type === 'solid'
                      ? info.bg_color || accent
                      : 'transparent'
                }}
                className='w-20 h-20 rounded-full object-cover border-3 shadow-sm'
              />
            )}
          </div>

          <div className='p-6 sm:p-8 space-y-6'>
            {/* Contact info bar */}
            <div className='flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600 border-b border-slate-100 pb-4'>
              {info.email && (
                <span className='flex items-center gap-1.5'>
                  ✉️ {info.email}
                </span>
              )}
              {info.phone && (
                <span className='flex items-center gap-1.5'>
                  📞 {info.phone}
                </span>
              )}
              {info.location && (
                <span className='flex items-center gap-1.5'>
                  📍 {info.location}
                </span>
              )}
              {info.linkedin && (
                <a
                  href={info.linkedin}
                  target='_blank'
                  rel='noreferrer'
                  className='hover:underline font-medium'
                  style={{ color: accent }}
                >
                  🔗 LinkedIn
                </a>
              )}
              {info.website && (
                <a
                  href={info.website}
                  target='_blank'
                  rel='noreferrer'
                  className='hover:underline font-medium'
                  style={{ color: accent }}
                >
                  🌐 Website
                </a>
              )}
            </div>

            {/* Summary */}
            {resumeData.professional_summary && (
              <div>
                <h2
                  className='text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1'
                  style={{ color: accent, borderColor: `${accent}40` }}
                >
                  Professional Summary
                </h2>
                <p className='text-xs leading-relaxed text-slate-700 whitespace-pre-line'>
                  {resumeData.professional_summary}
                </p>
              </div>
            )}

            {/* Experience */}
            {resumeData.experience?.length > 0 && (
              <div>
                <h2
                  className='text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1'
                  style={{ color: accent, borderColor: `${accent}40` }}
                >
                  Work Experience
                </h2>
                <div className='space-y-4'>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={exp._id || idx} className='text-xs'>
                      <div className='flex justify-between items-baseline font-semibold text-slate-800'>
                        <span className='text-sm font-bold' style={{ color: accent }}>
                          {exp.position}
                        </span>
                        <span className='text-slate-500 font-normal'>
                          {exp.start_date} - {exp.end_date || 'Present'}
                        </span>
                      </div>
                      <p className='text-xs font-medium text-slate-600 mt-0.5'>
                        {exp.company}
                      </p>
                      {exp.description && (
                        <p className='text-slate-600 mt-1 whitespace-pre-line leading-relaxed'>
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education?.length > 0 && (
              <div>
                <h2
                  className='text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1'
                  style={{ color: accent, borderColor: `${accent}40` }}
                >
                  Education
                </h2>
                <div className='space-y-3'>
                  {resumeData.education.map((edu, idx) => (
                    <div key={edu._id || idx} className='text-xs flex justify-between items-start'>
                      <div>
                        <p className='font-bold text-slate-800'>
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </p>
                        <p className='text-slate-600'>{edu.institution}</p>
                      </div>
                      <div className='text-right text-slate-500'>
                        <p>{edu.graduation_date}</p>
                        {edu.gpa && <p className='text-slate-400'>GPA: {edu.gpa}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resumeData.project?.length > 0 && (
              <div>
                <h2
                  className='text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1'
                  style={{ color: accent, borderColor: `${accent}40` }}
                >
                  Projects
                </h2>
                <div className='space-y-3'>
                  {resumeData.project.map((proj, idx) => (
                    <div key={proj._id || idx} className='text-xs'>
                      <div className='font-bold text-slate-800 flex items-center justify-between'>
                        <span>{proj.name}</span>
                        {proj.type && (
                          <span className='text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-normal'>
                            {proj.type}
                          </span>
                        )}
                      </div>
                      <p className='text-slate-600 mt-1 leading-relaxed'>{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {resumeData.skills?.length > 0 && (
              <div>
                <h2
                  className='text-sm font-bold uppercase tracking-wider mb-3 border-b pb-1'
                  style={{ color: accent, borderColor: `${accent}40` }}
                >
                  Skills & Expertise
                </h2>
                <div className='flex flex-wrap gap-1.5'>
                  {resumeData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className='px-2.5 py-1 text-xs font-medium rounded-full transition-all'
                      style={{
                        backgroundColor: `${accent}15`,
                        color: accent,
                        border: `1px solid ${accent}30`
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }

    if (currentTemplate === 'classic') {
      return (
        <div className='bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-slate-800 space-y-6'>
          {/* Classic Centered Header */}
          <div className='text-center pb-4 border-b-2 flex flex-col items-center' style={{ borderColor: accent }}>
            {profileImgSrc && (
              <img
                src={profileImgSrc}
                alt='Profile'
                style={{
                  borderColor: accent,
                  backgroundColor:
                    removeBackground && info.bg_type === 'solid'
                      ? info.bg_color || accent
                      : 'transparent'
                }}
                className='w-20 h-20 rounded-full object-cover border-3 shadow-sm mb-3'
              />
            )}
            <h1 className='text-3xl font-bold tracking-tight text-slate-900'>
              {info.full_name || 'Your Full Name'}
            </h1>
            <p className='text-md font-medium mt-1' style={{ color: accent }}>
              {info.profession || 'Your Profession'}
            </p>
            <div className='flex flex-wrap justify-center gap-3 text-xs text-slate-600 mt-3'>
              {info.email && <span>{info.email}</span>}
              {info.phone && <span>• {info.phone}</span>}
              {info.location && <span>• {info.location}</span>}
              {info.linkedin && (
                <span>
                  •{' '}
                  <a href={info.linkedin} className='underline' style={{ color: accent }}>
                    LinkedIn
                  </a>
                </span>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {resumeData.professional_summary && (
            <div>
              <h2
                className='text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2'
                style={{ color: accent, borderColor: accent }}
              >
                Professional Summary
              </h2>
              <p className='text-xs leading-relaxed text-slate-700 whitespace-pre-line'>
                {resumeData.professional_summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {resumeData.experience?.length > 0 && (
            <div>
              <h2
                className='text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3'
                style={{ color: accent, borderColor: accent }}
              >
                Work Experience
              </h2>
              <div className='space-y-4'>
                {resumeData.experience.map((exp, idx) => (
                  <div key={exp._id || idx} className='text-xs'>
                    <div className='flex justify-between font-bold text-slate-800'>
                      <span>{exp.position} — {exp.company}</span>
                      <span className='text-slate-500 font-normal'>{exp.start_date} - {exp.end_date || 'Present'}</span>
                    </div>
                    <p className='text-slate-600 mt-1 leading-relaxed whitespace-pre-line'>
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resumeData.education?.length > 0 && (
            <div>
              <h2
                className='text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3'
                style={{ color: accent, borderColor: accent }}
              >
                Education
              </h2>
              <div className='space-y-2 text-xs'>
                {resumeData.education.map((edu, idx) => (
                  <div key={edu._id || idx} className='flex justify-between'>
                    <div>
                      <span className='font-bold text-slate-800'>{edu.degree} in {edu.field}</span>
                      <span className='text-slate-600'> — {edu.institution}</span>
                    </div>
                    <span className='text-slate-500'>{edu.graduation_date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {resumeData.skills?.length > 0 && (
            <div>
              <h2
                className='text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3'
                style={{ color: accent, borderColor: accent }}
              >
                Skills & Technologies
              </h2>
              <p className='text-xs text-slate-700 leading-relaxed'>
                {resumeData.skills.join(' • ')}
              </p>
            </div>
          )}
        </div>
      )
    }

    // Minimal Image & Fallbacks
    return (
      <div className='bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-slate-800 space-y-6'>
        {/* Header with image */}
        <div className='flex items-center gap-6 border-b border-slate-200 pb-6'>
          {profileImgSrc && (
            <img
              src={profileImgSrc}
              alt='Profile'
              style={{
                borderColor: accent,
                backgroundColor:
                  removeBackground && info.bg_type === 'solid'
                    ? info.bg_color || accent
                    : 'transparent'
              }}
              className='w-20 h-20 rounded-full object-cover border-3 shadow-sm'
            />
          )}
          <div>
            <h1 className='text-2xl font-bold uppercase tracking-wide' style={{ color: accent }}>
              {info.full_name || 'Your Full Name'}
            </h1>
            <p className='text-md font-medium text-slate-600 mt-0.5'>
              {info.profession || 'Your Profession'}
            </p>
            <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2'>
              {info.email && <span>📧 {info.email}</span>}
              {info.phone && <span>📞 {info.phone}</span>}
              {info.location && <span>📍 {info.location}</span>}
            </div>
          </div>
        </div>

        {/* Summary */}
        {resumeData.professional_summary && (
          <div>
            <h2 className='text-xs font-bold uppercase tracking-widest text-slate-400 mb-2'>
              About Me
            </h2>
            <p className='text-xs leading-relaxed text-slate-700 whitespace-pre-line'>
              {resumeData.professional_summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {resumeData.experience?.length > 0 && (
          <div>
            <h2 className='text-xs font-bold uppercase tracking-widest text-slate-400 mb-3'>
              Work Experience
            </h2>
            <div className='space-y-4'>
              {resumeData.experience.map((exp, idx) => (
                <div key={exp._id || idx} className='text-xs space-y-1'>
                  <div className='flex justify-between font-semibold text-slate-800'>
                    <span style={{ color: accent }}>{exp.position} @ {exp.company}</span>
                    <span className='text-slate-400 font-normal'>{exp.start_date} - {exp.end_date || 'Present'}</span>
                  </div>
                  <p className='text-slate-600 leading-relaxed whitespace-pre-line'>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {resumeData.skills?.length > 0 && (
          <div>
            <h2 className='text-xs font-bold uppercase tracking-widest text-slate-400 mb-3'>
              Skills
            </h2>
            <div className='flex flex-wrap gap-1.5'>
              {resumeData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className='px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs'
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-50 text-slate-800'>
      {/* Top Header Bar matching user screenshot */}
      <header className='bg-white border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-8 py-3.5 no-print'>
        <div className='max-w-7xl mx-auto flex items-center justify-between gap-4'>
          {/* Back link */}
          <Link
            to='/app'
            className='inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors'
          >
            <ArrowLeftIcon className='size-4' />
            Back to Dashboard
          </Link>

          {/* Action buttons */}
          <div className='flex items-center gap-3 relative'>
            {/* Download Button Dropdown */}
            <div className='relative'>
              <button
                type='button'
                onClick={() => setDownloadMenuOpen(prev => !prev)}
                className='inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 active:bg-emerald-300 rounded-lg transition-all shadow-sm'
              >
                <Download className='size-3.5 text-emerald-700' />
                Download
                <ChevronDown className='size-3 text-emerald-700' />
              </button>

              {downloadMenuOpen && (
                <div className='absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2'>
                  <div className='px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100'>
                    Select Export Format
                  </div>
                  <button
                    onClick={handleDownloadPDF}
                    className='w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between font-medium'
                  >
                    <span>📄 PDF Document (.pdf)</span>
                    <span className='text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded'>Print / Save</span>
                  </button>
                  <button
                    onClick={handleDownloadPNG}
                    className='w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between font-medium'
                  >
                    <span>🖼️ Image (.png)</span>
                    <span className='text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded'>HD Image</span>
                  </button>
                  <button
                    onClick={handleDownloadJSON}
                    className='w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between font-medium'
                  >
                    <span>💾 Resume Data (.json)</span>
                    <span className='text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded'>Backup</span>
                  </button>
                  <button
                    onClick={handleDownloadTXT}
                    className='w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between font-medium'
                  >
                    <span>📝 Plain Text (.txt)</span>
                    <span className='text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded'>Text</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        {aiError && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center justify-between no-print'>
            <span>⚠️ {aiError}</span>
            <button onClick={() => setAiError('')} className='text-red-500 hover:text-red-800 font-bold'>
              ×
            </button>
          </div>
        )}

        <div className='grid lg:grid-cols-12 gap-8 items-start'>
          {/* Left Panel - Control & Form Selector (no-print) */}
          <div className='lg:col-span-5 space-y-4 no-print'>
            <div className='bg-white rounded-xl shadow-sm border border-slate-200 p-5'>
              {/* Navigation Bar / Mode Tabs (Template, Accent, Form) matching screenshot */}
              <div className='flex items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5'>
                <div className='flex items-center gap-2'>
                  <button
                    type='button'
                    onClick={() => setActiveTab('template')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'template'
                        ? 'bg-blue-100 text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Layout className='size-3.5' />
                    Template
                  </button>

                  <button
                    type='button'
                    onClick={() => setActiveTab('accent')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'accent'
                        ? 'bg-purple-100 text-purple-600 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Palette className='size-3.5' />
                    Accent
                  </button>

                  <button
                    type='button'
                    onClick={() => setActiveTab('form')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'form'
                        ? 'bg-emerald-100 text-emerald-600 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className='size-3.5' />
                    Form
                  </button>
                </div>

                <div className='flex items-center gap-1'>
                  {activeTab === 'template' && (
                    <button
                      type='button'
                      onClick={() => setActiveTab('accent')}
                      className='inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100'
                    >
                      Next <ArrowRightIcon className='size-3' />
                    </button>
                  )}
                  {activeTab === 'accent' && (
                    <button
                      type='button'
                      onClick={() => setActiveTab('form')}
                      className='inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100'
                    >
                      Next <ArrowRightIcon className='size-3' />
                    </button>
                  )}
                  {activeTab === 'form' && activeSectionIndex < FORM_SECTIONS.length - 1 && (
                    <button
                      type='button'
                      onClick={() => setActiveSectionIndex(prev => prev + 1)}
                      className='inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100'
                    >
                      Next <ArrowRightIcon className='size-3' />
                    </button>
                  )}
                </div>
              </div>

              {/* MODE 1: TEMPLATE SELECTOR (Cards styled exactly like screenshot) */}
              {activeTab === 'template' && (
                <div className='space-y-3.5'>
                  {TEMPLATE_OPTIONS.map(tpl => {
                    const isSelected =
                      (resumeData.template || resumeData.templete || 'modern') === tpl.id
                    return (
                      <div
                        key={tpl.id}
                        onClick={() =>
                          setResumeData(prev => ({
                            ...prev,
                            template: tpl.id,
                            templete: tpl.id
                          }))
                        }
                        className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? 'bg-blue-50/80 border-2 border-blue-400 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <h4 className='text-sm font-bold text-slate-900'>
                            {tpl.name}
                          </h4>
                          {isSelected && (
                            <div className='w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-xs'>
                              <Check className='size-3 stroke-[3]' />
                            </div>
                          )}
                        </div>
                        <p className='text-xs text-slate-500 italic mt-2 leading-relaxed'>
                          {tpl.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* MODE 2: ACCENT COLOR PICKER */}
              {activeTab === 'accent' && (
                <div className='space-y-5'>
                  <div>
                    <h4 className='text-sm font-bold text-slate-900 mb-1'>
                      Accent Color Theme
                    </h4>
                    <p className='text-xs text-slate-500'>
                      Pick a theme color to highlight your name, section headers, and elements.
                    </p>
                  </div>

                  {/* Preset Swatches Grid */}
                  <div className='grid grid-cols-5 gap-3'>
                    {ACCENT_COLORS.map(color => {
                      const isSelected = resumeData.accent_color === color.hex
                      return (
                        <button
                          key={color.hex}
                          type='button'
                          onClick={() =>
                            setResumeData(prev => ({ ...prev, accent_color: color.hex }))
                          }
                          className={`group relative h-10 rounded-lg flex items-center justify-center transition-all ${
                            isSelected
                              ? 'ring-2 ring-offset-2 ring-slate-800 scale-105'
                              : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {isSelected && (
                            <Check className='size-4 text-white drop-shadow-sm' />
                          )}
                        </button>
                      )
                    })}
                  </div>

                  {/* Custom Hex Input */}
                  <div className='pt-2 border-t border-slate-100 flex items-center justify-between gap-3'>
                    <label className='text-xs font-semibold text-slate-700'>
                      Custom Accent Color
                    </label>
                    <div className='flex items-center gap-2'>
                      <input
                        type='color'
                        value={resumeData.accent_color || '#EC4899'}
                        onChange={e =>
                          setResumeData(prev => ({ ...prev, accent_color: e.target.value }))
                        }
                        className='w-8 h-8 rounded-md cursor-pointer border border-slate-300 p-0.5'
                      />
                      <input
                        type='text'
                        value={resumeData.accent_color || '#EC4899'}
                        onChange={e =>
                          setResumeData(prev => ({ ...prev, accent_color: e.target.value }))
                        }
                        className='w-24 text-xs px-2 py-1 border border-slate-300 rounded-md font-mono'
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 3: FORM CONTENT (Personal Info, Summary, Experience, etc.) */}
              {activeTab === 'form' && (
                <div>
                  {/* Form section progress pills */}
                  <div className='flex flex-wrap gap-1.5 border-b border-slate-100 pb-3 mb-4'>
                    {FORM_SECTIONS.map((sec, idx) => (
                      <button
                        key={sec.id}
                        type='button'
                        onClick={() => setActiveSectionIndex(idx)}
                        className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                          activeSectionIndex === idx
                            ? 'bg-slate-800 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {sec.name}
                      </button>
                    ))}
                  </div>

                  {/* Section Title & Prev/Next */}
                  <div className='flex items-center justify-between mb-4'>
                    <div>
                      <h3 className='text-base font-bold text-slate-900'>
                        {activeSection.name}
                      </h3>
                      <p className='text-xs text-slate-500'>
                        Edit details for {activeSection.name.toLowerCase()}
                      </p>
                    </div>

                    <div className='flex items-center gap-2'>
                      {activeSectionIndex > 0 && (
                        <button
                          type='button'
                          onClick={() => setActiveSectionIndex(prev => prev - 1)}
                          className='px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md'
                        >
                          <ArrowLeftIcon className='size-3 inline mr-1' /> Prev
                        </button>
                      )}
                      {activeSectionIndex < FORM_SECTIONS.length - 1 && (
                        <button
                          type='button'
                          onClick={() => setActiveSectionIndex(prev => prev + 1)}
                          className='px-2.5 py-1 text-xs font-medium text-white bg-slate-800 hover:bg-slate-900 rounded-md'
                        >
                          Next <ArrowRightIcon className='size-3 inline ml-1' />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Section 1: Personal Info */}
                  {activeSection.id === 'personal' && (
                    <PersonalInfoFrom
                      data={resumeData.personal_info || {}}
                      onChange={data =>
                        setResumeData(prev => ({
                          ...prev,
                          personal_info: data
                        }))
                      }
                      removeBackground={removeBackground}
                      setRemoveBackground={setRemoveBackground}
                    />
                  )}

                  {/* Section 2: Summary with AI Button */}
                  {activeSection.id === 'summary' && (
                    <div className='space-y-4'>
                      <div>
                        <div className='flex items-center justify-between mb-1.5'>
                          <label className='block text-xs font-semibold text-slate-700 uppercase tracking-wider'>
                            Professional Summary
                          </label>

                          {/* AI ENHANCE BUTTON */}
                          <button
                            type='button'
                            onClick={() => enhanceWithAI('summary')}
                            disabled={loadingAiField === 'summary'}
                            className='inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-95 text-white rounded-lg text-xs font-medium shadow-xs transition-all disabled:opacity-50'
                          >
                            {loadingAiField === 'summary' ? (
                              <>
                                <Loader2 className='size-3.5 animate-spin' />
                                Enhancing...
                              </>
                            ) : (
                              <>
                                <Sparkles className='size-3.5 fill-purple-200' />
                                Enhance with AI
                              </>
                            )}
                          </button>
                        </div>

                        <textarea
                          rows={6}
                          value={resumeData.professional_summary || ''}
                          onChange={e =>
                            setResumeData(prev => ({
                              ...prev,
                              professional_summary: e.target.value
                            }))
                          }
                          placeholder='Write a concise overview of your professional background, top achievements, and skills...'
                          className='w-full p-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500'
                        />
                      </div>
                    </div>
                  )}

                  {/* Section 3: Experience with AI Button */}
                  {activeSection.id === 'experience' && (
                    <div className='space-y-4'>
                      {(resumeData.experience || []).map((exp, idx) => (
                        <div
                          key={exp._id || idx}
                          className='p-3.5 border border-slate-200 rounded-lg space-y-3 bg-slate-50/50'
                        >
                          <div className='flex items-center justify-between'>
                            <span className='text-xs font-bold text-slate-700'>
                              Experience #{idx + 1}
                            </span>
                            <button
                              type='button'
                              onClick={() => removeExperience(idx)}
                              className='text-red-500 hover:text-red-700 text-xs flex items-center gap-1'
                            >
                              <Trash2 className='size-3.5' /> Remove
                            </button>
                          </div>

                          <div className='grid grid-cols-2 gap-2'>
                            <input
                              type='text'
                              placeholder='Job Title / Position'
                              value={exp.position || ''}
                              onChange={e => updateExperience(idx, 'position', e.target.value)}
                              className='p-2 text-xs border rounded-md'
                            />
                            <input
                              type='text'
                              placeholder='Company Name'
                              value={exp.company || ''}
                              onChange={e => updateExperience(idx, 'company', e.target.value)}
                              className='p-2 text-xs border rounded-md'
                            />
                          </div>

                          <div className='grid grid-cols-2 gap-2'>
                            <input
                              type='text'
                              placeholder='Start Date (e.g. 2023-01)'
                              value={exp.start_date || ''}
                              onChange={e => updateExperience(idx, 'start_date', e.target.value)}
                              className='p-2 text-xs border rounded-md'
                            />
                            <input
                              type='text'
                              placeholder='End Date (or Present)'
                              value={exp.end_date || ''}
                              onChange={e => updateExperience(idx, 'end_date', e.target.value)}
                              className='p-2 text-xs border rounded-md'
                            />
                          </div>

                          <div>
                            <div className='flex items-center justify-between mb-1.5'>
                              <label className='text-[11px] font-semibold text-slate-600'>
                                Description & Key Accomplishments
                              </label>

                              {/* AI ENHANCE BUTTON */}
                              <button
                                type='button'
                                onClick={() => enhanceWithAI('experience', idx)}
                                disabled={loadingAiField === `experience-${idx}`}
                                className='inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-md text-[11px] font-medium shadow-xs transition-all disabled:opacity-50'
                              >
                                {loadingAiField === `experience-${idx}` ? (
                                  <>
                                    <Loader2 className='size-3 animate-spin' />
                                    Enhancing...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className='size-3' />
                                    Enhance with AI
                                  </>
                                )}
                              </button>
                            </div>

                            <textarea
                              rows={3}
                              placeholder='Responsibilities & Achievements...'
                              value={exp.description || ''}
                              onChange={e => updateExperience(idx, 'description', e.target.value)}
                              className='w-full p-2 text-xs border rounded-md'
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        type='button'
                        onClick={addExperience}
                        className='w-full py-2 border-2 border-dashed border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center gap-1.5'
                      >
                        <Plus className='size-4' /> Add Experience
                      </button>
                    </div>
                  )}

                  {/* Section 4: Education */}
                  {activeSection.id === 'education' && (
                    <div className='space-y-4'>
                      {(resumeData.education || []).map((edu, idx) => (
                        <div
                          key={edu._id || idx}
                          className='p-3.5 border border-slate-200 rounded-lg space-y-3 bg-slate-50/50'
                        >
                          <div className='flex items-center justify-between'>
                            <span className='text-xs font-bold text-slate-700'>
                              Education #{idx + 1}
                            </span>
                            <button
                              type='button'
                              onClick={() => removeEducation(idx)}
                              className='text-red-500 hover:text-red-700 text-xs flex items-center gap-1'
                            >
                              <Trash2 className='size-3.5' /> Remove
                            </button>
                          </div>

                          <input
                            type='text'
                            placeholder='Institution / University'
                            value={edu.institution || ''}
                            onChange={e => updateEducation(idx, 'institution', e.target.value)}
                            className='w-full p-2 text-xs border rounded-md'
                          />

                          <div className='grid grid-cols-2 gap-2'>
                            <input
                              type='text'
                              placeholder='Degree (e.g. B.Tech)'
                              value={edu.degree || ''}
                              onChange={e => updateEducation(idx, 'degree', e.target.value)}
                              className='p-2 text-xs border rounded-md'
                            />
                            <input
                              type='text'
                              placeholder='Field of Study (e.g. CSE)'
                              value={edu.field || ''}
                              onChange={e => updateEducation(idx, 'field', e.target.value)}
                              className='p-2 text-xs border rounded-md'
                            />
                          </div>

                          <div className='grid grid-cols-2 gap-2'>
                            <input
                              type='text'
                              placeholder='Graduation Date'
                              value={edu.graduation_date || ''}
                              onChange={e => updateEducation(idx, 'graduation_date', e.target.value)}
                              className='p-2 text-xs border rounded-md'
                            />
                            <input
                              type='text'
                              placeholder='GPA (optional)'
                              value={edu.gpa || ''}
                              onChange={e => updateEducation(idx, 'gpa', e.target.value)}
                              className='p-2 text-xs border rounded-md'
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        type='button'
                        onClick={addEducation}
                        className='w-full py-2 border-2 border-dashed border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center gap-1.5'
                      >
                        <Plus className='size-4' /> Add Education
                      </button>
                    </div>
                  )}

                  {/* Section 5: Projects with AI Button */}
                  {activeSection.id === 'project' && (
                    <div className='space-y-4'>
                      {(resumeData.project || []).map((proj, idx) => (
                        <div
                          key={proj._id || idx}
                          className='p-3.5 border border-slate-200 rounded-lg space-y-3 bg-slate-50/50'
                        >
                          <div className='flex items-center justify-between'>
                            <span className='text-xs font-bold text-slate-700'>
                              Project #{idx + 1}
                            </span>
                            <button
                              type='button'
                              onClick={() => removeProject(idx)}
                              className='text-red-500 hover:text-red-700 text-xs flex items-center gap-1'
                            >
                              <Trash2 className='size-3.5' /> Remove
                            </button>
                          </div>

                          <div className='grid grid-cols-2 gap-2'>
                            <input
                              type='text'
                              placeholder='Project Name'
                              value={proj.name || ''}
                              onChange={e => updateProject(idx, 'name', e.target.value)}
                              className='p-2 text-xs border rounded-md'
                            />
                            <input
                              type='text'
                              placeholder='Type / Category'
                              value={proj.type || ''}
                              onChange={e => updateProject(idx, 'type', e.target.value)}
                              className='p-2 text-xs border rounded-md'
                            />
                          </div>

                          <div>
                            <div className='flex items-center justify-between mb-1.5'>
                              <label className='text-[11px] font-semibold text-slate-600'>
                                Project Details & Features
                              </label>

                              {/* AI ENHANCE BUTTON */}
                              <button
                                type='button'
                                onClick={() => enhanceWithAI('project', idx)}
                                disabled={loadingAiField === `project-${idx}`}
                                className='inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-md text-[11px] font-medium shadow-xs transition-all disabled:opacity-50'
                              >
                                {loadingAiField === `project-${idx}` ? (
                                  <>
                                    <Loader2 className='size-3 animate-spin' />
                                    Enhancing...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className='size-3' />
                                    Enhance with AI
                                  </>
                                )}
                              </button>
                            </div>

                            <textarea
                              rows={3}
                              placeholder='Project description and key features...'
                              value={proj.description || ''}
                              onChange={e => updateProject(idx, 'description', e.target.value)}
                              className='w-full p-2 text-xs border rounded-md'
                            />
                          </div>
                        </div>
                      ))}

                      <button
                        type='button'
                        onClick={addProject}
                        className='w-full py-2 border-2 border-dashed border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:border-slate-400 hover:bg-slate-50 flex items-center justify-center gap-1.5'
                      >
                        <Plus className='size-4' /> Add Project
                      </button>
                    </div>
                  )}

                  {/* Section 6: Skills */}
                  {activeSection.id === 'skills' && (
                    <div className='space-y-4'>
                      <div className='flex gap-2'>
                        <input
                          type='text'
                          placeholder='Add a skill (e.g. React, Node.js)'
                          value={skillInput}
                          onChange={e => setSkillInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                          className='flex-1 p-2 text-xs border border-slate-300 rounded-md'
                        />
                        <button
                          type='button'
                          onClick={handleAddSkill}
                          className='px-4 py-2 bg-slate-800 text-white rounded-md text-xs font-semibold hover:bg-slate-900'
                        >
                          Add
                        </button>
                      </div>

                      <div className='flex flex-wrap gap-2 pt-2'>
                        {(resumeData.skills || []).map((skill, idx) => (
                          <span
                            key={idx}
                            className='inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium border border-slate-200'
                          >
                            {skill}
                            <button
                              type='button'
                              onClick={() => removeSkill(idx)}
                              className='text-slate-400 hover:text-red-500 ml-1'
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Live Resume Preview Canvas */}
          <div className='lg:col-span-7 sticky top-20'>
            <div
              id='resume-preview-content'
              ref={previewRef}
              className='transition-all duration-300'
            >
              {renderResumeContent()}
            </div>
          </div>
        </div>
      </main>

      {/* GEMINI API KEY MODAL */}
      {showApiKeyModal && (
        <div className='fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in'>
          <div className='bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4'>
            <div className='flex items-center justify-between border-b border-slate-100 pb-3'>
              <div className='flex items-center gap-2 text-purple-600 font-bold text-base'>
                <Sparkles className='size-5' />
                Google Gemini API Key
              </div>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className='text-slate-400 hover:text-slate-700'
              >
                <X className='size-5' />
              </button>
            </div>

            <p className='text-xs text-slate-600 leading-relaxed'>
              To use AI text enhancement, enter your Google Gemini API Key below. Your key is stored locally in your browser session.
            </p>

            <div className='space-y-1.5'>
              <label className='block text-xs font-semibold text-slate-700'>
                Gemini API Key
              </label>
              <input
                type='password'
                placeholder='AIzaSy...'
                value={tempApiKey}
                onChange={e => setTempApiKey(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveApiKey()}
                className='w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono'
              />
              <p className='text-[10px] text-slate-400'>
                Don't have a key? Get a free API key at{' '}
                <a
                  href='https://aistudio.google.com/app/apikey'
                  target='_blank'
                  rel='noreferrer'
                  className='text-purple-600 underline font-medium'
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            <div className='flex items-center justify-end gap-2 pt-2'>
              <button
                type='button'
                onClick={() => setShowApiKeyModal(false)}
                className='px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleSaveApiKey}
                className='px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm'
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Resumebuilder

