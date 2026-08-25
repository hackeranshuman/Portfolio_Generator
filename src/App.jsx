import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import Resumebuilder from './pages/Resumebuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import Team from './pages/Team'

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/team" element={<Team />} />
                <Route path="app" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="builder/:resumeID" element={<Resumebuilder />}/>
                </Route>
                <Route path="view/:resumeID" element={<Preview />}/>
                <Route path="/login" element={<Login />}/>
            </Routes>
        </>
    )
}
export default App