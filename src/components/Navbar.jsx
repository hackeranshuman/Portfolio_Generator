import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const [user, setUser] = React.useState(null)
    const navigate = useNavigate()

    React.useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        } else {
            setUser({ name: 'Guest' })
        }
    }, [])

    const logoutUser = () => {
        localStorage.removeItem('user')
        navigate('/')
    }
  return (
    <div className='shadow bg-white'>
        <nav className='flex item-center justify-between max-w-7x1 mx-auto px-4 py-3.5 text-slate-800 transtion-all'>
            <Link to='/'>
                <img src="/inkfolio-wordmark.svg" alt="" className='h-11 w-60' />
            </Link>
            <div className='flex items-center gap-4 text-sm'>
                <p className='max-sm:hidden'>Hi, {user?.name}</p>
                 <button onClick={logoutUser} className='bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all'>Logout</button>
            </div>
        </nav>
    </div>
  )
}

export default Navbar