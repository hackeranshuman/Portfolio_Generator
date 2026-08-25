import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import {
  ArrowLeft,
  Edit3,
  Printer,
  Share2,
  Check,
  Globe,
  Layout,
  Palette,
  ExternalLink,
  Mail,
  Phone,
  MapPin
} from 'lucide-react'

const TEMPLATE_OPTIONS = [
  { id: 'modern', name: 'Modern' },
  { id: 'classic', name: 'Classic' },
  { id: 'minimal-image', name: 'Minimal Image' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'executive', name: 'Executive' }
]

const ACCENT_COLORS = [
  { name: 'Magenta Pink', hex: '#EC4899' },
  { name: 'Royal Blue', hex: '#3B82F6' },
  { name: 'Emerald Green', hex: '#10B981' },
  { name: 'Indigo Purple', hex: '#6366F1' },
  { name: 'Deep Violet', hex: '#8B5CF6' },
  { name: 'Vibrant Orange', hex: '#F97316' },
  { name: 'Teal', hex: '#14B8A6' },
  { name: 'Dark Slate', hex: '#1E293B' }
]

const Preview = () => {
  const { resumeID } = useParams()
  const [resumeData, setResumeData] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [selectedAccent, setSelectedAccent] = useState('#EC4899')
  const [copied, setCopied] = useState(false)
  const previewRef = useRef(null)

  useEffect(() => {
    const localResumes = localStorage.getItem('resumes')
    const resumesList = localResumes ? JSON.parse(localResumes) : dummyResumeData
    const found = resumesList.find(r => r._id === resumeID) || resumesList[0] || dummyResumeData[0]
    if (found) {
      setResumeData(found)
      setSelectedTemplate(found.template || found.templete || 'modern')
      setSelectedAccent(found.accent_color || '#EC4899')
      document.title = `${found.personal_info?.full_name || 'Portfolio'} - Live View`
    }
  }, [resumeID])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  if (!resumeData) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50 text-slate-600'>
        <p>Loading portfolio preview...</p>
      </div>
    )
  }

  const info = resumeData.personal_info || {}
  const accent = selectedAccent
  const currentTemplate = selectedTemplate

  const profileImgSrc = info.image
    ? typeof info.image === 'string'
      ? info.image
      : URL.createObjectURL(info.image)
    : null

  const renderPortfolioContent = () => {
    // 1. MODERN TEMPLATE
    if (currentTemplate === 'modern') {
      return (
        <div className='bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden text-slate-800 transition-all'>
          {/* Header Banner */}
          <div
            style={{ backgroundColor: accent }}
            className='p-8 sm:p-10 text-white transition-colors duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6'
          >
            <div>
              <h1 className='text-3xl sm:text-4xl font-black tracking-tight'>
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
                className='w-24 h-24 rounded-2xl object-cover border-4 border-white/90 shadow-lg'
              />
            )}
          </div>

          <div className='p-6 sm:p-10 space-y-8'>
            {/* Contact info bar */}
            <div className='flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-slate-600 border-b border-slate-100 pb-5'>
              {info.email && (
                <span className='flex items-center gap-1.5 font-medium'>
                  <Mail className='size-3.5 text-slate-400' /> {info.email}
                </span>
              )}
              {info.phone && (
                <span className='flex items-center gap-1.5 font-medium'>
                  <Phone className='size-3.5 text-slate-400' /> {info.phone}
                </span>
              )}
              {info.location && (
                <span className='flex items-center gap-1.5 font-medium'>
                  <MapPin className='size-3.5 text-slate-400' /> {info.location}
                </span>
              )}
              {info.linkedin && (
                <a
                  href={info.linkedin.startsWith('http') ? info.linkedin : `https://${info.linkedin}`}
                  target='_blank'
                  rel='noreferrer'
                  className='hover:underline font-semibold flex items-center gap-1'
                  style={{ color: accent }}
                >
                  <Globe className='size-3.5' /> LinkedIn <ExternalLink className='size-2.5' />
                </a>
              )}
              {info.website && (
                <a
                  href={info.website.startsWith('http') ? info.website : `https://${info.website}`}
                  target='_blank'
                  rel='noreferrer'
                  className='hover:underline font-semibold flex items-center gap-1'
                  style={{ color: accent }}
                >
                  <Globe className='size-3.5' /> Website <ExternalLink className='size-2.5' />
                </a>
              )}
            </div>

            {/* Summary */}
            {resumeData.professional_summary && (
              <div>
                <h2
                  className='text-xs font-bold uppercase tracking-widest mb-3 border-b pb-1.5'
                  style={{ color: accent, borderColor: `${accent}30` }}
                >
                  About Me
                </h2>
                <p className='text-sm leading-relaxed text-slate-700 whitespace-pre-line'>
                  {resumeData.professional_summary}
                </p>
              </div>
            )}

            {/* Experience */}
            {resumeData.experience?.length > 0 && (
              <div>
                <h2
                  className='text-xs font-bold uppercase tracking-widest mb-4 border-b pb-1.5'
                  style={{ color: accent, borderColor: `${accent}30` }}
                >
                  Work Experience
                </h2>
                <div className='space-y-6'>
                  {resumeData.experience.map((exp, idx) => (
                    <div key={exp._id || idx} className='relative pl-4 border-l-2' style={{ borderColor: `${accent}40` }}>
                      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-baseline font-semibold text-slate-800'>
                        <span className='text-base font-bold' style={{ color: accent }}>
                          {exp.position}
                        </span>
                        <span className='text-xs text-slate-500 font-normal mt-0.5 sm:mt-0'>
                          {exp.start_date} - {exp.end_date || 'Present'}
                        </span>
                      </div>
                      <p className='text-xs font-medium text-slate-600 mt-0.5'>
                        {exp.company}
                      </p>
                      {exp.description && (
                        <p className='text-xs text-slate-600 mt-2 whitespace-pre-line leading-relaxed'>
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resumeData.project?.length > 0 && (
              <div>
                <h2
                  className='text-xs font-bold uppercase tracking-widest mb-4 border-b pb-1.5'
                  style={{ color: accent, borderColor: `${accent}30` }}
                >
                  Key Projects
                </h2>
                <div className='grid sm:grid-cols-2 gap-4'>
                  {resumeData.project.map((proj, idx) => (
                    <div key={proj._id || idx} className='p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all'>
                      <div className='font-bold text-sm text-slate-800 flex items-center justify-between'>
                        <span>{proj.name}</span>
                        {proj.type && (
                          <span className='text-[10px] px-2 py-0.5 rounded-full bg-white border text-slate-600 font-normal'>
                            {proj.type}
                          </span>
                        )}
                      </div>
                      <p className='text-xs text-slate-600 mt-2 leading-relaxed'>{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education?.length > 0 && (
              <div>
                <h2
                  className='text-xs font-bold uppercase tracking-widest mb-4 border-b pb-1.5'
                  style={{ color: accent, borderColor: `${accent}30` }}
                >
                  Education
                </h2>
                <div className='space-y-3'>
                  {resumeData.education.map((edu, idx) => (
                    <div key={edu._id || idx} className='text-xs flex justify-between items-start'>
                      <div>
                        <p className='font-bold text-sm text-slate-800'>
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </p>
                        <p className='text-slate-600 mt-0.5'>{edu.institution}</p>
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

            {/* Skills */}
            {resumeData.skills?.length > 0 && (
              <div>
                <h2
                  className='text-xs font-bold uppercase tracking-widest mb-4 border-b pb-1.5'
                  style={{ color: accent, borderColor: `${accent}30` }}
                >
                  Skills & Technologies
                </h2>
                <div className='flex flex-wrap gap-2'>
                  {resumeData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className='px-3 py-1.5 text-xs font-semibold rounded-lg transition-all'
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

    // 2. CLASSIC TEMPLATE
    if (currentTemplate === 'classic') {
      return (
        <div className='bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 text-slate-800 space-y-8'>
          <div className='text-center pb-6 border-b-2 flex flex-col items-center' style={{ borderColor: accent }}>
            {profileImgSrc && (
              <img
                src={profileImgSrc}
                alt='Profile'
                style={{ borderColor: accent }}
                className='w-24 h-24 rounded-full object-cover border-4 shadow-sm mb-4'
              />
            )}
            <h1 className='text-3xl sm:text-4xl font-bold tracking-tight text-slate-900'>
              {info.full_name || 'Your Full Name'}
            </h1>
            <p className='text-lg font-medium mt-1' style={{ color: accent }}>
              {info.profession || 'Your Profession'}
            </p>
            <div className='flex flex-wrap justify-center gap-4 text-xs text-slate-600 mt-4'>
              {info.email && <span>📧 {info.email}</span>}
              {info.phone && <span>📞 {info.phone}</span>}
              {info.location && <span>📍 {info.location}</span>}
              {info.linkedin && (
                <a href={info.linkedin.startsWith('http') ? info.linkedin : `https://${info.linkedin}`} target='_blank' rel='noreferrer' className='underline font-semibold' style={{ color: accent }}>
                  LinkedIn
                </a>
              )}
            </div>
          </div>

          {resumeData.professional_summary && (
            <div>
              <h2 className='text-sm font-bold uppercase tracking-wider border-b pb-1.5 mb-3' style={{ color: accent, borderColor: accent }}>
                Professional Summary
              </h2>
              <p className='text-sm leading-relaxed text-slate-700 whitespace-pre-line'>
                {resumeData.professional_summary}
              </p>
            </div>
          )}

          {resumeData.experience?.length > 0 && (
            <div>
              <h2 className='text-sm font-bold uppercase tracking-wider border-b pb-1.5 mb-4' style={{ color: accent, borderColor: accent }}>
                Work Experience
              </h2>
              <div className='space-y-5'>
                {resumeData.experience.map((exp, idx) => (
                  <div key={exp._id || idx} className='text-xs space-y-1'>
                    <div className='flex justify-between font-bold text-sm text-slate-900'>
                      <span>{exp.position} — {exp.company}</span>
                      <span className='text-slate-500 font-normal text-xs'>{exp.start_date} - {exp.end_date || 'Present'}</span>
                    </div>
                    <p className='text-slate-600 mt-1 leading-relaxed whitespace-pre-line'>
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.project?.length > 0 && (
            <div>
              <h2 className='text-sm font-bold uppercase tracking-wider border-b pb-1.5 mb-4' style={{ color: accent, borderColor: accent }}>
                Key Projects
              </h2>
              <div className='grid sm:grid-cols-2 gap-4'>
                {resumeData.project.map((proj, idx) => (
                  <div key={proj._id || idx} className='p-3.5 rounded-lg border border-slate-200 bg-slate-50'>
                    <span className='font-bold text-xs text-slate-900'>{proj.name}</span>
                    <p className='text-xs text-slate-600 mt-1 leading-relaxed'>{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resumeData.education?.length > 0 && (
            <div>
              <h2 className='text-sm font-bold uppercase tracking-wider border-b pb-1.5 mb-3' style={{ color: accent, borderColor: accent }}>
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

          {resumeData.skills?.length > 0 && (
            <div>
              <h2 className='text-sm font-bold uppercase tracking-wider border-b pb-1.5 mb-3' style={{ color: accent, borderColor: accent }}>
                Skills & Technologies
              </h2>
              <p className='text-xs text-slate-700 leading-relaxed font-medium'>
                {resumeData.skills.join(' • ')}
              </p>
            </div>
          )}
        </div>
      )
    }

    // 3. MINIMAL / EXECUTIVE / OTHER TEMPLATES
    return (
      <div className='bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 text-slate-800 space-y-8'>
        <div className='flex flex-col sm:flex-row items-center gap-6 border-b border-slate-200 pb-8'>
          {profileImgSrc && (
            <img
              src={profileImgSrc}
              alt='Profile'
              style={{ borderColor: accent }}
              className='w-24 h-24 rounded-full object-cover border-4 shadow-sm'
            />
          )}
          <div className='text-center sm:text-left'>
            <h1 className='text-3xl font-black uppercase tracking-wide' style={{ color: accent }}>
              {info.full_name || 'Your Full Name'}
            </h1>
            <p className='text-lg font-semibold text-slate-600 mt-1'>
              {info.profession || 'Your Profession'}
            </p>
            <div className='flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-1.5 text-xs text-slate-500 mt-3'>
              {info.email && <span>📧 {info.email}</span>}
              {info.phone && <span>📞 {info.phone}</span>}
              {info.location && <span>📍 {info.location}</span>}
            </div>
          </div>
        </div>

        {resumeData.professional_summary && (
          <div>
            <h2 className='text-xs font-bold uppercase tracking-widest text-slate-400 mb-3'>
              About Me
            </h2>
            <p className='text-sm leading-relaxed text-slate-700 whitespace-pre-line'>
              {resumeData.professional_summary}
            </p>
          </div>
        )}

        {resumeData.experience?.length > 0 && (
          <div>
            <h2 className='text-xs font-bold uppercase tracking-widest text-slate-400 mb-4'>
              Work Experience
            </h2>
            <div className='space-y-5'>
              {resumeData.experience.map((exp, idx) => (
                <div key={exp._id || idx} className='text-xs space-y-1'>
                  <div className='flex justify-between font-bold text-slate-800 text-sm'>
                    <span style={{ color: accent }}>{exp.position} @ {exp.company}</span>
                    <span className='text-slate-400 font-normal text-xs'>{exp.start_date} - {exp.end_date || 'Present'}</span>
                  </div>
                  <p className='text-slate-600 leading-relaxed whitespace-pre-line mt-1'>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {resumeData.skills?.length > 0 && (
          <div>
            <h2 className='text-xs font-bold uppercase tracking-widest text-slate-400 mb-3'>
              Skills & Expertise
            </h2>
            <div className='flex flex-wrap gap-2'>
              {resumeData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className='px-3 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium'
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
    <div className='min-h-screen bg-slate-100/70 text-slate-900 pb-20'>
      {/* Top Interactive Navbar */}
      <nav className='bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3.5 no-print shadow-xs'>
        <div className='max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4'>
          {/* Left actions */}
          <div className='flex items-center gap-3'>
            <Link
              to='/app'
              className='inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors'
            >
              <ArrowLeft className='size-4' />
              Dashboard
            </Link>

            <Link
              to={`/app/builder/${resumeData._id || resumeID}`}
              className='inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors border border-purple-200'
            >
              <Edit3 className='size-3.5' />
              Edit in Builder
            </Link>
          </div>

          {/* Center: Template & Accent Selectors */}
          <div className='flex items-center gap-3'>
            {/* Template picker */}
            <div className='flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs'>
              {TEMPLATE_OPTIONS.map(tpl => (
                <button
                  key={tpl.id}
                  type='button'
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedTemplate === tpl.id
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tpl.name}
                </button>
              ))}
            </div>

            {/* Accent color picker */}
            <div className='flex items-center gap-1.5'>
              {ACCENT_COLORS.map(color => (
                <button
                  key={color.hex}
                  type='button'
                  onClick={() => setSelectedAccent(color.hex)}
                  className={`size-6 rounded-full transition-transform cursor-pointer ${
                    selectedAccent === color.hex ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Right actions */}
          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={handleCopyLink}
              className='inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all cursor-pointer shadow-xs'
            >
              {copied ? (
                <>
                  <Check className='size-3.5 text-emerald-600' />
                  <span className='text-emerald-600'>Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className='size-3.5' />
                  Share Link
                </>
              )}
            </button>

            <button
              type='button'
              onClick={handlePrint}
              className='inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all cursor-pointer shadow-sm active:scale-95'
            >
              <Printer className='size-3.5' />
              Print / PDF
            </button>
          </div>
        </div>
      </nav>

      {/* Main Portfolio Container */}
      <main className='max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12' ref={previewRef}>
        {renderPortfolioContent()}
      </main>
    </div>
  )
}

export default Preview