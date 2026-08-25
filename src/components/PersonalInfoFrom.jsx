import { User } from 'lucide-react'
import React from 'react'

const PersonalInfoFrom = ({
  data,
  onChange,
  removeBackground,
  setRemoveBackground
}) => {

  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value
    })
  }

  return (
    <div>

      <div className='flex items-center gap-2'>

        <label>
          {data.image ? (
            <img
              src={
                typeof data.image === 'string'
                  ? data.image
                  : URL.createObjectURL(data.image)
              }
              alt='user-image'
              className='w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-80'
            />
          ) : (
            <div className='inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer'>
              <User className='size-10 p-2.5 border rounded-full' />
              Upload User Image
            </div>
          )}

          <input
            type='file'
            accept='image/jpeg, image/png'
            className='hidden'
            onChange={(e) => {
              const file = e.target.files[0]
              if (file) {
                const reader = new FileReader()
                reader.onloadend = () => {
                  handleChange('image', reader.result)
                }
                reader.readAsDataURL(file)
              }
            }}
          />
        </label>

        {Boolean(data.image) && (
          <div className='flex flex-col gap-1 pl-4 text-sm'>

            <p className='text-xs font-semibold text-slate-700'>Remove Background</p>

            <label className='relative inline-flex items-center cursor-pointer'>

              <input
                type='checkbox'
                className='sr-only peer'
                checked={removeBackground}
                onChange={(e) => setRemoveBackground(e.target.checked)}
              />

              {/* Toggle background */}
              <div
                className='w-9 h-5 bg-slate-300 rounded-full
                peer-checked:bg-green-600
                transition-colors duration-200'
              ></div>

              {/* Toggle circle */}
              <span
                className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full
                transition-transform duration-200 ease-in-out
                peer-checked:translate-x-4'
              ></span>

            </label>
          </div>
        )}

      </div>

      <div className='mt-6 space-y-4'>
        <div>
          <label className='block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1'>
            Full Name
          </label>
          <input
            type='text'
            value={data.full_name || ''}
            onChange={(e) => handleChange('full_name', e.target.value)}
            placeholder='e.g. Anshuman Singh'
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        <div>
          <label className='block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1'>
            Profession / Job Title
          </label>
          <input
            type='text'
            value={data.profession || ''}
            onChange={(e) => handleChange('profession', e.target.value)}
            placeholder='e.g. Software Engineer'
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1'>
              Email Address
            </label>
            <input
              type='email'
              value={data.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder='e.g. ansh@gmai.com'
              className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1'>
              Phone Number
            </label>
            <input
              type='tel'
              value={data.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder='e.g. +1 234 567 8900'
              className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
        </div>

        <div>
          <label className='block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1'>
            Location
          </label>
          <input
            type='text'
            value={data.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder='e.g. New York, NY'
            className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1'>
              LinkedIn URL
            </label>
            <input
              type='url'
              value={data.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder='https://linkedin.com/in/username'
              className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>

          <div>
            <label className='block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1'>
              Website / Portfolio URL
            </label>
            <input
              type='url'
              value={data.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder='https://example.com'
              className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalInfoFrom