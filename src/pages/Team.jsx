import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MessageSquare, Send, CheckCircle, Star, Heart, Award, Shield, Cpu, Code, Palette, Settings } from 'lucide-react'

const teamMembers = [
  {
    name: 'Anshuman',
    role: 'Team Leader & Systems Architect',
    icon: Shield,
    color: 'from-emerald-400 to-teal-500',
    description: 'Spearheaded project planning, defined backend integrations, established routing architecture, and supervised cross-functional features.',
    contributions: [
      'Project planning and architecture design',
      'Unified state routing and layout structuring',
      'Database schema coordination and flow validation',
      'DevOps and team coordination'
    ],
    skills: ['System Design', 'React Router', 'Express & DB', 'Scrum Leader']
  },
  {
    name: 'Aanchal',
    role: 'Lead UI/UX Designer & Frontend Dev',
    icon: Palette,
    color: 'from-pink-400 to-rose-500',
    description: 'Designed the visual branding, created premium layouts, and built responsive high-fidelity home sections (Hero, Features, Testimonials).',
    contributions: [
      'Visual Identity & Premium Dark Theme',
      'Interactive Glassmorphism homepage sections',
      'CSS animations and transitions tuning',
      'Responsive design and mobile optimization'
    ],
    skills: ['Figma', 'Glassmorphism Design', 'Tailwind CSS', 'CSS Animations']
  },
  {
    name: 'Anmol',
    role: 'Core Engine & PDF Generation Dev',
    icon: Cpu,
    color: 'from-violet-400 to-indigo-500',
    description: 'Engineered the resume templates, handled the dynamic client-side PDF rendering, and integrated background-removal tools.',
    contributions: [
      'Structured resume templates and layouts',
      'Client-side print/PDF generation engine',
      'Image background removal module integration',
      'Asset optimizations'
    ],
    skills: ['PDF rendering', 'Dynamic styling', 'Asset Pipeline', 'JavaScript']
  },
  {
    name: 'Anurag',
    role: 'State Architect & Fullstack Dev',
    icon: Code,
    color: 'from-amber-400 to-orange-500',
    description: 'Crafted the complex multi-step customization forms, synced interactive builder states, and implemented auth flows.',
    contributions: [
      'Dynamic builder state structure (PersonalInfoForm)',
      'Real-time template syncing and edits',
      'Authentication pages and user flow',
      'Form validation and schema handling'
    ],
    skills: ['React State', 'Formik / Schema validation', 'Authentication', 'Fullstack']
  },
  {
    name: 'Anuj',
    role: 'Dashboard & Navigation Dev',
    icon: Settings,
    color: 'from-sky-400 to-blue-500',
    description: 'Developed the user dashboard interface, resume history lists, status indicators, and global navigation controls.',
    contributions: [
      'User Dashboard & resume dashboard view',
      'Resume history listing and quick actions',
      'Status trackers and search controls',
      'Navigation flows and responsive menus'
    ],
    skills: ['Dashboard UI', 'React Hooks', 'Layout Grid', 'Interactive menus']
  }
]

const Team = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: '5',
    message: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    if (!formData.message.trim()) errors.message = 'Message/Feedback is required'
    return errors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    // Save feedback mock
    const existingFeedback = JSON.parse(localStorage.getItem('team_feedback') || '[]')
    existingFeedback.push({
      ...formData,
      id: Date.now(),
      date: new Date().toISOString()
    })
    localStorage.setItem('team_feedback', JSON.stringify(existingFeedback))

    setSubmitted(true)
    setFormData({ name: '', email: '', rating: '5', message: '' })
    setTimeout(() => {
      setSubmitted(false)
    }, 5000)
  }

  const filteredMembers = activeTab === 'all' 
    ? teamMembers 
    : teamMembers.filter(m => m.name.toLowerCase() === activeTab)

  return (
    <div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-black">
      {/* Background radial gradients for premium feel */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-neutral-900 bg-black/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs tracking-widest text-neutral-400 uppercase font-mono">Inkfolio Dev Team</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16 md:py-24 relative z-10 space-y-24">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
            Meet the Builders
          </h1>
          <p className="text-lg text-neutral-400">
            Inkfolio is crafted with precision by a dedicated team of five creators.
            Discover the faces behind the system, who built which components, and leave your feedback below.
          </p>

          {/* Member Tabs Filter */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'all' 
                  ? 'bg-neutral-800 text-white border border-neutral-700' 
                  : 'bg-transparent text-neutral-400 hover:text-white border border-transparent'
              }`}
            >
              All Roles
            </button>
            {teamMembers.map(m => (
              <button
                key={m.name}
                onClick={() => setActiveTab(m.name.toLowerCase())}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === m.name.toLowerCase() 
                    ? 'bg-neutral-800 text-white border border-neutral-700' 
                    : 'bg-transparent text-neutral-400 hover:text-white border border-transparent'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </section>

        {/* Team Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMembers.map((member) => {
            const Icon = member.icon
            return (
              <div 
                key={member.name}
                className="group relative bg-[#131314]/40 border border-neutral-900 rounded-2xl p-8 hover:border-neutral-800 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/5 flex flex-col justify-between overflow-hidden"
              >
                {/* Decorative hover gradient card border */}
                <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${member.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
                
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${member.color} bg-opacity-10 text-white`}>
                      <Icon size={24} />
                    </div>
                    {member.name === 'Anshuman' && (
                      <span className="text-[10px] tracking-wider font-mono font-bold bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full uppercase">
                        Lead
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-neutral-400 transition-all duration-300">
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium text-neutral-400 mb-4">{member.role}</p>
                  
                  <p className="text-sm text-neutral-300 mb-6 leading-relaxed">
                    {member.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Key Contributions</h4>
                    <ul className="space-y-2">
                      {member.contributions.map((item, idx) => (
                        <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-900/60 mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="text-[10px] font-mono bg-neutral-900 text-neutral-400 px-2 py-1 rounded border border-neutral-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        {/* Feedback Section */}
        <section className="max-w-3xl mx-auto">
          <div className="relative bg-[#131314]/30 border border-neutral-900 rounded-3xl p-8 md:p-12 overflow-hidden backdrop-blur-md">
            {/* Spotlight blur effect inside the feedback card */}
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs">
                  <MessageSquare size={14} className="text-green-500" />
                  <span>Interactive Feedback System</span>
                </div>
                <h2 className="text-3xl font-extrabold">Send Us Your Feedback</h2>
                <p className="text-sm text-neutral-400">
                  Your remarks help us make Inkfolio better. Fill out this form to share your experiences, bugs, or feature recommendations.
                </p>
              </div>

              {submitted ? (
                <div className="bg-neutral-900/60 border border-green-500/20 rounded-2xl p-8 text-center space-y-4 animate-fadeIn">
                  <div className="inline-flex items-center justify-center p-3 rounded-full bg-green-950 text-green-400">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold">Feedback Received!</h3>
                  <p className="text-sm text-neutral-300 max-w-md mx-auto">
                    Thank you so much! Your feedback has been stored successfully. The team will review your comments.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400" htmlFor="name">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your name"
                        className={`w-full bg-neutral-900/50 border ${
                          formErrors.name ? 'border-red-500' : 'border-neutral-800'
                        } rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-neutral-600`}
                      />
                      {formErrors.name && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400" htmlFor="email">
                        Your Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className={`w-full bg-neutral-900/50 border ${
                          formErrors.email ? 'border-red-500' : 'border-neutral-800'
                        } rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-neutral-600`}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Rate Inkfolio
                    </label>
                    <div className="flex gap-4 items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, rating: String(star) }))}
                          className="text-neutral-500 hover:text-amber-400 transition-colors"
                        >
                          <Star
                            size={28}
                            className={
                              star <= Number(formData.rating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-neutral-600'
                            }
                          />
                        </button>
                      ))}
                      <span className="text-sm font-mono text-neutral-400 ml-2">
                        {formData.rating} out of 5
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400" htmlFor="message">
                      Feedback or Suggestions
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows="4"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="What do you think of Inkfolio? Suggest improvements, features or report bugs."
                      className={`w-full bg-neutral-900/50 border ${
                        formErrors.message ? 'border-red-500' : 'border-neutral-800'
                      } rounded-xl p-4 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder:text-neutral-600 resize-y`}
                    />
                    {formErrors.message && (
                      <p className="text-xs text-red-500 mt-1">{formErrors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-green-500/10"
                  >
                    <Send size={16} />
                    <span>Submit Feedback</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer message */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
          <p>© 2026 Inkfolio Dev Crew. Made with passion.</p>
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1"><Heart size={14} className="text-red-500 fill-red-500" /> React</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Award size={14} className="text-yellow-500" /> Team Project</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Team
